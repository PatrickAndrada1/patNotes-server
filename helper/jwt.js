const jwt = require("jsonwebtoken");

let secret = process.env.JWT_SECRET;

module.exports = {
  createToken: (payload) => {
    return jwt.sign(payload, secret);
  },
  decodedToken: (token) => {
    return jwt.verify(token, secret);
  },
};
