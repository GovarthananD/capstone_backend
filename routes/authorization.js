import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const isAuthenticated = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

export  {isAuthenticated};