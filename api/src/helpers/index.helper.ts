import { sumBy, filter } from "lodash";

export const getBalance = async transactions => {
  const credits = getCredits(transactions);
  const debits = getDebits(transactions);
  const balance = credits - debits;
  return balance;
};

const getCredits = transactions => {
  return sumBy(
    filter(transactions, ["type", "credit"]),
    transaction => transaction.amount
  );
};

const getDebits = transactions => {
  return sumBy(
    filter(transactions, ["type", "debit"]),
    transaction => transaction.amount
  );
};
