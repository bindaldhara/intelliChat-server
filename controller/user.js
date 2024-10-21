import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  const token = jwt.sign({ user_id: newUser._id.toString() }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(201).json({ message: "User created successfully", token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User with this email not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ user_id: user._id.toString() }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({ message: "Login successful", token });
};

export const fetchSelf = async (req, res) => {
  const user_id = req.user_id;

  const user = await User.findById(user_id);

  res.status(200).json({ user: user.toJSON() });
};
