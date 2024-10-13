import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import adminRoutes from "./routes/admin.js";

import { authenticate } from "./middleware/authentication.js";
import { authorizeAdmin } from "./middleware/authorization.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/message", messageRoutes);
app.use("/chat", chatRoutes);
app.use("/admin", authenticate, authorizeAdmin, adminRoutes);

app.use((err, req, res, next) => {
  const { message = "Internal server error", statusCode = 500 } = err;
  res.status(statusCode).json({ message });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
