// utils/token.js
const jwt = require("jsonwebtoken");
const { secret } = require("../Controllers/config");

const generateAccessToken = (id, roles) => {
  const payload = { id, roles };
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

module.exports = { generateAccessToken };
