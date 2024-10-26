import express from "express";
import {
  receiveMessage,
  getMessages,
  regenerateMessage,
  deleteMessage,

} from "../controller/message.js";
import { catchAsync } from "../utils/index.js";

const router = express.Router();

router.post("/", catchAsync(receiveMessage));
router.get("/chat/:chat_id", catchAsync(getMessages));
router.post("/:message_id/regenerate", catchAsync(regenerateMessage));
router.delete("/:message_id", catchAsync(deleteMessage)); 

export default router;
