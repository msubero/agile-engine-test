import { getBalance } from "../helpers/index.helper";
const storage = require("node-persist");

export const get = async (req, res, next) => {
  const transactions = await storage.getItem("transactions");

  return await getBalance(transactions)
    .then((balance) => {
      res.json({ balance });
    })
    .catch(next);
};

export default {
  get,
};
