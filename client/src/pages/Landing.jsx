// src/pages/Landing.jsx
import React from "react";
import { Box, Button, Typography, Stack, Grid } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import examAnim from "../assets/exam-paper.json";

export default function Landing() {
  const navigate = useNavigate();

  const handleParticlesInit = async (engine) => {
    try {
      await loadFull(engine);
    } catch (err) {
      console.warn("ts-particles init failed:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)", // minus Navbar + Footer
        position: "relative",
        overflow: "hidden",
        bgcolor: "#f4f6f8",
        display: "flex",
        alignItems: "center",
        px: { xs: 2, sm: 6, md: 12 },
        pt: { xs: 4, md: 0 },
      }}
    >
      {/* Particles background */}
      <Particles
        init={handleParticlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 40, density: { enable: true, area: 800 } },
            color: { value: "#90caf9" },
            opacity: { value: 0.2 },
            size: { value: { min: 1, max: 3 } },
            links: { enable: true, color: "#90caf9", opacity: 0.3 },
            move: { enable: true, speed: 1.2 },
          },
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      />

      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="space-between"
        zIndex={2}
      >
        {/* Left Text */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h3"
            fontWeight={700}
            color="primary"
            sx={{ mb: 2 }}
          >
            Welcome to E-Assessment
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
            Create, take, and manage exams with ease – whether you're a student, teacher, or admin.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PersonIcon />}
              onClick={() => navigate("/login", { state: { roleHint: "student" } })}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Student Login
            </Button>

            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<SchoolIcon />}
              onClick={() => navigate("/login", { state: { roleHint: "teacher" } })}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Teacher Login
            </Button>

            <Button
              variant="text"
              color="secondary"
              size="large"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => navigate("/login", { state: { roleHint: "admin" } })}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Admin Login
            </Button>
          </Stack>
        </Grid>

        {/* Right Animation */}
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: 400, mx: "auto" }}>
            <Lottie animationData={examAnim} loop style={{ width: "100%" }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
