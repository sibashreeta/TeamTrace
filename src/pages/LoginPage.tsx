import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box
} from "@mui/material";
import { loginWithEmail, loginWithGoogle } from "../services/authService";
import type { UserData } from "../services/authService";

interface Props {
  onLogin: (user: UserData) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailLogin = async () => {
    try {
      const userData = await loginWithEmail(email, password);
      if (userData) onLogin(userData);
      else setError("User not registered in Firestore");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userData = await loginWithGoogle();
      if (userData) onLogin(userData);
      else setError("User not registered in Firestore");
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={6} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={handleEmailLogin}>
          Login with Email
        </Button>
        <Box mt={2}>
          <Button variant="outlined" fullWidth onClick={handleGoogleLogin}>
            Login with Google
          </Button>
        </Box>
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;
