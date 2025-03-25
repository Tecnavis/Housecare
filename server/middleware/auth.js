const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    console.log("Authorization token is missing");
    return res.status(401).json({ message: "Authorization token is missing" });
  }
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), "myjwtsecretkey");
    req.admin = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
