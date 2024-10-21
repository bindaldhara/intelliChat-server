import express from "express";
import { getChats, getMessages, getUsers } from "../controller/admin/index.js";
import { catchAsync } from "../utils/catch-async.js";

const router = express.Router();

router.get("/users", catchAsync(getUsers));
router.get("/users/:user_id/chats", catchAsync(getChats));
router.get("/chats/:chat_id/messages", catchAsync(getMessages));

export default router;
