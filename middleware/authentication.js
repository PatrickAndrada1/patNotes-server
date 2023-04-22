const { User } = require("../models");
const { decodedToken } = require("../helper/jwt");

const authentication = async function (req, res, next) {
  try {
    const { access_token } = req.headers;
    let dataDecoded = decodedToken(access_token);
    if (!dataDecoded) {
      throw { name: "JsonWebTokenError" };
    } else {
      let data = await User.findByPk(dataDecoded.id);
      if (data) {
        req.user = {
          id: data.id,
          email: data.email,
          name: data.username,
        };
        next();
      } else {
        throw { name: "invalid access" };
      }
    }
  } catch (error) {
    next(error);
  }
};
module.exports = { authentication };
