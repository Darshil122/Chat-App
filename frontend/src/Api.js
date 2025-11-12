import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/auth`,
});

export const googleAuth = (code) => api.post("/google", { code });


