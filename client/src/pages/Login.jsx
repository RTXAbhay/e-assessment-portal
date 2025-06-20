// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Stack,
  Avatar,
  useTheme,
  Fade,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  // named import

export default function Login() {
  const theme    = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const roleHint = location.state?.roleHint; // "student" | "teacher" | "admin"

  const { login } = useContext(AuthContext);
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) =>
    setCreds(c => ({ ...c, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(creds);
      const { role } = jwtDecode(localStorage.getItem("token"));

      if (roleHint && role !== roleHint) {
        setError(`Logged in as ${role}, not ${roleHint}.`);
        return;
      }

      if (role === "admin")       navigate("/admin");
      else if (role === "teacher") navigate("/teacher");
      else                         navigate("/student");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  let title = "Student Login";
  if (roleHint === "teacher") title = "Teacher Login";
  else if (roleHint === "admin") title = "Admin Login";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}CC 0%, ${theme.palette.secondary.light}CC 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Fade in={mounted} timeout={800}>
        <Paper
          elevation={8}
          sx={{
            maxWidth: 360,
            width: "100%",
            p: 5,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            boxShadow: theme.shadows[12],
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              sx={{
                mx: "auto",
                mb: 2,
                bgcolor: theme.palette.secondary.main,
                width: 64,
                height: 64,
                boxShadow: theme.shadows[4],
              }}
            >
              <LockOpenIcon fontSize="large" />
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {roleHint
                ? `Enter your ${roleHint} credentials.`
                : "Please log in to continue."}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} variant="filled">
              {error}
            </Alert>
          )}

          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={creds.email}
              onChange={handleChange}
              autoComplete="email"
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={creds.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                textTransform: "none",
                py: 1.5,
                fontWeight: 600,
                boxShadow: theme.shadows[4],
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              Log In
            </Button>
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
}
