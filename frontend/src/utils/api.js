import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // This ensures cookies (JWT) are sent with every request
});

export default api;