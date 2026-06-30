import http from "http";

import createApp from "./src/app.js";
import env from "./src/shared/config/env.config.js";
import connectDB from "./src/shared/config/db.config.js";
import initializeSocket from "./src/socket.server.js";

async function startServer() {
  await connectDB();

  const app = await createApp();

  const server = http.createServer(app);

  initializeSocket(server);

  server.on("error", (err) => {
    console.error("Server Error:", err);
    process.exit(1);
  });

  server.listen(env.PORT, () => {
    console.log(
      `Server running on http://localhost:${env.PORT}`
    );
  });
};

startServer();