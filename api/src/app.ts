import express from "express";
import * as middleware from "./middleware";
import routes from "./routes";

const app = express();
app.use(middleware.corsHeaders());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

export default app;
