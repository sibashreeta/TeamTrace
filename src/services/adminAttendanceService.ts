// src/services/adminAttendanceService.ts

import { db } from "./firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  getDoc,
  DocumentSnapshot,
} from "firebase/firestore";
import type { AttendanceRecord } from "./types";//

const employeeCache: Record<string, string> = {};

async function getEmployeeName(employeeId: string): Promise<string> {
  if (employeeCache[employeeId]) {
    return employeeCache[employeeId];
  }
  try {
    const employeeRef = doc(db, "employees", employeeId);
    const employeeSnap = await getDoc(employeeRef);
    const employeeData = employeeSnap.data();
    const name = employeeData?.name || "Unknown";
    employeeCache[employeeId] = name;
    return name;
  } catch (err) {
    console.error(`Error fetching employee data for ID ${employeeId}:`, err);
    return "Unknown";
  }
}

export async function fetchAdminAttendanceLogs(
  limitCount: number,
  lastDoc?: DocumentSnapshot,
  employeeIdFilter?: string
): Promise<{ records: AttendanceRecord[]; lastDoc: DocumentSnapshot | null }> {
  
  const attendanceRef = collection(db, "attendance");
  let q;

  if (employeeIdFilter) {
    const prefix = `${employeeIdFilter}_`;

    q = query(
      attendanceRef,
      where("__name__", ">=", prefix),
      where("__name__", "<", prefix + "\uf8ff"),
      orderBy("__name__"),
      ...(lastDoc ? [startAfter(lastDoc)] : []),
      limit(limitCount)
    );
  } else {
    q = query(
      attendanceRef,
      orderBy("__name__"),
      ...(lastDoc ? [startAfter(lastDoc)] : []),
      limit(limitCount)
    );
  }

  const snapshot = await getDocs(q);

  const records: AttendanceRecord[] = [];

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const [employeeId, date] = docSnap.id.split("_");

    const employeeName = await getEmployeeName(employeeId);

    records.push({
      id: docSnap.id,
      employeeId,
      employeeName,
      date,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      status: data.status,
    });
  }

  const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { records, lastDoc: newLastDoc };
}
