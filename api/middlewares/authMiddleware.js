const jwt = require("jsonwebtoken");

const generateToken = (data) => {
  return jwt.sign(data, process.env.TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: "90d",
  });
};

const verifyMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!authHeader) return (401).send({ detail: "User not authenticated." });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err)
      return res.status(403).send({ detail: "User is not authenticated." });

    req.user = user;

    next();
  });
};

module.exports = { generateToken, verifyMiddleware };
