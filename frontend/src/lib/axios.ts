import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh-token");
        return api(originalRequest);
      } catch (err) {
        const { useAuthStore } = await import("../features/auth/stores/useAuthStore");
         useAuthStore.getState().forceLogout();
        return Promise.reject(err);}
    }
    return Promise.reject(error);
  },
);

export default api;
