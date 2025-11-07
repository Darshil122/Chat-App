import axios from "axios";

const api = axios.create({
  baseURL: "https://chat-app-backend-p1qc.onrender.com/auth",
});

export const googleAuth = (code) => api.post("/google", { code });


