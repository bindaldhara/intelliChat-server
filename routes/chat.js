import express from "express";
import { getChats, saveChat } from "../controller/chat.js";
import { catchAsync } from "../utils/index.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

router.get("/", authenticate, catchAsync(getChats));
router.post("/", authenticate, catchAsync(saveChat));
export default router;
