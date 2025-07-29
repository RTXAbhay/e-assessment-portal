// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On mount, if there's a token, fetch the full profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/users/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

 const login = async ({ email, password }) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    const profile = await api.get("/users/me");
    setUser(profile.data);
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw err;
  }
};


  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    localStorage.setItem("token", data.token);
    const profile = await api.get("/users/me");
    setUser(profile.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
