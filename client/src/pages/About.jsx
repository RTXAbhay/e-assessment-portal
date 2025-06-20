// src/pages/About.jsx
import React from "react";
import {
  Container,
  Typography,
  Paper,
  Stack,
  Avatar,
  useTheme,
  Grid,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function About() {
  const theme = useTheme();

  return (
    <Container sx={{ py: 6, maxWidth: "lg" }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 3,
          background: theme.palette.background.paper,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            mb: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            py: 2,
            px: 3,
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "common.white", color: theme.palette.primary.main }}>
            <InfoIcon />
          </Avatar>
          <Typography variant="h4" sx={{ color: "common.white" }}>
            About Us
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Our Mission
            </Typography>
            <Typography paragraph>
              To provide a flexible, secure, and user-friendly platform for
              online testing and real-time result management.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Our Vision
            </Typography>
            <Typography paragraph>
              Empower educators and learners worldwide with tools that
              streamline assessment and feedback processes.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Technology Stack
            </Typography>
            <Typography paragraph>
              Built with React, Express, MongoDB, and Material-UI, this portal
              offers a modern, responsive, and accessible experience on all
              devices.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
