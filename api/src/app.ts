import * as express from "express";
import * as middleware from "./middleware";
import routes from "./routes";

export const createApp = () =>
  express()
    .use(middleware.corsHeaders())
    .use(express.json({ limit: "50mb" }))
    .use(express.urlencoded({ extended: true }))
    .use("/", routes);
