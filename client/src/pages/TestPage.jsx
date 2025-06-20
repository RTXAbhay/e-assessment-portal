// src/pages/TestPage.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Avatar,
  Stack,
  LinearProgress,
  Alert,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  Fade,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReplayIcon            from "@mui/icons-material/Replay";
import DashboardIcon         from "@mui/icons-material/Dashboard";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function TestPage() {
  const theme      = useTheme();
  const { subject } = useParams();
  const navigate    = useNavigate();
  const { user }    = useContext(AuthContext);

  const [exam, setExam]        = useState(null);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState("");
  const [answers, setAnswers]  = useState({});
  const [score, setScore]      = useState(null);

  useEffect(() => {
    api.get("/exams")
      .then(res => {
        const found = res.data.find(e => e.subject === subject);
        if (!found) throw new Error(`No exam for "${subject}"`);
        setExam(found);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [subject]);

  const handleChange = (qKey, opt) => {
    setAnswers(prev => ({ ...prev, [qKey]: opt }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let correct = 0;
    exam.questions.forEach(q => {
      if (answers[q._id] === q.answer) correct++;
    });
    const totalScore = correct * 5;
    setScore(totalScore);

    try {
      await api.post("/results", {
        student: user._id,
        exam:    exam._id,
        answers: Object.entries(answers).map(([qid, sel]) => ({ questionId: qid, selected: sel })),
        score: totalScore,
      });
    } catch (err) {
      console.error(err);
      alert("Could not save results: " + (err.response?.data?.error || err.message));
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setScore(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LinearProgress sx={{ width: "80%" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", py: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate("/student")}>Back to Dashboard</Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        py: 6,
        background: `linear-gradient(135deg, ${theme.palette.primary.light}11 0%, ${theme.palette.secondary.light}11 100%)`,
        overflow: "hidden",
      }}
    >
      {/* decorative bubbles */}
      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: theme.palette.primary.light,
          opacity: 0.2,
          top: 80,
          left: -40,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          backgroundColor: theme.palette.secondary.light,
          opacity: 0.15,
          bottom: -60,
          right: -80,
        }}
      />

      <Container maxWidth="sm">
        {/* Header */}
        <Fade in timeout={400}>
          <Paper
            elevation={3}
            sx={{ p: 4, mb: 6, textAlign: "center", borderRadius: 2 }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 64,
                height: 64,
                mb: 1,
              }}
            >
              <CheckCircleOutlineIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight={700}>
              {user.name}’s Test
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Subject: {subject}
            </Typography>
          </Paper>
        </Fade>

        {score === null ? (
          // === Test Form ===
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={4}>
              {exam.questions.map((q, idx) => (
                <Grid item key={q._id}>
                  <Fade in timeout={500 + idx * 100}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {idx + 1}. {q.text}{" "}
                        <Box component="span" color="text.secondary">({5} pts)</Box>
                      </Typography>
                      <FormControl component="fieldset">
                        <RadioGroup
                          value={answers[q._id] || ""}
                          onChange={e => handleChange(q._id, e.target.value)}
                        >
                          {q.options.map((opt, oi) => (
                            <FormControlLabel
                              key={oi}
                              value={opt}
                              control={<Radio required />}
                              label={opt}
                              sx={{
                                "&:hover": { bgcolor: theme.palette.action.hover },
                                borderRadius: 1,
                                px: 1,
                              }}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </Paper>
                  </Fade>
                </Grid>
              ))}
              <Grid item sx={{ textAlign: "center" }}>
                <Fade in timeout={800}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      borderRadius: "50px",
                      px: 6,
                      py: 1.5,
                      fontWeight: 600,
                      boxShadow: theme.shadows[4],
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    Submit Test
                  </Button>
                </Fade>
              </Grid>
            </Grid>
          </Box>
        ) : (
          // === Score + Review ===
          <Fade in timeout={400}>
            <Box>
              <Paper
                elevation={3}
                sx={{ p: 4, textAlign: "center", borderRadius: 2, mb: 4 }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.success.main,
                    width: 64,
                    height: 64,
                    mb: 2,
                  }}
                >
                  <CheckCircleOutlineIcon fontSize="large" />
                </Avatar>
                <Typography variant="h4" gutterBottom>
                  Score: {score} / {exam.questions.length * 5}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  sx={{ mt: 3 }}
                >
                  <Button
                    startIcon={<ReplayIcon />}
                    variant="outlined"
                    onClick={handleRetake}
                    sx={{
                      borderRadius: "50px",
                      px: 3,
                      transition: "all 0.2s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    Retake
                  </Button>
                  <Button
                    startIcon={<DashboardIcon />}
                    variant="contained"
                    onClick={() => navigate("/student")}
                    sx={{
                      borderRadius: "50px",
                      px: 3,
                      transition: "all 0.2s",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  >
                    Dashboard
                  </Button>
                </Stack>
              </Paper>

              {/* === Review Panel === */}
              <Typography variant="h5" gutterBottom>
                Review Your Answers
              </Typography>
              {exam.questions.map((q, i) => {
                const selected = answers[q._id];
                const correct  = q.answer;
                const isCorrect = selected === correct;

                return (
                  <Paper
                    key={q._id}
                    sx={{
                      p: 3,
                      mb: 2,
                      borderLeft: `6px solid ${isCorrect
                        ? theme.palette.success.main
                        : theme.palette.error.main}`,
                      background: theme.palette.background.paper,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {i + 1}. {q.text}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        component="div"
                        sx={{
                          color: isCorrect
                            ? theme.palette.success.dark
                            : theme.palette.error.dark,
                        }}
                      >
                        Your answer: {selected || "—"}
                      </Typography>
                      {!isCorrect && (
                        <Typography component="div" sx={{ color: theme.palette.success.main }}>
                          Correct answer: {correct}
                        </Typography>
                      )}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      {q.options.map((opt, oi) => (
                        <Typography
                          key={oi}
                          sx={{
                            mb: 0.5,
                            px: 1,
                            borderRadius: 1,
                            background:
                              opt === correct
                                ? theme.palette.success.light + "33"
                                : opt === selected
                                ? theme.palette.error.light + "33"
                                : "transparent",
                          }}
                        >
                          • {opt}
                        </Typography>
                      ))}
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}
