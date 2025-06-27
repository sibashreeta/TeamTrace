import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import { getCurrentLocation } from "../utils/locationUtils";
import { markCheckIn, markCheckOut } from "../services/attendanceService";
import { evaluateAttendanceStatus } from "../services/statusService";
import AvailabilityStatus from "./AvailabilityStatus";

const AttendanceButtons: React.FC = () => {
  const [hasCheckedIn, setHasCheckedIn] = useState(false); // toggle between buttons
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckIn = async () => {
    try {
      const location = await getCurrentLocation();
      await markCheckIn(location);
      setHasCheckedIn(true);
      setMessage("Check-In successful!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      const location = await getCurrentLocation();
      await markCheckOut(location);
      await evaluateAttendanceStatus();
      setHasCheckedIn(false);
      setMessage("Check-Out and Status Evaluation successful!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      {!hasCheckedIn ? (
        <Button variant="contained" color="primary" onClick={handleCheckIn}>
          Check In
        </Button>
      ) : (
        <>
          <Button variant="contained" color="secondary" onClick={handleCheckOut}>
            Check Out
          </Button>

          {/* Availability dropdown here */}
          <AvailabilityStatus />
        </>
      )}

      <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage(null)}>
        <Alert severity="success" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AttendanceButtons;
