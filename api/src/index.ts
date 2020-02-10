import { createApp } from "./app";
const storage = require("node-persist");
let server;
(async () => {
  await storage.init();
  await storage.setItem("transactions", []);
  await storage.setItem("accountBalance", {});

  const port = process.env.PORT || 4040;

  server = createApp().listen(port, () =>
    console.info(`server started on port ${port}`)
  );
})();

module.exports = server;
