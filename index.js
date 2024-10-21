import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {MONGO_URI} from "./config/index.js"

import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import adminRoutes from "./routes/admin.js";
import messageRoutes from "./routes/message.js";

import { authenticate } from "./middleware/authentication.js";
import { authorizeAdmin } from "./middleware/authorization.js";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const app = express();
app.use(cors(
  {
    origin : "*"
  }
));
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/message", messageRoutes);
app.use("/chat", chatRoutes);
app.use("/admin", authenticate, authorizeAdmin, adminRoutes);

app.use((err, req, res, next) => {
  const { message = "Internal server error", statusCode = 500 } = err;
  res.status(statusCode).json({ message });
});
const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
