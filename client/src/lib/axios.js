import axios from "axios";
import { toast } from "react-toastify";
import store from "./store";
import { setUser, logoutUser } from "@/features/auth/state/authSlice";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach the access token to every outgoing request.
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      store.getState().auth.user?.accessToken;

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Tracks the active rate-limit countdown timer so only one runs at a time.
let countdownInterval = null;

// Token refresh state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor: handle 401 refresh rotation and rate-limit toasts.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401: attempt token refresh then retry original request once.
    // Skip refresh for auth endpoints — they return 401 for invalid credentials,
    // not because the token expired.
    const isAuthEndpoint = originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      // If a refresh is already in flight, queue this request until it resolves.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization =
            `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use a raw axios call (not the interceptor-bearing instance) so the
        // refresh request itself is never intercepted or retried.
        const res = await axios.post(
          "/api/auth/refresh",
          null,
          { withCredentials: true }
        );

        const newAccessToken =
          res.data.data.accessToken;

        // Merge the new token into the existing user object in the store.
        const currentUser =
          store.getState().auth.user;
        store.dispatch(
          setUser({
            ...currentUser,
            accessToken: newAccessToken,
          })
        );

        // Flush the queue with the fresh token.
        processQueue(null, newAccessToken);

        // Retry the original request that triggered the 401.
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed — flush the queue with the error and log the user out.
        processQueue(refreshError);
        store.dispatch(logoutUser());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Surface rate-limit responses as a live countdown toast.
    if (error.response?.status === 429) {
      const message =
        error.response.data?.message || "Too many requests";
      const match = message.match(/(\d+)\s*seconds/);

      if (match) {
        let remaining = parseInt(match[1], 10);

        if (countdownInterval) {
          clearInterval(countdownInterval);
        }

        toast.dismiss("rate-limit");
        toast.error(
          `Too many requests. Try again in ${remaining} seconds.`,
          {
            toastId: "rate-limit",
            autoClose: false,
            closeOnClick: false,
          }
        );

        countdownInterval = setInterval(() => {
          remaining--;
          if (remaining <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            toast.dismiss("rate-limit");
          } else {
            toast.update("rate-limit", {
              render: `Too many requests. Try again in ${remaining} seconds.`,
            });
          }
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
