// src/components/chat/UserListItem.tsx
import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import type { Employee } from "../../services/chatsService";

interface Props {
  user: Employee;
  onClick: () => void;
}

const UserListItem: React.FC<Props> = ({ user, onClick }) => {
  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 2,
        mb: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        "&:hover": { bgcolor: "#f5f5f5" },
      }}
    >
      <Box>
        <Typography variant="subtitle1">
          {user.name} (#{user.employeeId})
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user.email}
        </Typography>
      </Box>
      <Chip
        label={user.role === "admin" ? "Admin" : "Employee"}
        color={user.role === "admin" ? "primary" : "default"}
        size="small"
      />
    </Paper>
  );
};

export default UserListItem;
