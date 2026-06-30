import axiosInstance from "@/lib/axios";

export const signup = (data) =>
  axiosInstance.post("/auth/signup", data);

export const login = (data) =>
  axiosInstance.post("/auth/login", data);

export const getMe = () =>
  axiosInstance.get("/auth/me");

export const logout = () =>
  axiosInstance.post("/auth/logout");

export const refresh = () =>
  axiosInstance.post("/auth/refresh");