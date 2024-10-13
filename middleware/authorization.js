import User from "../model/user.js";

export const authorizeAdmin = async (req, res, next) => {
  const user = await User.findById(req.user_id);
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
