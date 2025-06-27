// src/services/chatsService.ts
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  employeeId: string;
  availabilityStatus: string;
  salary: number;
  dob: string;
}

export const fetchAllEmployees = async (): Promise<Employee[]> => {
  const snap = await getDocs(collection(db, "employees"));
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Employee[];
};
