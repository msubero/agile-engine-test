import { Router } from "express";
import transaction from "./transaction";
import { balance } from "./../controllers/transaction";

export default Router().use(
  "/api",
  Router()
    .get("/", balance)
    .use("/transactions", transaction)
);
