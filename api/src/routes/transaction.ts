import { Router } from "express";
import Transaction from "./../controllers/transaction";

const router = Router();

router
  .get("/", Transaction.all)
  .post("/", Transaction.add)
  .get("/:id", Transaction.get);

export default router;
