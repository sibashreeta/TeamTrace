// src/services/types.ts

import { Timestamp } from "firebase/firestore";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime?: Timestamp;
  checkOutTime?: Timestamp;
  status?: string;
}
//
