import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const MarkLeaveButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  const handleMarkLeave = async () => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const docId = `${user.uid}_${today}`;

    setLoading(true);
    try {
      await setDoc(doc(db, "attendance", docId), {
        employeeId: user.uid, // ✅ Required field
        status: "Leave",
        createdAt: serverTimestamp(),
      });

      alert("Leave marked successfully.");
    } catch (err) {
      console.error("Failed to mark leave:", err);
      alert("Failed to mark leave: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="warning"
      onClick={handleMarkLeave}
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : "Mark Leave"}
    </Button>
  );
};

export default MarkLeaveButton;
