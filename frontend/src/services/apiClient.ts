import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Response interceptor for global error logging
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("[API Error]", error.response?.data ?? error.message);
    return Promise.reject(error);
  }
);
