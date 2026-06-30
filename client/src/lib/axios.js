import axios from "axios";
import { toast } from "react-toastify";
import store from "./store";

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

// Surface rate-limit responses as a live countdown toast.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {

    // Only handle "Too many requests" responses here.
    if (error.response?.status === 429) {

      // Extract the retry window (in seconds) from the server message.
      const message =
        error.response.data?.message || "Too many requests";
      const match = message.match(/(\d+)\s*seconds/);

      if (match) {
        let remaining = parseInt(match[1], 10);

        // Reset any previous countdown before starting a new one.
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }

        // Show the initial rate-limit toast.
        toast.dismiss("rate-limit");
        toast.error(
          `Too many requests. Try again in ${remaining} seconds.`,
          {
            toastId: "rate-limit",
            autoClose: false,
            closeOnClick: false,
          }
        );

        // Tick the countdown down and dismiss the toast when it ends.
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
