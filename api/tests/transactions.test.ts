import request from "supertest";
import app from "../src/app";
import {
  casualAccountBalance,
  casualTransaction,
} from "./mocks/transactions.helper";
import get from "lodash/fp/get";
import times from "lodash/fp/times";
const storage = require("node-persist");

describe("TransactionsController", () => {
  beforeEach(async () => {
    await storage.init();
    await storage.setItem("canOperate", true);
    await storage.setItem("transactions", times(casualTransaction, 5));
    await storage.setItem("accountBalance", casualAccountBalance);
  });

  afterEach(async () => {
    await storage.clear();
  });

  describe("GET /api/transactions", () => {
    it("should get 423 if transactions operations are locked", async () => {
      await storage.setItem("canOperate", false);
      await request(app).get("/api/transactions").expect(423);
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

  describe("GET /api/transactions/:id", () => {
    it("should get 423 if transactions operations are locked", async () => {
      await storage.setItem("canOperate", false);
      await request(app).get("/api/transactions/123").expect(423);
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
