var config = require("config");
var jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(`token :: ${token}`);

  //Check for token
  if (token)
    try {
      //Verify token
      const decoded = jwt.verify(token, config.get("jwtSecret"));
      //Add user from payload
      req.user = decoded;
    } catch (e) {
      res.status(400).json({ msg: "Token is not valid" });
    }
  next();
};

module.exports = auth;
