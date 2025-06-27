import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  onSnapshot
} from "firebase/firestore";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const db = getFirestore();

interface Employee {
  id: string;
  email: string;
  availabilityStatus?: string;
}

const EmployeeAvailabilityBoard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "employees"), (snapshot) => {
      const data: Employee[] = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          email: docData.email || "Unknown",
          availabilityStatus: docData.availabilityStatus || "Unavailable",
        };
      });
      setEmployees(data);
    });

    return () => unsub(); // Clean up listener on unmount
  }, []);

  return (
    <Box p={2} component={Paper} elevation={3}>
      <Typography variant="h6" gutterBottom>
        Real-Time Employee Availability
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.availabilityStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default EmployeeAvailabilityBoard;
