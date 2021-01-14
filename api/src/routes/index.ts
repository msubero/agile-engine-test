import { Router } from "express";
import transaction from "./transaction";
import Balance from "./../controllers/balance";
import { operationsErrorHandler } from "../middleware/operations";

export default Router().use(
  "/api",
  Router()
    .use(operationsErrorHandler)
    .get("/", Balance.get)
    .use("/transactions", transaction)
);
