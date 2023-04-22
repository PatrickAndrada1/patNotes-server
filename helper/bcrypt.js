const bcrypt = require("bcryptjs");

let hashPassword = (password) => bcrypt.hashSync(password);
let comparehash = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);

module.exports = { hashPassword, comparehash };
