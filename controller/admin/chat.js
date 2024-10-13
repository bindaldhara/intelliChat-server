import Chat from "../../model/chat.js";

export const getChats = async (req, res) => {
  const { user_id } = req.params;

  const chats = await Chat.find({ user_id }).select({
    _id: 0,
    title: 1,
    id: "$_id",
  });
  res.status(200).json({ chats, user_id });
};
