const jwt = require("jsonwebtoken");
const { User } = require("../models/Index");

function verifytoken(req, res, next) {
  const token = req.headers["authorization"];
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedtoken) => {
      if (err) {
        return res.json({ msg: "Access denied" });
      } else {
        const data = await User.findById(decodedtoken.userId).select(
          "-__v -password"
        );
        if (data) {
          req.user = data;
          next();
        } else {
          return res.json({ msg: "Access denied" });
        }
      }
    });
  } else {
    return res.json({ msg: "Access denied" });
  }
}

module.exports = verifytoken;
