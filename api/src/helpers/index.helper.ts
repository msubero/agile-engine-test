import { sumBy, filter } from "lodash";
const storage = require("node-persist");

export interface Transaction {
  id?: number;
  type: "credit" | "debit";
  amount: number;
  effectiveDate?: Date;
}

export const getBalance = async (transaction: Transaction): Promise<number> => {
  let accountBalance = await storage.getItem("accountBalance");
  if (transaction.type === "debit") {
    accountBalance = accountBalance - transaction.amount;
  } else {
    accountBalance = accountBalance + transaction.amount;
  }

  return accountBalance;
};
