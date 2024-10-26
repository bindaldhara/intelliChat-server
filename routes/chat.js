import express from "express";
import { getChats, saveChat, deleteChat , renameChat} from "../controller/chat.js";
import { catchAsync } from "../utils/index.js";
import { authenticate } from "../middleware/authentication.js";

const router = express.Router();

router.get("/", authenticate, catchAsync(getChats));
router.post("/", authenticate, catchAsync(saveChat));
router.delete("/:chat_id", catchAsync(deleteChat)); 
router.put("/:chat_id", catchAsync(renameChat));

export default router;
