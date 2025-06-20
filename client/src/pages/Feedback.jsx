// src/pages/Feedback.jsx
import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Rating,
  Avatar,
  useTheme,
  Alert,
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function Feedback() {
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  const [comment, setComment] = useState("");
  const [rating, setRating]   = useState(0);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || rating < 1) {
      setError("Please enter your feedback and select at least one star.");
      return;
    }
    setError("");
    try {
      await api.post("/feedback", {
        student: user.id,
        comment,
        rating,
      });
      setSuccess(true);
      setComment("");
      setRating(0);
    } catch (err) {
      setError(err.response?.data?.error || "Submission failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        py: 6,
        background: `linear-gradient(135deg, ${theme.palette.primary.light}11 0%, ${theme.palette.secondary.light}11 100%)`,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <FeedbackIcon />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Feedback
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Thank you for your feedback!
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Your Feedback"
              multiline
              rows={4}
              fullWidth
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
              <Typography>Rating:</Typography>
              <Rating
                name="feedback-rating"
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
              />
            </Stack>

            <Box textAlign="right">
              <Button type="submit" variant="contained" size="large">
                Submit
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
