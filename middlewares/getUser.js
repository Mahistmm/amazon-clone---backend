const jwt = require("jsonwebtoken");

function getUser(req, res, next) {
  const token = req.headers["authorization"];
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedtoken) => {
      if (err) {
        return res.json("Access denied");
      } else {
        req.userId = decodedtoken.userId;
        next();
      }
    });
  } else {
    return res.json("Access denied");
  }
}
module.exports = getUser;
