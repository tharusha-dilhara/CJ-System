const jwt = require("jsonwebtoken");
const { errorHandler } = require("./error");

function authenticateToken(req, res, next) {
  // Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return next(errorHandler(401, "Unauthorized")); // Unauthorized if no token
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return next(errorHandler(403, "Invalid token")); // Forbidden if token is invalid
    }

    // Save user info to the request object
    req.user = user;
    next(); // Proceed to the next middleware/route handler
  });
}

module.exports = authenticateToken;
