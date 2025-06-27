import { getFirestore, doc, setDoc, addDoc, collection, Timestamp, GeoPoint, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { Location } from "../utils/locationUtils";

const db = getFirestore();

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // YYYY-MM-DD
};

export const markCheckIn = async (location: Location) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const date = getTodayDate();

  // Check if already has attendance doc for today
  const attendanceQuery = collection(db, "attendance");
  const attendanceId = `${user.uid}_${date}`; // deterministic ID (optional)

  const attendanceRef = doc(attendanceQuery, attendanceId);

  const snapshot = await getDoc(attendanceRef);

  if (!snapshot.exists()) {
    // create new attendance doc
    await setDoc(attendanceRef, {
      employeeId: user.uid,
      date,
      checkInTime: Timestamp.now(),
      checkInLocation: new GeoPoint(location.latitude, location.longitude),
    });
  } else {
    // only update checkInTime if not exists (prevent overwrite accidentally)
    const data = snapshot.data();
    if (!data.checkInTime) {
      await updateDoc(attendanceRef, {
        checkInTime: Timestamp.now(),
        checkInLocation: new GeoPoint(location.latitude, location.longitude),
      });
    }
  }
};

export const markCheckOut = async (location: Location) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const date = getTodayDate();

  const attendanceQuery = collection(db, "attendance");
  const attendanceId = `${user.uid}_${date}`;

  const attendanceRef = doc(attendanceQuery, attendanceId);

  await updateDoc(attendanceRef, {
    checkOutTime: Timestamp.now(),
    checkOutLocation: new GeoPoint(location.latitude, location.longitude),
  });
};

export const setStatus = async (status: string) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const date = getTodayDate();
  const attendanceId = `${user.uid}_${date}`;
  const attendanceRef = doc(db, "attendance", attendanceId);

  await updateDoc(attendanceRef, {
    status,
    evaluatedAt: Timestamp.now(),
  });
};
