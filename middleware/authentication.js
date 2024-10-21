import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  if (!decoded.user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user_id = decoded.user_id;
  next();
};

export const authenticateOptional = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next();
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user_id = decoded.user_id;
  next();
};
