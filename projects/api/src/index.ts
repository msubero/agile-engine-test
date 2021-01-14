import app from "./app";
const storage = require("node-persist");

(async () => {
  await storage.init();
  await storage.setItem("canOperate", true);
  await storage.setItem("transactions", []);
  await storage.setItem("accountBalance", 0);

  const port = process.env.PORT || 4040;

  app.listen(port, () => console.info(`server started on port ${port}`));
})();
