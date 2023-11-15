const jwt = require('jsonwebtoken');

const secretKey = "dndthntr6y4r$fgfg6%fgn@fgfngn#fgnf";

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(403).json({ error: "A token is required" });
  }

  const token = authorizationHeader.split(' ')[1];

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.decodedToken = decodedToken;
    next();
  });
};

module.exports = verifyToken;
