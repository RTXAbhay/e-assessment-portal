// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary:   { main: "#1565c0" },   // dark blue
    secondary: { main: "#2e7d32" },   // dark green
    background:{ default: "#f4f6f8" },// light gray
  },
  typography: {
    h1:     { fontSize: "3rem", fontWeight: 700 },
    h2:     { fontSize: "2.25rem", fontWeight: 600 },
    h3:     { fontSize: "1.75rem", fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 24px",
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
