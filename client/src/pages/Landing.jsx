// src/pages/Landing.jsx
import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import examAnim from "../assets/exam-paper.json";

export default function Landing() {
  const nav = useNavigate();

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
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #42a5f5 0%, #66bb6a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.3)",
          zIndex: 1,
        },
      }}
    >
      {/* Particles */}
      <Particles
        init={handleParticlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 50, density: { enable: true, area: 600 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.3, random: { enable: true } },
            size: { value: { min: 1, max: 3 } },
            links: { enable: true, distance: 120, color: "#fff", opacity: 0.2, width: 1 },
            move: { enable: true, speed: 1.5, outModes: "bounce" },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" }, resize: true },
            modes: { grab: { distance: 180, links: { opacity: 0.4 } } },
          },
        }}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          zIndex: 1,
        }}
      />

      {/* Gradient blobs */}
      <Box
        sx={{
          position: "absolute",
          width: "35vw",
          height: "35vw",
          top: "-15%",
          left: "-15%",
          bgcolor: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent)",
          filter: "blur(100px)",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "45vw",
          height: "45vw",
          bottom: "-25%",
          right: "-20%",
          bgcolor: "radial-gradient(circle at 70% 70%, rgba(0,0,0,0.2), transparent)",
          filter: "blur(150px)",
          zIndex: 1,
        }}
      />

      {/* Hero content */}
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          px: 2,
          color: "#fff",
          zIndex: 2,
          maxWidth: 600,
          width: "100%",
        }}
      >
        {/* Centered Lottie */}
        <Box sx={{ mb: 2, mx: "auto", width: 200, height: 200 }}>
          <Lottie
            animationData={examAnim}
            loop
            style={{ width: "100%", height: "100%" }}
          />
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            mb: 2,
            textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          E-Assessment Portal
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            fontStyle: "italic",
            textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
          }}
        >
          Create, take, and manage online exams—all in one place.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<PersonIcon />}
            onClick={() => nav("/login", { state: { roleHint: "student" } })}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 4, py: 1.5,
              boxShadow: 4,
              "&:hover": { transform: "translateY(-2px)", boxShadow: 8 },
              transition: "all 0.3s ease",
            }}
          >
            Student Login
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SchoolIcon />}
            onClick={() => nav("/login", { state: { roleHint: "teacher" } })}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 4, py: 1.5,
              boxShadow: 4,
              "&:hover": { transform: "translateY(-2px)", boxShadow: 8 },
              transition: "all 0.3s ease",
            }}
          >
            Teacher Login
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            size="large"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => nav("/login", { state: { roleHint: "admin" } })}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 4, py: 1.5,
              borderColor: "#fff",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)", transform: "translateY(-2px)" },
              transition: "all 0.3s ease",
            }}
          >
            Admin Login
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
