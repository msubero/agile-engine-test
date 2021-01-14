import { Router } from "express";
import transaction from "./transaction";
import AccountBalance from "../controllers/accountBalance";
import { operationsErrorHandler } from "../middleware/operations";

export default Router().use(
  "/api",
  Router()
    .use(operationsErrorHandler)
    .get("/", AccountBalance.get)
    .use("/transactions", transaction)
);
