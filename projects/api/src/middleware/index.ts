export const corsHeaders = () => {
  return (req, res, next) => {
    res.set("Access-Control-Allow-Origin", req.get("origin") || "*");
    res.set(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  };
};

export default { corsHeaders };
