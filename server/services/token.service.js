const jwt = require("jsonwebtoken");

const generateToken = (userId, secretKey) => {
  if (!secretKey) {
    throw new Error("JWT secret missing");
  }

  return jwt.sign(
    { id: userId },
    secretKey,
    { expiresIn: "1h" }
  );
};

module.exports = { 
    generateToken,
};