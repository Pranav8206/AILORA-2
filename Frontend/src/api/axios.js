import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "https://ailora-2.vercel.app",
  headers: { "Content-Type": "application/json" },
});

export default api;