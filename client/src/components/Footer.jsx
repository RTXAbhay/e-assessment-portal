// src/components/Footer.jsx
import React from "react";
import { Box, Container, Typography, Link, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 4,
        background: (theme) =>
          theme.palette.mode === "light"
            ? `linear-gradient(90deg, ${theme.palette.primary.light}22, ${theme.palette.secondary.light}22)`
            : theme.palette.background.paper,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Copy */}
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", textAlign: { xs: "center", sm: "left" } }}
        >
          © {year}{" "}
          <Link
            component="span"
            sx={{ color: "text.primary", fontWeight: 600 }}
          >
            E-Assessment Portal
          </Link>
          . All rights reserved.
        </Typography>

        {/* Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Link href="/about" underline="hover" color="text.secondary">
            About
          </Link>
          <Link href="/support" underline="hover" color="text.secondary">
            Support
          </Link>
          <Link href="/feedback" underline="hover" color="text.secondary">
            Feedback
          </Link>
        </Box>

        {/* Social */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            component="a"
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener"
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <GitHubIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            component="a"
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener"
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <LinkedInIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
