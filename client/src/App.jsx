import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing      from "./pages/Landing";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Teacher      from "./pages/Teacher";
import Student      from "./pages/Student";
import TestPage     from "./pages/TestPage";
import RequireAuth  from "./components/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"        element={<Landing />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        {/* Student-only test */}
        <Route
          path="/test/:subject"
          element={
            <RequireAuth role="student">
              <TestPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
