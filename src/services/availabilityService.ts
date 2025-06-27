import { getFirestore, doc, updateDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();

/**
 * Updates the availability status of the currently logged-in user.
 * It stores the status in the "employees" collection (you can change path if needed).
 */
export const updateAvailabilityStatus = async (status: string) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error("User not authenticated");

  const userDocRef = doc(db, "employees", user.uid); // or "users", "profiles", etc.
  await updateDoc(userDocRef, {
    availabilityStatus: status,
    statusUpdatedAt: Timestamp.now(),
  });
};
