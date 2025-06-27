

import React, { useEffect, useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

const statuses = [
  "Available",
  "On Break",
  "In a Meeting",
  "Working Remotely",
  "Offline",
];

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // YYYY-MM-DD
};

const AvailabilityStatus: React.FC = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const employeeDocRef = doc(db, "employees", user.uid);

    const unsubscribe = onSnapshot(employeeDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStatus(data.availabilityStatus || "");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = async (event: SelectChangeEvent<string>) => {
    const newStatus = event.target.value;
    setStatus(newStatus);

    const user = auth.currentUser;
    if (!user) return;

    const userId = user.uid;
    const today = getTodayDate();

    const employeeDocRef = doc(db, "employees", userId);
    const attendanceDocRef = doc(db, "attendance", `${userId}_${today}`);

    try {
      await Promise.all([
        updateDoc(employeeDocRef, { availabilityStatus: newStatus }),
        updateDoc(attendanceDocRef, { availabilityStatus: newStatus }),
      ]);
    } catch (err) {
      console.error("Failed to update availabilityStatus in one or both collections:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, bgcolor: "#f3f4f6", minWidth: 250 }}>
      <Typography variant="h6" sx={{ mb: 1, color: "#374151" }}>
        Set Availability Status
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="status-select-label">Status</InputLabel>
        <Select
          labelId="status-select-label"
          value={status}
          label="Status"
          onChange={handleChange}
          sx={{ bgcolor: "white", borderRadius: 2 }}
        >
          {statuses.map((statusOption) => (
            <MenuItem key={statusOption} value={statusOption}>
              {statusOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default AvailabilityStatus;
