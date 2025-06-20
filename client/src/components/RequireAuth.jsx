import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RequireAuth({ children, role }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // If not logged in, send to login page, carrying along the roleHint
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, roleHint: role }}
      />
    );
  }

  // If a specific role is required, check it
  // role may be a string ("admin") or an array (["admin","teacher"])
  const allowed = Array.isArray(role) ? role : [role];
  if (role && !allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
