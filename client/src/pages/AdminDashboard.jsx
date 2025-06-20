// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Alert,
  useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import api from "../utils/api";

// Simple TabPanel helper
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const theme = useTheme();
  const [tab, setTab]           = useState(0);
  const [users, setUsers]       = useState([]);
  const [exams, setExams]       = useState([]);
  const [results, setResults]   = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [logins, setLogins]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/admin/users"),
      api.get("/admin/exams"),
      api.get("/admin/results"),
      api.get("/admin/feedback"),
      api.get("/admin/logins"),
    ])
      .then(([u, e, r, f, l]) => {
        setUsers(u.data);
        setExams(e.data);
        setResults(r.data);
        setFeedback(f.data);
        setLogins(l.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = (type, id) => {
    const url =
      type === "feedback" ? `/admin/feedback/${id}` :
      type === "logins"   ? `/admin/logins/${id}`   :
      `/admin/${type}/${id}`;

    api.delete(url)
      .then(() => {
        if (type === "users")    setUsers(us => us.filter(x => x._id !== id));
        if (type === "exams")    setExams(ex => ex.filter(x => x._id !== id));
        if (type === "results")  setResults(rs => rs.filter(x => x._id !== id));
        if (type === "feedback") setFeedback(fb => fb.filter(x => x._id !== id));
        if (type === "logins")   setLogins(lg => lg.filter(x => x._id !== id));
      })
      .catch((err) => {
        alert("Delete failed: " + err.message);
      });
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress size={48} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}22 0%, ${theme.palette.secondary.light}22 100%)`,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Admin Dashboard
        </Typography>

        <Paper elevation={2} sx={{ borderRadius: 1, mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Users" />
            <Tab label="Exams" />
            <Tab label="Results" />
            <Tab label="Feedback" />
            <Tab label="Logins" />
          </Tabs>
        </Paper>

        {/* Users */}
        <TabPanel value={tab} index={0}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                  <TableCell align="center"><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id} hover>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => handleDelete("users", u._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </TabPanel>

        {/* Exams */}
        <TabPanel value={tab} index={1}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Subject</strong></TableCell>
                  <TableCell align="center"><strong># Questions</strong></TableCell>
                  <TableCell align="center"><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exams.map((e) => (
                  <TableRow key={e._id} hover>
                    <TableCell>{e.subject}</TableCell>
                    <TableCell align="center">{e.questions?.length ?? 0}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => handleDelete("exams", e._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </TabPanel>

        {/* Results */}
        <TabPanel value={tab} index={2}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>Exam</strong></TableCell>
                  <TableCell align="center"><strong>Score</strong></TableCell>
                  <TableCell align="center"><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r._id} hover>
                    <TableCell>{r.student?.name ?? "—"}</TableCell>
                    <TableCell>{r.exam?.subject  ?? "—"}</TableCell>
                    <TableCell align="center">{r.score}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => handleDelete("results", r._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </TabPanel>

        {/* Feedback */}
        <TabPanel value={tab} index={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>Comment</strong></TableCell>
                  <TableCell><strong>Rating</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="center"><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedback.map((f) => (
                  <TableRow key={f._id} hover>
                    <TableCell>{f.student?.name ?? "—"}</TableCell>
                    <TableCell>{f.comment}</TableCell>
                    <TableCell>
                      {[...Array(f.rating)].map((_, i) => (
                        <StarIcon key={i} color="warning" fontSize="small" />
                      ))}
                    </TableCell>
                    <TableCell>{new Date(f.createdAt).toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => handleDelete("feedback", f._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </TabPanel>

        {/* Logins */}
        <TabPanel value={tab} index={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell><strong>Success?</strong></TableCell>
                  <TableCell><strong>IP</strong></TableCell>
                  <TableCell><strong>User-Agent</strong></TableCell>
                  <TableCell align="center"><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logins.map((l) => (
                  <TableRow key={l._id} hover>
                    <TableCell>{l.email}</TableCell>
                    <TableCell>{new Date(l.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{l.success ? "✅" : "❌"}</TableCell>
                    <TableCell>{l.ip || "—"}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 240,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {l.userAgent || "—"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => handleDelete("logins", l._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </TabPanel>
      </Container>
    </Box>
  );
}
