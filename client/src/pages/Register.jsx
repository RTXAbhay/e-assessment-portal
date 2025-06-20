import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Stack,
  Alert,
  Avatar,
  Fade,
  useTheme,
  Link,
} from "@mui/material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    code: "",
  });
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      // navigate based on role
      if (form.role === "teacher") navigate("/teacher");
      else if (form.role === "admin") navigate("/admin");
      else navigate("/student");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.secondary.light}CC 0%, ${theme.palette.primary.light}CC 100%)`,
        backgroundImage:
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAHUlEQVQoU2NkYGD4z0AEYBxVSFpmkIVRjRrGgAE2Qh0qpBfNgAAAABJRU5ErkJggg==')",
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
            maxWidth: 400,
            width: "100%",
            p: 5,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            boxShadow: theme.shadows[12],
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              sx={{
                mx: "auto",
                mb: 2,
                bgcolor: theme.palette.primary.main,
                width: 64,
                height: 64,
                boxShadow: theme.shadows[4],
              }}
            >
              <HowToRegIcon fontSize="large" />
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Create an Account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} variant="filled">
              {error}
            </Alert>
          )}

          <Stack component="form" spacing={3} onSubmit={onSubmit} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handle}
              autoComplete="name"
              required
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": { transition: "border-color 0.3s" },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  { borderColor: theme.palette.primary.main },
              }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handle}
              autoComplete="email"
              required
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": { transition: "border-color 0.3s" },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  { borderColor: theme.palette.primary.main },
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handle}
              autoComplete="new-password"
              required
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": { transition: "border-color 0.3s" },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  { borderColor: theme.palette.primary.main },
              }}
            />

            <TextField
              select
              label="Role"
              name="role"
              value={form.role}
              onChange={handle}
              fullWidth
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            {/* Security code for teacher or admin */}
            {(form.role === "teacher" || form.role === "admin") && (
              <TextField
                label={
                  form.role === "admin" ? "Admin Security Code" : "Teacher Code"
                }
                name="code"
                type="password"
                value={form.code}
                onChange={handle}
                autoComplete="one-time-code"
                required
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": { transition: "border-color 0.3s" },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    { borderColor: theme.palette.primary.main },
                }}
              />
            )}

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
              Register
            </Button>
          </Stack>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
            >
              Log in
            </Link>
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
}
