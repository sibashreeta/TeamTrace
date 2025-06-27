import React from "react";
import type { AttendanceRecord } from "../services/attendanceApi";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

interface Props {
  records: AttendanceRecord[];
}

const AttendanceLogTable: React.FC<Props> = ({ records }) => {
  return (
    <Paper elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Check-In Time</TableCell>
            <TableCell>Check-Out Time</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.date}>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.checkInTime ? record.checkInTime.toDate().toLocaleTimeString() : "N/A"}</TableCell>
              <TableCell>{record.checkOutTime ? record.checkOutTime.toDate().toLocaleTimeString() : "N/A"}</TableCell>
              <TableCell>{record.status || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default AttendanceLogTable;
