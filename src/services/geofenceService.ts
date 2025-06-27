import {
  collection,
  getDocs,
  getFirestore,
  GeoPoint,
  type DocumentData,
} from "firebase/firestore";

const db = getFirestore();

export interface Geofence {
  id: string;
  location: GeoPoint;
  name: string;
  radius: number;
}

export const fetchAllGeofences = async (): Promise<Geofence[]> => {
  const geofenceRef = collection(db, "geofence");
  const snapshot = await getDocs(geofenceRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const location = data.location;

    if (
      !location ||
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number"
    ) {
      console.error(`Invalid geofence location in document ${doc.id}`, location);
      throw new Error("Invalid geofence location.");
    }

    return {
      id: doc.id,
      location,
      name: data.name,
      radius: data.radius,
    };
  });
};
