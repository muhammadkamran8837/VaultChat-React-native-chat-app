const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate a new random JWT secret key
// const secretKey = crypto.randomBytes(64).toString("hex");
const secretKey = "muhammadKamran";
const generateToken = (id) => {
  const payload = { id };

  return jwt.sign(payload, secretKey, { expiresIn: "30d" });
};

module.exports = { generateToken, secretKey };
