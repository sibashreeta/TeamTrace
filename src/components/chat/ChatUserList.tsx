// src/pages/ChatPage.tsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { fetchAllEmployees, type Employee } from "../../services/chatsService";
import UserListItem from "./UserListItem";
import ChatWindow from "../../components/chat/ChatWindow";
import { getAuth } from "firebase/auth";

const ChatPage: React.FC = () => {
  const [users, setUsers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);

  const currentUserId = getAuth().currentUser?.uid || "";

  useEffect(() => {
    fetchAllEmployees()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const handleUserClick = (user: Employee) => {
    setSelectedUser(user);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Chat with Employees
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, maxHeight: 500, overflowY: "auto" }}>
              {users.map((user) =>
                user.id !== currentUserId ? (
                  <UserListItem
                    key={user.id}
                    user={user}
                    onClick={() => handleUserClick(user)}
                  />
                ) : null
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            {selectedUser ? (
              <ChatWindow
                currentUserId={currentUserId}
                selectedUserId={selectedUser.id}
                selectedUserName={selectedUser.name}
              />
            ) : (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  color: "text.secondary",
                  height: "500px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6">
                  Select a user to start chatting
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ChatPage;
