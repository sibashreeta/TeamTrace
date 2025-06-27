// src/services/userService.ts

import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();

export interface Employee {
  id: string;
  name: string;
  email: string;
  // Add any additional fields you store
}

export const fetchEmployeeData = async (): Promise<Employee | null> => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const employeeRef = doc(db, "employees", user.uid);
  const employeeSnap = await getDoc(employeeRef);

  if (employeeSnap.exists()) {
    return { id: user.uid, ...(employeeSnap.data() as Omit<Employee, 'id'>) };
  } else {
    return null;
  }
};
