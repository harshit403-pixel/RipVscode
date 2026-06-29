import express from "express";

import applySecurityMiddlewares from "./shared/middlewares/security.middleware.js";
import globalErrorHandler from "./shared/middlewares/error.middleware.js";

import authRoutes from "./modules/public/auth/auth.router.js";
import roomRoutes from "./modules/private/room/room.routes.js";
import participantRoutes from "./modules/private/participant/participant.routes.js"

const app = express();

applySecurityMiddlewares(app);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running ",
  });
});

app.use("/api/auth", authRoutes);
app.use(
  "/api/rooms",
  roomRoutes
);


app.use(
  "/api/participants",
  participantRoutes
);

app.use(globalErrorHandler);

export default app;