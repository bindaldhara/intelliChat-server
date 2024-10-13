import Chat from "../model/chat.js";

export const getChats = async (req, res) => {
  const user_id = req.user_id;

  const chats = await Chat.find({ user_id }).sort({ createdAt: -1 }).select({
    id: "$_id",
    _id: 0,
    title: 1,
  });
  res.status(200).json({ chats });
};

export const saveChat = async (req, res) => {
  const user_id = req.user_id;
  const { chat_id } = req.body;

  const newChat = await Chat.findById(chat_id);
  if (!newChat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  newChat.user_id = user_id;
  await newChat.save();

  res.status(201).json({ chat_id: newChat.id });
};
