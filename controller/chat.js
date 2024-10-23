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
  const { chat_id, lastMessage } = req.body;

  const newChat = await Chat.findById(chat_id);
  if (!newChat) {
    return res.status(404).json({ message: "Chat not found" });
  }
  newChat.user_id = user_id;
  newChat.title = lastMessage;
  await newChat.save();

  res
    .status(201)
    .json({ chat_id: newChat.id, title: newChat.lastMessage });
};


export const deleteChat = async (req, res) => {
  const { chat_id } = req.params; 


  const chat = await Chat.findById(chat_id);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  await Chat.findByIdAndDelete(chat_id);
  console.log("Chat deleted successfully");

  res.status(200).json({
    message: "Chat deleted successfully",
    chat_id, 
  });
};

export const renameChat = async (req, res) => {
  const { chat_id } = req.params; // Extract chat ID from route parameters
  const { title } = req.body; // Extract the new title from the request body

  try {
    // Find the chat by ID and update its title
    const updatedChat = await Chat.findByIdAndUpdate(
      chat_id,
      { title },
      { new: true } // Return the updated document
    );

    // If the chat was not found, return a 404 response
    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Return the updated chat
    res.status(200).json(updatedChat);
  } catch (error) {
    console.error('Error renaming chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};