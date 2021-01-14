const storage = require("node-persist");

export const operationsErrorHandler = async (req, res, next) => {
  const canOperate = await storage.getItem("canOperate");
  if (!canOperate) return res.sendStatus(423);

  next();
};
