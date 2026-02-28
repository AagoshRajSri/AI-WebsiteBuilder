import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || (import.meta.env.PROD ? "" : "http://localhost:3000"),
  withCredentials: true,
});

export default api;
