import { transactionSchema } from "../models";
import { Transaction, updatedAccountBalance } from "../helpers/index.helper";
const storage = require("node-persist");

export const all = async (req, res, next) => {
  const transactions = storage.getItem("transactions");

  return await transactions.then((results) => res.json(results)).catch(next);
};

export const add = async (req, res, next) => {
  try {
    const newTransaction = req.body;
    await transactionSchema.validateAsync(newTransaction);

    await storage.setItem("canOperate", false);

    const newBalance = await updatedAccountBalance(newTransaction);

    let statusCode = 201;

    if (newBalance >= 0) {
      const transactions: Transaction[] = await storage.getItem("transactions");

      const updatedTransactions: Transaction[] = [
        ...transactions,
        {
          ...newTransaction,
          id: transactions.length + 1,
          effectiveDate: new Date().toISOString(),
        },
      ];
      await storage.setItem("accountBalance", newBalance);
      await storage.setItem("transactions", updatedTransactions);
    } else {
      statusCode = 409;
    }

    await storage.setItem("canOperate", true);

    return res.sendStatus(statusCode);
  } catch (err) {
    await storage.setItem("canOperate", true);
    return next(err.response || err);
  }
};

export const get = async (req, res, next) => {
  const transactions = storage.getItem("transactions");
  return await transactions
    .then((results) => {
      const match = results.find(({ id }) => id === +req.params.id);
      if (!match) return res.sendStatus(404);

      return res.status(200).json(match);
    })
    .catch(next);
};

export default {
  all,
  add,
  get,
};
