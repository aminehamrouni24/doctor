const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token =req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({ status: true, msg: "Invalid token" });
  }
   

  try {
    const decode =  jwt.verify(token, process.env.SECRET);
    req.user = decode;
    next();
  } catch (err) {
    res.status(500).json({ status: false, msg: err });
  }
};
module.exports = auth;
