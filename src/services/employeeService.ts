import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";

// ✅ Employee Interface
export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  dob: string;
  salary: number;
  role: "admin" | "employee";
  email: string;
  googleAccount: boolean;
}

// ✅ Create Employee (Auth + Firestore)
export const createEmployee = async (
  employee: Omit<Employee, "id" | "googleAccount">,
  password: string
): Promise<string> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    employee.email,
    password
  );
  const user = userCredential.user;

  const employeeData: Employee = {
    id: user.uid,
    employeeId: employee.employeeId,
    name: employee.name,
    dob: employee.dob,
    salary: employee.salary,
    role: employee.role,
    email: employee.email,
    googleAccount: false,
  };

  await setDoc(doc(db, "employees", user.uid), employeeData);
  return user.uid;
};

// ✅ Get All Employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  const querySnap = await getDocs(collection(db, "employees"));
  return querySnap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  } as Employee));
};

// ✅ Get Single Employee
export const getEmployee = async (uid: string): Promise<Employee | null> => {
  const docSnap = await getDoc(doc(db, "employees", uid));
  return docSnap.exists() ? (docSnap.data() as Employee) : null;
};

// ✅ Update Employee
export const updateEmployee = async (
  uid: string,
  updatedData: Partial<Employee>
) => {
  await updateDoc(doc(db, "employees", uid), updatedData);
};

// ✅ Delete Employee (Only from Firestore)
export const deleteEmployee = async (uid: string) => {
  await deleteDoc(doc(db, "employees", uid));
  // Auth deletion should be handled securely from backend/admin SDK
};
