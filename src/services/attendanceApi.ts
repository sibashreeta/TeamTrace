import { db, auth } from "./firebase";
import { collection, query, where, orderBy, limit, startAfter, getDocs, Timestamp, DocumentSnapshot } from "firebase/firestore";

// Define your AttendanceRecord interface
export interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime?: Timestamp;
  checkOutTime?: Timestamp;
  status?: string;
}

export async function fetchAttendanceLogs(limitCount: number, lastDoc?: DocumentSnapshot): Promise<AttendanceRecord[]> {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const attendanceRef = collection(db, "attendance");

  const prefix = `${user.uid}_`;

  let q;

  if (lastDoc) {
    // If paginating, use startAfter with lastDoc
    q = query(
      attendanceRef,
      where("__name__", ">=", prefix),
      where("__name__", "<", prefix + "\uf8ff"),
      orderBy("__name__"),
      startAfter(lastDoc),
      limit(limitCount)
    );
  } else {
    // First page load
    q = query(
      attendanceRef,
      where("__name__", ">=", prefix),
      where("__name__", "<", prefix + "\uf8ff"),
      orderBy("__name__"),
      limit(limitCount)
    );
  }

  const snapshot = await getDocs(q);

  const results: AttendanceRecord[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    const date = doc.id.split("_")[1];  // extract date part from ID

    return {
      id: doc.id,
      date: date,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      status: data.status,
    };
  });

  return results;
}
