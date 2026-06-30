import http from "http";

import createApp from "./src/app.js";
import env from "./src/shared/config/env.config.js";
import connectDB from "./src/shared/config/db.config.js";
import initializeSocket from "./src/socket.server.js";

async function startServer() {
  await connectDB();

  const app = await createApp();

  const server = http.createServer(app);

  // Initialize sockets and obtain the autosave scheduler for lifecycle control.
  const { autosaveScheduler } = initializeSocket(server);

  server.on("error", (err) => {
    console.error("Server Error:", err);
    process.exit(1);
  });

  // Gracefully stop autosave and persist remaining dirty rooms before exiting.
  const shutdown = async (signal) => {

    // Log the shutdown signal that triggered the cleanup.
    console.log(`Received ${signal}, shutting down gracefully...`);

    // Stop scheduling further autosave cycles.
    autosaveScheduler.stop();

    // Persist any remaining dirty rooms one final time.
    try {
      await autosaveScheduler.flush();
    } catch (error) {
      console.error("Final autosave flush failed:", error.message);
    }

    // Close the HTTP server and exit the process.
    server.close(() => process.exit(0));

  };

  // Register graceful shutdown handlers for termination signals.
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  server.listen(env.PORT, () => {
    console.log(
      `Server running on http://localhost:${env.PORT}`
    );
  });
};

startServer();