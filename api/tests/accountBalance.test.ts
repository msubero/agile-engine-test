import request from "supertest";
import app from "../src/app";
import { casualAccountBalance } from "./mocks/transactions.helper";
const storage = require("node-persist");

describe("AccountBalanceController", () => {
  beforeEach(async () => {
    await storage.init();
    await storage.setItem("canOperate", true);
    await storage.setItem("accountBalance", casualAccountBalance);
  });

  afterEach(async () => {
    await storage.clear();
  });

  describe("GET /api", () => {
    it("should get 409 if transactions operations are locked", async () => {
      await storage.setItem("canOperate", false);
      await request(app).get("/api").expect(409);
    });

    it("should return the account balance", async () => {
      const accountBalance = await storage.getItem("accountBalance");
      await request(app)
        .get("/api")
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBe(accountBalance);
        });
    });
  });
});
