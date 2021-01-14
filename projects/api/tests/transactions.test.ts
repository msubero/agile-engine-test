import request from "supertest";
import app from "../src/app";
import {
  casualAccountBalance,
  casualTransaction,
  transaction,
} from "./mocks/transactions.helper";
import get from "lodash/fp/get";
import groupBy from "lodash/fp/groupBy";
import times from "lodash/fp/times";
import { keys } from "lodash";
const storage = require("node-persist");

describe("TransactionsController", () => {
  beforeEach(async () => {
    await storage.init();
    await storage.setItem("canOperate", true);
    await storage.setItem(
      "transactions",
      times((i = 0) => casualTransaction(++i), 5)
    );
    await storage.setItem("accountBalance", casualAccountBalance);
  });

  afterEach(async () => {
    await storage.clear();
  });

  describe("GET /api/transactions", () => {
    it("should get 409 if transactions operations are locked", async () => {
      await storage.setItem("canOperate", false);
      await request(app).get("/api/transactions").expect(409);
    });

    it("should return the transaction history", async () => {
      const transactions = await storage.getItem("transactions");
      await request(app)
        .get("/api/transactions")
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveLength(transactions.length);
          expect(body.some((t) => t.amount >= 100)).toBeTruthy();
        });
    });
  });

  describe("POST /api/transactions", () => {
    it("should get 409 if transactions operations are locked", async () => {
      await storage.setItem("canOperate", false);
      await request(app).post("/api/transactions").expect(409);
    });

    it("should validate required props", async () => {
      await request(app).post("/api/transactions").send({}).expect(500);
    });

    it("should refuse a transaction with negative amount", async () => {
      await request(app)
        .post("/api/transactions")
        .send({ ...transaction, amount: -10 })
        .expect(500);
    });

    it("should decline a debit transaction with an insufficient account balance", async () => {
      await request(app)
        .post("/api/transactions")
        .send({ type: "debit", amount: 10000 })
        .expect(409);
    });

    it("should accept a new transaction if the account balance is sufficient", async () => {
      await request(app)
        .post("/api/transactions")
        .send({ ...transaction, amount: 100 })
        .expect(201);
    });
  });

  describe("GET /api/transactions/:id", () => {
    it("should get 409 if transactions operations are locked", async () => {
      await storage.setItem("canOperate", false);
      await request(app).get("/api/transactions/123").expect(409);
    });

    it("should get 404 if transaction was not found", async () => {
      await request(app).get("/api/transactions/123").expect(404);
    });

    it("should find the requested transaction", async () => {
      const transactions = await storage.getItem("transactions");
      const id = get("0.id", transactions);

      await request(app)
        .get(`/api/transactions/${id}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toBe(id);
        });
    });
  });
});
