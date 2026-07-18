import axios from "axios";

const api = axios.create({
  baseURL: "https://shopco-production-2bab.up.railway.app/api",
  withCredentials: true, // This ensures cookies (JWT) are sent with every request
});

export default api;
