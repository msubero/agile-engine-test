import app from "./app";
import times from "lodash/fp/times";
import { casualTransaction } from "../tests/mocks/transactions.helper";
import { currentAccounttBalance } from "./helpers/index.helper";
const storage = require("node-persist");

(async () => {
  let {
    transactions: initTransactions,
    accountBalance: initAccountBalance,
  } = getInitValues();

  while (initAccountBalance < 0) {
    const { transactions, accountBalance } = getInitValues();
    initTransactions = transactions;
    initAccountBalance = accountBalance;
  }

  await storage.init();
  await storage.setItem("canOperate", true);
  await storage.setItem("transactions", initTransactions);
  await storage.setItem("accountBalance", initAccountBalance);

  const port = process.env.PORT || 4040;

  app.listen(port, () => console.info(`server started on port ${port}`));
})();

function getInitValues() {
  const transactions = times((i = 0) => casualTransaction(++i), 5);

  return {
    transactions,
    accountBalance: currentAccounttBalance(transactions),
  };
}
