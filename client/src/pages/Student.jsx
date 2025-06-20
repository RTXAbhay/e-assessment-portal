// src/pages/Student.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  TextField,
  List,
  ListItem,
  IconButton,
  CircularProgress,
  useTheme,
  AppBar,
  Toolbar,
  InputAdornment,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Visibility as VisibilityIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  SmartToy as BotIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Student() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Tab state: 0=Exams, 1=Results, 2=Chat
  const [tab, setTab] = useState(0);

  // Exams + Results data
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Review dialog state
  const [openReview, setOpenReview] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState("");

  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { role: "system", content: "You are a helpful study assistant." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  // Fetch exams, results, and chat history on mount
  useEffect(() => {
    api
      .get("/exams")
      .then((r) => setExams(r.data || []))
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoadingExams(false));

    api
      .get(`/results/student/${user._id}`)
      .then((r) => setResults(r.data || []))
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoadingResults(false));

    api
      .get("/chat")
      .then((r) =>
        setChatMessages((m) => [...m, ...(r.data.messages || [])])
      )
      .catch(() => {});
  }, [user._id]);

  // Load full exam when opening review
  useEffect(() => {
    if (!openReview) return;
    const ref = openReview.exam;

    // If exam ref is missing entirely
    if (!ref) {
      setSelectedExam(null);
      setExamError("This exam is no longer available.");
      return;
    }

    // If we already have full questions object
    if (ref.questions) {
      setSelectedExam(ref);
      return;
    }

    // Otherwise fetch by ID
    const id = typeof ref === "object" ? ref._id : ref;
    setExamLoading(true);
    setExamError("");
    api
      .get(`/exams/${id}`)
      .then((r) => setSelectedExam(r.data))
      .catch((e) =>
        setExamError(e.response?.data?.error || e.message)
      )
      .finally(() => setExamLoading(false));
  }, [openReview]);

  // Send chat message
  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput.trim() };
    setChatMessages((m) => [...m, userMsg]);
    setChatInput("");
    setChatLoading(true);
    setChatError("");

    try {
      const { data } = await api.post("/chat", {
        messages: [...chatMessages, userMsg],
      });
      setChatMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply },
      ]);
    } catch (e) {
      setChatError(e.response?.data?.error || e.message);
    } finally {
      setChatLoading(false);
    }
  };

  if (loadError) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Alert severity="error">{loadError}</Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        py: 6,
        background: `linear-gradient(135deg, ${theme.palette.primary.light}22, ${theme.palette.secondary.light}22)`,
      }}
    >
      <Container maxWidth="lg">
        {/* Greeting */}
        <Paper
          elevation={3}
          sx={{ mb: 4, p: 4, display: "flex", alignItems: "center", gap: 2 }}
        >
          <Avatar
            sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56 }}
          >
            <AssignmentIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Hello, {user.name}!
            </Typography>
            <Typography color="text.secondary">Ready to learn?</Typography>
          </Box>
        </Paper>

        {/* Tabs */}
        <Paper elevation={1} sx={{ mb: 4, borderRadius: 1 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab icon={<AssignmentIcon />} label="Exams" />
            <Tab icon={<HistoryIcon />} label="Results" />
            <Tab icon={<ChatIcon />} label="Chat Bot" />
          </Tabs>
        </Paper>

        {/* Exams Tab */}
        {tab === 0 && (
          <>
            {loadingExams ? (
              <LinearProgress sx={{ mb: 4 }} />
            ) : (
              <Grid container spacing={3}>
                {exams.map((ex) => (
                  <Grid item xs={12} sm={6} md={4} key={ex._id}>
                    <Card
                      elevation={3}
                      sx={{
                        borderRadius: 1,
                        transition: "transform 0.2s",
                        "&:hover": { transform: "translateY(-5px)" },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight={600}>
                          {ex.subject}
                        </Typography>
                        <Typography color="text.secondary">
                          {ex.questions.length} questions
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => navigate(`/test/${ex.subject}`)}
                        >
                          Take Test
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Results Tab */}
        {tab === 1 && (
          <>
            {loadingResults ? (
              <LinearProgress sx={{ mb: 4 }} />
            ) : (
              <Paper elevation={3}>
                {results.length === 0 ? (
                  <Typography p={2}>No results yet.</Typography>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell align="center">Review</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((r) => (
                        <TableRow key={r._id} hover>
                          <TableCell>{r.exam?.subject}</TableCell>
                          <TableCell>
                            {new Date(r.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell>{r.score}</TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => setOpenReview(r)}
                            >
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Paper>
            )}
          </>
        )}

        {/* Chat Bot Tab */}
        {tab === 2 && (
          <Paper
            elevation={6}
            sx={{
              mx: "auto",
              borderRadius: 2,
              overflow: "hidden",
              maxWidth: 800,
            }}
          >
            {/* Header Bar */}
            <AppBar position="static" color="primary" elevation={1}>
              <Toolbar variant="dense">
                <ChatIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Study Chat Bot
                </Typography>
              </Toolbar>
            </AppBar>

            {/* Chat History */}
            <Box
              sx={{
                height: 450,
                bgcolor: theme.palette.background.default,
                p: 2,
                overflowY: "auto",
              }}
            >
              {chatError && <Alert severity="error">{chatError}</Alert>}
              <List disablePadding>
                {chatMessages
                  .filter((m) => m.role !== "system")
                  .map((m, i) => {
                    const isUser = m.role === "user";
                    return (
                      <ListItem
                        key={i}
                        sx={{
                          display: "flex",
                          justifyContent: isUser ? "flex-end" : "flex-start",
                          mb: 1,
                        }}
                      >
                        <Card
                          sx={{
                            maxWidth: "70%",
                            bgcolor: isUser
                              ? theme.palette.primary.main
                              : theme.palette.grey[100],
                            color: isUser
                              ? theme.palette.primary.contrastText
                              : theme.palette.text.primary,
                            p: 1,
                            borderRadius: 2,
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="flex-start"
                            spacing={1}
                          >
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                bgcolor: isUser
                                  ? theme.palette.primary.dark
                                  : theme.palette.grey[400],
                                fontSize: 14,
                              }}
                            >
                              {isUser ? (
                                <PersonIcon fontSize="small" />
                              ) : (
                                <BotIcon fontSize="small" />
                              )}
                            </Avatar>
                            <Typography variant="body2">
                              {m.content}
                            </Typography>
                          </Stack>
                        </Card>
                      </ListItem>
                    );
                  })}
                {chatLoading && (
                  <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </List>
            </Box>

            {/* Input Footer */}
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleChat();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                borderTop: `1px solid ${theme.palette.divider}`,
                p: 1,
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Type your message…"
                fullWidth
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="primary"
                        onClick={handleChat}
                        disabled={chatLoading}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>
        )}
      </Container>

      {/* Review Dialog */}
      <Dialog
        open={Boolean(openReview)}
        onClose={() => {
          setOpenReview(null);
          setSelectedExam(null);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Review — {selectedExam?.subject || ""}</DialogTitle>
        <DialogContent dividers>
          {examLoading ? (
            <LinearProgress />
          ) : examError ? (
            <Alert severity="warning">{examError}</Alert>
          ) : !selectedExam ? (
            <Alert severity="warning">
              This exam is no longer available— it may have been removed by the
              administrator.
            </Alert>
          ) : (
            selectedExam.questions.map((q, idx) => {
              const ans = openReview.answers.find(
                (a) => a.questionId === q._id
              );
              const isCorrect = ans?.selected === q.answer;
              return (
                <Box key={q._id} mb={2}>
                  <Typography fontWeight={600}>
                    {idx + 1}. {q.text}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {isCorrect ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                    <Typography
                      color={isCorrect ? "success.main" : "error.main"}
                    >
                      Your answer: {ans?.selected || "—"}
                    </Typography>
                  </Stack>
                  {!isCorrect && (
                    <Typography color="success.main">
                      Correct: {q.answer}
                    </Typography>
                  )}
                  <Divider sx={{ mt: 2 }} />
                </Box>
              );
            })
          )}
          <Box textAlign="right" mt={2}>
            <Button
              onClick={() => {
                setOpenReview(null);
                setSelectedExam(null);
              }}
            >
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
