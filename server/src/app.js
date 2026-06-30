import express from "express";

import applyMainMiddlewares from "./shared/middlewares/index.middleware.js";
import globalErrorHandler from "./shared/middlewares/error.middleware.js";

import indexRouter from "./shared/router/index.router.js";


// function to create app 
async function createApp() {

  const app = express();

  applyMainMiddlewares(app);

  // applying the index router
  app.use("/api", indexRouter);

  app.use(globalErrorHandler);

  return app;

}
export default createApp;