async function errorHandler(error, req, res, next) {
  let status = 500;
  let message = "internal server error";

  switch (error.name) {
    case "JsonWebTokenError":
      status = 401;
      message = "Invalid Token";
      break;
    case "TokenExpiredError":
      status = 401;
      message = "Session Timeout";
      break;
    case "invalid access":
      status = 401;
      message = "Login First";
      break;
    case "Mohon mengisi Email":
      status = 401;
      message = "Mohon mengisi Email";
      break;
    case "Mohon mengisi Password":
      status = 401;
      message = "Mohon mengisi Password";
      break;
    case "InvalidCredentials":
      status = 401;
      message = "Password/Email salah";
      break;
    case "user dont have permission":
      status = 403;
      message = "Forbiden Access";
      break;

    case "user dont have permission":
      status = 403;
      message = "Forbiden Access";
      break;

    case "SequelizeValidationError":
      status = 400;
      message = error.errors[0].message;
      break;
    case "please insert category ID":
      status = 400;
      message = "please insert category ID";
      break;
    case "SequelizeUniqueConstraintError":
      status = 400;
      message = error.errors[0].message;
      break;
    case "Data not found":
      status = 404;
      message = "Data not found";
      break;

    default:
      break;
  }
  res.status(status).json({ message });
  console.log(error, "<< from err hand");
}
module.exports = errorHandler;
