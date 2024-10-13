import { Message } from "../../model/message.js";

export const getMessages = async (req, res) => {
  const { chat_id } = req.params;
  const messages = await Message.find({ chat_id });
  res.status(200).json({ messages, chat_id });
};
