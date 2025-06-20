import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import Navbar      from "./components/Navbar";
import Footer      from "./components/Footer";
import RequireAuth from "./components/RequireAuth";

import Landing        from "./pages/Landing";
import About          from "./pages/About";
import Support        from "./pages/Support";
import Feedback       from "./pages/Feedback";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Teacher        from "./pages/Teacher";
import Student        from "./pages/Student";
import TestPage       from "./pages/TestPage";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Navbar />

        <Box component="main" sx={{ flexGrow: 1, pt: { xs: "56px", sm: "64px" } }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/support" element={<Support />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin-only */}
            <Route
              path="/admin"
              element={
                <RequireAuth role="admin">
                  <AdminDashboard />
                </RequireAuth>
              }
            />

            {/* Teacher-only */}
            <Route
              path="/teacher"
              element={
                <RequireAuth role="teacher">
                  <Teacher />
                </RequireAuth>
              }
            />

            {/* Student-only */}
            <Route
              path="/student"
              element={
                <RequireAuth role="student">
                  <Student />
                </RequireAuth>
              }
            />

            {/* Test flow */}
            <Route
              path="/test/:subject"
              element={
                <RequireAuth role="student">
                  <TestPage />
                </RequireAuth>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </BrowserRouter>
  );
}
