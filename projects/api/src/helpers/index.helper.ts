import { sumBy, filter } from "lodash";
const storage = require("node-persist");

export interface Transaction {
  id?: number;
  type: "credit" | "debit";
  amount: number;
  effectiveDate?: Date;
}

export const currentAccounttBalance = (transactions) => {
  const credits = getCredits(transactions);
  const debits = getDebits(transactions);
  const balance = credits - debits;
  return balance;
};

export const getCredits = (transactions) => {
  return sumBy(
    filter(transactions, ["type", "credit"]),
    (transaction) => transaction.amount
  );
};

export const getDebits = (transactions) => {
  return sumBy(
    filter(transactions, ["type", "debit"]),
    (transaction) => transaction.amount
  );
};

export const updatedAccountBalance = async (
  transaction: Transaction
): Promise<number> => {
  let accountBalance = await storage.getItem("accountBalance");
  if (transaction.type === "debit") {
    accountBalance = accountBalance - transaction.amount;
  } else {
    accountBalance = accountBalance + transaction.amount;
  }

  return accountBalance;
};
