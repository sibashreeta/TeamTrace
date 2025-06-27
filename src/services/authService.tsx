// /services/authService.ts

import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Full Employee Data
export interface UserData {
  id: string;
  email: string;
  googleAccount: boolean;
  role: "admin" | "employee";
  name: string;
  dob: string;
  salary: number;
}

export const loginWithEmail = async (email: string, password: string): Promise<UserData | null> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return await fetchUserData(userCredential.user);
};

export const loginWithGoogle = async (): Promise<UserData | null> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return await fetchUserData(userCredential.user);
};

const fetchUserData = async (user: User): Promise<UserData | null> => {
  // assuming your Firestore collection is named "employees"
  const userDoc = await getDoc(doc(db, "employees", user.uid));
  
  if (userDoc.exists()) {
    const data = userDoc.data();

    return {
      id: user.uid,
      email: user.email || "",
      googleAccount: data.googleAccount ?? false,
      role: data.role ?? "employee",
      name: data.name ?? "",
      dob: data.dob ?? "",
      salary: data.salary ?? 0
    };
  } else {
    return null; // user not registered in Firestore
  }
};
