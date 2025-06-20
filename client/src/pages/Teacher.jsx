// src/pages/Teacher.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Avatar,
  LinearProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
  Stack,
  Collapse,
  Fade,
  Button,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Switch,
  Alert,
  useTheme,
  Grid as MuiGrid,
} from "@mui/material";
import {
  Add as AddIcon,
  RemoveCircleOutline,
  Save as SaveIcon,
  QuestionAnswer as QAIcon,
  Assignment as ExamsIcon,
  History as ResultsIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material";
import api from "../utils/api";


// ── Auto‐Generate Tab ─────────────────────────────────────────────────────────
function AutoBuilderTab({ onComplete }) {
  const [topic, setTopic]       = useState("");
  const [difficulty, setDiff]   = useState("Medium");
  const [count, setCount]       = useState(5);
  const [loadingGen, setLoading]= useState(false);
  const [errorGen, setErrorGen] = useState("");
  const [successGen, setSuccess]= useState(false);

  const handleGenerate = async () => {
    setErrorGen("");
    setSuccess(false);
    setLoading(true);
    try {
      await api.post("/exams/auto", { topic, difficulty, count });
      setSuccess(true);
    } catch (e) {
      setErrorGen(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    onComplete();
    setTopic("");
    setDiff("Medium");
    setCount(5);
    setSuccess(false);
    setErrorGen("");
  };

  return (
    <Paper sx={{ p: 4, mb: 6 }}>
      <Typography variant="h5" gutterBottom>Auto-Generate Exam</Typography>

      {errorGen && <Alert severity="error" sx={{ mb: 2 }}>{errorGen}</Alert>}
      {successGen && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Generated {count} question{count > 1 && "s"} on “{topic}”!
        </Alert>
      )}

      <Stack spacing={3}>
        <TextField
          label="Topic"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          fullWidth required
        />
        <FormControl fullWidth>
          <InputLabel>Difficulty</InputLabel>
          <Select
            label="Difficulty"
            value={difficulty}
            onChange={e => setDiff(e.target.value)}
          >
            {["Easy","Medium","Hard"].map(d=>(<MenuItem key={d} value={d}>{d}</MenuItem>))}
          </Select>
        </FormControl>
        <TextField
          label="Number of Questions"
          type="number"
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          inputProps={{ min:1 }}
          fullWidth
        />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<AutorenewIcon />}
            onClick={handleGenerate}
            disabled={loadingGen}
          >
            {loadingGen ? "Generating…" : "Generate Exam"}
          </Button>
          {successGen && (
            <Button variant="outlined" onClick={handleDone}>
              Back to Dashboard
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}


// ── Teacher Dashboard ────────────────────────────────────────────────────────
export default function Teacher() {
  const theme = useTheme();

  const [tab, setTab]         = useState(0);
  const [exams, setExams]     = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Manual‐add/edit form state
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [subject, setSubject]     = useState("");
  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], answer: "" },
  ]);

  // View‐questions dialog
  const [openExam, setOpenExam] = useState(null);

  // load exams & results
  const loadData = () => {
    setLoading(true);
    Promise.all([ api.get("/exams"), api.get("/results") ])
      .then(([exR, reR]) => {
        setExams(exR.data);
        setResults(reR.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };
  useEffect(loadData, []);

  // Manual form helpers
  const addQuestion    = () =>
    setQuestions(qs => [...qs,{ text:"",options:["","","",""],answer:"" }]);
  const removeQuestion = i =>
    setQuestions(qs => qs.filter((_,idx)=>idx!==i));
  const updateText     = (i,v) =>
    setQuestions(qs => qs.map((q,idx)=>idx===i?{...q,text:v}:q));
  const updateOpt      = (qi,oi,v) =>
    setQuestions(qs => qs.map((q,idx)=>idx===qi?{...q,options:q.options.map((o,j)=>j===oi?v:o)}:q));
  const updateAns      = (qi,v) =>
    setQuestions(qs => qs.map((q,idx)=>idx===qi?{...q,answer:v}:q));

  // open form for create vs edit
  const openCreateForm = () => {
    setEditing(null);
    setSubject("");
    setQuestions([{ text:"",options:["","","",""],answer:""}]);
    setShowForm(true);
  };
  const openEditForm = ex => {
    setEditing(ex);
    setSubject(ex.subject);
    setQuestions(ex.questions);
    setShowForm(true);
  };

  // submit create or update
  const handleSubmit = async e => {
    e.preventDefault();
    if (!subject.trim()) return alert("Subject required");
    for (let q of questions) {
      if (!q.text.trim()||q.options.some(o=>!o.trim())||!q.answer) {
        return alert("Each question needs text, 4 options, and an answer");
      }
    }
    try {
      const payload = {
        subject: subject.trim(),
        questions: questions.map(q=>({
          text:q.text.trim(),
          options:q.options.map(o=>o.trim()),
          answer:q.answer
        }))
      };
      let res;
      if (editing) {
        res = await api.put(`/exams/${editing._id}`, payload);
        setExams(xs => xs.map(x=>x._id===editing._id?res.data:x));
      } else {
        res = await api.post("/exams", payload);
        setExams(xs => [...xs,res.data]);
      }
      setShowForm(false);
    } catch(err) {
      alert("Save failed: "+err.message);
    }
  };

  // delete exam
  const handleDelete = async id => {
    if (!window.confirm("Delete?")) return;
    await api.delete(`/exams/${id}`);
    setExams(xs=>xs.filter(x=>x._id!==id));
  };
  // toggle active
  const handleToggle = async (id, active) => {
    const res = await api.put(`/exams/${id}`, { active });
    setExams(xs => xs.map(x=>x._id===id?res.data:x));
  };

  if (loading) return <LinearProgress />;
  if (error)   return <Typography color="error" sx={{ p:4 }}>{error}</Typography>;

  return (
    <Box sx={{ py:6 }}>
      <Container maxWidth="lg">
        <Paper sx={{ mb:4,p:4,textAlign:"center" }}>
          <Stack alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor:theme.palette.primary.main,width:64,height:64 }}>
              <QAIcon fontSize="large"/>
            </Avatar>
            <Typography variant="h4">Teacher Dashboard</Typography>
          </Stack>
        </Paper>

        <Tabs value={tab} onChange={(_,v)=>setTab(v)} centered sx={{ mb:4 }}>
          <Tab icon={<ExamsIcon />}   label="Exams"/>
          <Tab icon={<ResultsIcon/>}  label="Results"/>
          <Tab icon={<AutorenewIcon/>}label="Auto-Generate"/>
        </Tabs>

        {tab===0 && (
          <>
            <Box sx={{ textAlign:"right",mb:3 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon/>}
                onClick={openCreateForm}
              >
                Add New Exam
              </Button>
            </Box>

            {/* Manual Form */}
            <Collapse in={showForm}>
              <Fade in={showForm}>
                <Paper sx={{ p:4, mb:6 }}>
                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      label="Subject"
                      value={subject}
                      onChange={e=>setSubject(e.target.value)}
                      fullWidth required sx={{ mb:3 }}
                    />
                    {questions.map((q,qi)=>(
                      <Paper key={qi} sx={{
                        p:3,mb:3,
                        position:"relative",
                        borderLeft:`4px solid ${theme.palette.primary.main}`
                      }}>
                        <IconButton
                          color="error"
                          onClick={()=>removeQuestion(qi)}
                          sx={{ position:"absolute",top:8,right:8 }}
                        >
                          <RemoveCircleOutline/>
                        </IconButton>
                        <TextField
                          label={`Question ${qi+1}`}
                          value={q.text}
                          onChange={e=>updateText(qi,e.target.value)}
                          fullWidth required sx={{ mb:2 }}
                        />
                        <MuiGrid container spacing={2} sx={{ mb:2 }}>
                          {q.options.map((opt,oi)=>(
                            <MuiGrid item xs={12} sm={6} md={3} key={oi}>
                              <TextField
                                label={`Option ${oi+1}`}
                                value={opt}
                                onChange={e=>updateOpt(qi,oi,e.target.value)}
                                fullWidth required
                              />
                            </MuiGrid>
                          ))}
                        </MuiGrid>
                        <FormControl fullWidth required>
                          <InputLabel>Correct Answer</InputLabel>
                          <Select
                            value={q.answer}
                            label="Correct Answer"
                            onChange={e=>updateAns(qi,e.target.value)}
                          >
                            {q.options.map((_,oi)=>(
                              <MenuItem key={oi} value={q.options[oi]}>
                                Option {oi+1}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Paper>
                    ))}
                    <Stack direction="row" justifyContent="space-between">
                      <Button variant="outlined" startIcon={<AddIcon/>} onClick={addQuestion}>
                        Add Question
                      </Button>
                      <Button type="submit" variant="contained" startIcon={<SaveIcon/>}>
                        {editing?"Update Exam":"Save Exam"}
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              </Fade>
            </Collapse>

            {/* Exams Grid */}
            <Grid container spacing={4}>
              {exams.map(ex=>(
                <Grid item xs={12} sm={6} md={4} key={ex._id}>
                  <Paper sx={{ p:2,position:"relative" }}>
                    <Typography variant="h6">{ex.subject}</Typography>
                    <Typography color="text.secondary">
                      {ex.questions.length} question{ex.questions.length>1&&"s"}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt:2 }}>
                      <IconButton size="small" color="primary" onClick={()=>openEditForm(ex)}>
                        <EditIcon/>
                      </IconButton>
                      <Switch
                        checked={ex.active}
                        onChange={e=>handleToggle(ex._id,e.target.checked)}
                        size="small"
                      />
                      <IconButton size="small" color="error" onClick={()=>handleDelete(ex._id)}>
                        <DeleteIcon/>
                      </IconButton>
                      <Button size="small" onClick={()=>setOpenExam(ex)}>
                        View
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {tab===1 && (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map(r=>(
                  <TableRow key={r._id}>
                    <TableCell>{r.student?.name||"—"}</TableCell>
                    <TableCell>{r.exam?.subject||"—"}</TableCell>
                    <TableCell>{r.score}</TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {tab===2 && <AutoBuilderTab onComplete={loadData}/>}

      </Container>

      {/* View Questions Dialog */}
      <Dialog
        open={Boolean(openExam)}
        onClose={()=>setOpenExam(null)}
        fullWidth maxWidth="sm"
      >
        <DialogTitle>
          {openExam?.subject||"Exam"} — Questions
          <IconButton onClick={()=>setOpenExam(null)} sx={{ position:"absolute",right:8,top:8 }}>
            <CloseIcon/>
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {openExam?.questions.map((q,i)=>(
              <ListItem key={i} alignItems="flex-start">
                <ListItemText
                  primary={`${i+1}. ${q.text}`}
                  secondary={
                    <Box sx={{ pl:2 }}>
                      {q.options.map((opt,j)=>(<>
                        • {opt}
                        {opt===q.answer && (
                          <Typography component="span" sx={{ color:theme.palette.success.main, ml:1 }}>
                            (correct)
                          </Typography>
                        )}
                        <br/>
                      </>))}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
