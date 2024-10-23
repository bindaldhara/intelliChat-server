import User from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";
import nodemailer from "nodemailer";
import Otp from "../model/otp.js";

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


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // SMTP host
  port: 465, // SMTP port for SSL
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail password or App Password
  },
});

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);// Generate a 6-digit OTP
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // Expiry time set to 30 minutes

    const otpRecord = new Otp({
      email,
      otp,
      expiresAt,
    });

    try {
      await otpRecord.save();
      console.log("OTP saved successfully:", otpRecord);
    } catch (error) {
      console.error("Error saving OTP:", error);
    }

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It will expire in 30 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res
      .status(500)
      .json({ message: "Error sending OTP, please try again later." });
  }
};

export const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    await Otp.deleteOne({ email, otp });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetting password:", error);
    res
      .status(500)
      .json({ message: "Error resetting password, please try again later." });
  }
};