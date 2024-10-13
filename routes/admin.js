import express from "express";
import { getChats, getMessages, getUsers } from "../controller/admin/index.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:user_id/chats", getChats);
router.get("/chats/:chat_id/messages", getMessages);

export default router;
