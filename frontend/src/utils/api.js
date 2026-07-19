import axios from "axios";

const api = axios.create({
  baseURL: "https://shopco-production-2bab.up.railway.app/api", // <-- Railway ka live link lag gaya!
  withCredentials: true,
});

export default api;