import express from "express";
import applySecurityMiddlewares from "./shared/middlewares/security.middleware.js";
import globalErrorHandler from "./shared/middlewares/error.middleware.js";


const app = express();

applySecurityMiddlewares(app);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running 🚀",
  });
});



app.use(globalErrorHandler);

export default app;