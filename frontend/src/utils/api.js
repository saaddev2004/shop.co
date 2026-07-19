import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // <-- Dekh, yahan humne backend ka direct link de diya hai!
  withCredentials: true,
});

export default api;