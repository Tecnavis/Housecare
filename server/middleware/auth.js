const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const header = req.header("Authorization");
  if (!header) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, "myjwtsecretkey");

    req.user = {
      id: decoded.id,     // charity _id
      role: decoded.role // "charity" | "admin"
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
