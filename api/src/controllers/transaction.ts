import { transactionSchema } from "../models";
import { getBalance } from "../helpers/index.helper";

const storage = require("node-persist");

export const all = async (req, res, next) => {
  const transactions = storage.getItem("transactions");
  await transactions
    .then(results => {
      res.json({ transactions: results });
    })
    .catch(err => res.send(new Error(err)));
};

export const add = async (req, res, next) => {
  try {
    await transactionSchema.validateAsync(req.body);
    const transactions = await storage.getItem("transactions");
    const balance = await getBalance(transactions);
    if (req.body.type === "debit" && balance <= 0) {
      return res.sendStatus(409);
    }
    transactions.push({
      ...req.body,
      id: (++transactions.length).toString(),
      effectiveDate: new Date().toISOString()
    });

    await storage
      .setItem("transactions", transactions.filter(Boolean))
      .then(results => res.send(results));
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const get = async (req, res, next) => {
  const transactions = storage.getItem("transactions");
  await transactions
    .then(results => {
      const match = results.find(({ id }) => id === req.params.id);
      if (match) res.status(200).json(match);
      else res.sendStatus(404);
    })
    .catch(err => res.send(new Error(err)));
};

export const balance = async (req, res, next) => {
  const transactions = await storage.getItem("transactions");
  const balance = getBalance(transactions);

  await balance
    .then(results => {
      res.json({ balance: results });
    })
    .catch(err => res.send(new Error(err)));
};

export default {
  all,
  add,
  get,
  balance
};
