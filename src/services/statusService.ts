import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { fetchAllGeofences, type Geofence } from "./geofenceService";
import { calculateDistance } from "../utils/distanceUtils";

const db = getFirestore();

const HALF_DAY_MINUTES = 1;
const FULL_DAY_MINUTES = 2;

const getTodayDate = (): string => {
  const today = new Date();
  return today.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
};

const isWithinGeofence = (
  geofences: Geofence[],
  lat: number,
  lon: number
): boolean => {
  return geofences.some((geofence) => {
    const distance = calculateDistance(
      lat,
      lon,
      geofence.location.latitude,
      geofence.location.longitude
    );
    console.log(`[GEOFENCE CHECK] (${lat},${lon}) -> (${geofence.location.latitude},${geofence.location.longitude}) = ${distance.toFixed(2)}m [limit=${geofence.radius}]`);
    return distance <= geofence.radius;
  });
};

interface AttendanceData {
  checkInTime: Timestamp;
  checkOutTime?: Timestamp;
  checkInLocation: { latitude: number; longitude: number };
  checkOutLocation?: { latitude: number; longitude: number };
}

export const evaluateAttendanceStatus = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const date = getTodayDate();
  const attendanceId = `${user.uid}_${date}`;
  const attendanceRef = doc(db, "attendance", attendanceId);
  const attendanceSnap = await getDoc(attendanceRef);

  if (!attendanceSnap.exists()) {
    throw new Error("No attendance record found for today.");
  }

const data = attendanceSnap.data() as AttendanceData & { status?: string };

if (data.status === "Leave") {
  console.log("User is on leave.");
  return "Leave";
}

  const { checkInLocation, checkOutLocation } = data;

  if (
    !checkInLocation ||
    typeof checkInLocation.latitude !== "number" ||
    typeof checkInLocation.longitude !== "number"
  ) {
    console.error("Invalid check-in location:", checkInLocation);
    throw new Error("Check-in location is missing or invalid.");
  }

  console.log("\n--- Attendance Raw Data ---");
  console.log("Check-In Location:", checkInLocation);
  console.log("Check-Out Location:", checkOutLocation);

  const checkInTime = data.checkInTime.toDate();
  let checkOutTime: Date | null = null;
  let workMinutes = 0;

  if (data.checkOutTime) {
    checkOutTime = data.checkOutTime.toDate();
    workMinutes = (checkOutTime.getTime() - checkInTime.getTime()) / 60000;
  }

  console.log("\n--- Time Info ---");
  console.log("Check-In:", checkInTime);
  console.log("Check-Out:", checkOutTime);
  console.log("Work Minutes:", workMinutes);

  let geofences: Geofence[] = [];
  try {
    geofences = await fetchAllGeofences();
  } catch (err) {
    console.error("Failed to fetch geofences:", err);
  }

  console.log("\n--- Geofence Data ---");
  console.log("Available Geofences:", geofences);

  const inCheckInGeofence = isWithinGeofence(
    geofences,
    checkInLocation.latitude,
    checkInLocation.longitude
  );

  const inCheckOutGeofence =
    checkOutLocation &&
    typeof checkOutLocation.latitude === "number" &&
    typeof checkOutLocation.longitude === "number"
      ? isWithinGeofence(
          geofences,
          checkOutLocation.latitude,
          checkOutLocation.longitude
        )
      : false;

  console.log("\n--- Geofence Status ---");
  console.log("Check-in in Geofence:", inCheckInGeofence);
  console.log("Check-out in Geofence:", inCheckOutGeofence);

  const geofenceValid = inCheckInGeofence || inCheckOutGeofence;

  let finalStatus = "Absent";

  if (!checkOutTime) {
    finalStatus = "In Progress";
  } else if (workMinutes < HALF_DAY_MINUTES) {
    finalStatus = "Absent";
  } else if (workMinutes >= HALF_DAY_MINUTES && workMinutes < FULL_DAY_MINUTES && geofenceValid) {
    finalStatus = "Half Day";
  } else if (workMinutes >= FULL_DAY_MINUTES && geofenceValid) {
    finalStatus = "Full Day";
  }

  console.log("\n--- Final Evaluation ---");
  console.log("Final Attendance Status:", finalStatus);

  await updateDoc(attendanceRef, {
    status: finalStatus,
    evaluatedAt: Timestamp.now(),
  });

  return finalStatus;
};
