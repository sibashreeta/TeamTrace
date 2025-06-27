import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  type Employee,
} from "../services/employeeService";

export const EmployeeForm: React.FC = () => {
  const [form, setForm] = useState<Omit<Employee, "id" | "googleAccount">>({
    employeeId: "",
    name: "",
    dob: "",
    salary: 0,
    role: "employee",
    email: "",
  });

  const [password, setPassword] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value,
    }));
  };

  const validateForm = () => {
    if (!form.employeeId || !form.name || !form.dob || !form.email) {
      setError("All required fields must be filled.");
      return false;
    }
    if (!editingId && !password) {
      setError("Password is required when creating a new employee.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        await updateEmployee(editingId, form);
        setSuccess("Employee updated successfully.");
        setEditingId(null);
      } else {
        await createEmployee(form, password);
        setSuccess("Employee created successfully.");
      }
      fetchEmployees();
      resetForm();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  const handleEdit = (emp: Employee) => {
    setForm({
      employeeId: emp.employeeId,
      name: emp.name,
      dob: emp.dob,
      salary: emp.salary,
      role: emp.role,
      email: emp.email,
    });
    setEditingId(emp.id);
    setPassword("");
  };

  const handleDelete = async (uid: string) => {
    try {
      await deleteEmployee(uid);
      fetchEmployees();
      setSuccess("Employee deleted.");
    } catch (err: any) {
      setError("Failed to delete employee.");
    }
  };

  const fetchEmployees = async () => {
    const data = await getAllEmployees();
    setEmployees(data);
  };

  const resetForm = () => {
    setForm({
      employeeId: "",
      name: "",
      dob: "",
      salary: 0,
      role: "employee",
      email: "",
    });
    setPassword("");
    setEditingId(null);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {editingId ? "Edit Employee" : "Create Employee"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="employeeId"
            label="Employee ID"
            fullWidth
            required
            value={form.employeeId}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="name"
            label="Name"
            fullWidth
            required
            value={form.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="dob"
            label="Date of Birth"
            type="date"
            fullWidth
            required
            value={form.dob}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="salary"
            label="Salary"
            type="number"
            fullWidth
            required
            value={form.salary}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            name="role"
            label="Role"
            fullWidth
            value={form.role}
            onChange={handleChange}
          >
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            required
            value={form.email}
            onChange={handleChange}
            disabled={!!editingId}
          />
        </Grid>
        {!editingId && (
          <Grid item xs={12} sm={6}>
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {editingId ? "Update Employee" : "Create Employee"}
        </Button>
        {editingId && (
          <Button sx={{ ml: 2 }} onClick={resetForm}>
            Cancel Edit
          </Button>
        )}
      </Box>

      <Typography variant="h6" sx={{ mt: 4 }}>
        All Employees
      </Typography>
      {employees.map((emp) => (
        <Box
          key={emp.id}
          sx={{ border: "1px solid #ccc", borderRadius: 1, p: 2, mb: 1 }}
        >
          <Typography>Employee ID: {emp.employeeId}</Typography>
          <Typography>Name: {emp.name}</Typography>
          <Typography>Email: {emp.email}</Typography>
          <Typography>Role: {emp.role}</Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => handleEdit(emp)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(emp.id)}
          >
            Delete
          </Button>
        </Box>
      ))}

      {/* Alerts */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};
