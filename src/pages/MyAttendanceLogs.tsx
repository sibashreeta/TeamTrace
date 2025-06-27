import React, { useEffect, useState } from "react";
import AttendanceLogTable from "../components/AttendanceLogTable";
import { fetchAttendanceLogs, type AttendanceRecord } from "../services/attendanceApi";
import { Button, CircularProgress, Container, Typography } from "@mui/material";

const MyAttendanceLogs: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAttendanceLogs(20);
      setRecords(data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Attendance Logs</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <AttendanceLogTable records={records} />
          <Button variant="contained" onClick={loadData} sx={{ mt: 2 }}>Refresh</Button>
        </>
      )}
    </Container>
  );
};

export default MyAttendanceLogs;
