import * as casual from "casual";

export const casualAccountBalance = 100

export const casualTransaction = () => ({
  id: casual.integer(1, 10),
  type: casual.populate_one_of(["credit", "debit"]),
  amount: casual.integer(100, 1000),
  effectiveDate: casual.date(),
});

casual.define("transaction", casualTransaction);

export const transaction = casual['transaction'];
