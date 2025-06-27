// src/pages/AdminAttendanceLogs.tsx

import React, { useEffect, useState } from "react";
import { fetchAdminAttendanceLogs } from "../services/adminAttendanceService";
import type { AttendanceRecord } from "../services/types";
import { Button, CircularProgress, Container, Typography, TextField, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const AdminAttendanceLogs: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [employeeIdFilter, setEmployeeIdFilter] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminAttendanceLogs(20, lastDoc, employeeIdFilter);
      setRecords(prev => [...prev, ...result.records]);
      setLastDoc(result.lastDoc);
    } catch (err) {
      console.error("Error fetching admin logs:", err);
    }
    setLoading(false);
  };
//
  // Load on mount
  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = () => {
    setRecords([]);
    setLastDoc(null);
    loadData();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Attendance Logs</Typography>

      <TextField
        label="Filter by Employee ID"
        value={employeeIdFilter}
        onChange={(e) => setEmployeeIdFilter(e.target.value)}
        sx={{ mb: 2, mr: 2 }}
      />
      <Button variant="contained" onClick={handleFilter}>Apply Filter</Button>

      {loading && <CircularProgress sx={{ display: "block", mt: 2 }} />}

      <Paper sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Check-In</TableCell>
              <TableCell>Check-Out</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.employeeId}</TableCell>
                <TableCell>{record.employeeName}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.checkInTime ? record.checkInTime.toDate().toLocaleTimeString() : "N/A"}</TableCell>
                <TableCell>{record.checkOutTime ? record.checkOutTime.toDate().toLocaleTimeString() : "N/A"}</TableCell>
                <TableCell>{record.status || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {!loading && <Button variant="outlined" onClick={loadData} sx={{ mt: 2 }}>Load More</Button>}
    </Container>
  );
};

export default AdminAttendanceLogs;
