import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",  // all calls to /exams, /results, etc. → http://localhost:5000/api/exams, etc.
});

// Automatically attach JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
