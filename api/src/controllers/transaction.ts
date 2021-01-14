import { transactionSchema } from "../models";
import { getBalance, toggleOperations } from "../helpers/index.helper";
const storage = require("node-persist");

export const all = async (req, res, next) => {
  const transactions = storage.getItem("transactions");

  return await transactions.then((results) => res.json(results)).catch(next);
};

export const add = async (req, res, next) => {
  try {
    const { error, value: body } = await transactionSchema.validateAsync(
      req.body
    );
    if (error) return res.sendStatus(400);

    await toggleOperations();

    const transactions = await storage.getItem("transactions");

    const updatedTransactions = [
      ...transactions,
      {
        ...body,
        id: transactions.length + 1,
        effectiveDate: new Date().toISOString(),
      },
    ];

    const newBalance = await getBalance(updatedTransactions);

    let statusCode = 201;

    if (newBalance >= 0) {
      await storage.setItem("accountBalance", newBalance);
      await storage.setItem("transactions", updatedTransactions);
    } else {
      statusCode = 409;
    }

    await toggleOperations();

    return res.sendStatus(statusCode);
  } catch (err) {
    return next(err.response || err);
  }
};

export const get = async (req, res, next) => {
  const transactions = storage.getItem("transactions");
  return await transactions
    .then((results) => {
      const match = results.find(({ id }) => id === +req.params.id);
      if(!match) return res.sendStatus(404);
      
      return res.status(200).json(match);
    })
    .catch(next);
};

export default {
  all,
  add,
  get,
};
