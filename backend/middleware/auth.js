const jwt = require("jsonwebtoken");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ msg: "Unauthorized. Please provide a valid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    const { id, name } = decoded;
    req.user = { id, name };
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    return res.status(401).json({ msg: "Unauthorized. Invalid token" });
  }
};

module.exports = authenticationMiddleware;
