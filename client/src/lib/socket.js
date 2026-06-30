import { io } from "socket.io-client";

// Fetch the URL from environment variables or fallback to localhost
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Prevents connecting automatically on page load
  withCredentials: true, // Enables sending cookies/sessions if needed by the server
  transports: ["websocket", "polling"], // Forces WebSocket transport for performance
});
