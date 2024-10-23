import { UserMessage, Message } from "../model/message.js";
import Chat from "../model/chat.js";
import { getAssistantResponse } from "../llm/getAssistantResponse.js";

export const receiveMessage = async (req, res) => {
  let { message, chat_id } = req.body;

  if (chat_id === "new" || !chat_id) {
    const newChat = new Chat();
    chat_id = newChat.id;
    newChat.title = message.message;
    await newChat.save();
  }

  const newMessage = new UserMessage({ ...message, id: undefined, chat_id });
  await newMessage.save();

  const assistantMessage = await getAssistantResponse(chat_id);
  await assistantMessage.save();

  res.status(200).json({ message: assistantMessage.toJSON(), chat_id });
};

export const getMessages = async (req, res) => {
  const { chat_id } = req.params;

  const messages = await Message.find({ chat_id }).sort({ timestamp: 1 });

  res.status(200).json({ messages, chat_id });
};

export const regenerateMessage = async (req, res) => {
  const { message_id } = req.params;

  const message = await Message.findById(message_id);

  if (message.role !== "assistant") {
    return res
      .status(400)
      .json({ message: "Message is not an assistant message" });
  }
  const chat_id = message.chat_id;
  await Message.deleteMany({
    timestamp: { $gte: message.timestamp },
  });

  const assistantMessage = await getAssistantResponse(chat_id);
  await assistantMessage.save();

  res.status(200).json({ message: assistantMessage.toJSON(), chat_id });
};

export const deleteMessage = async (req, res) => {
  const { message_id } = req.params;

  // First, delete the user message
  const userMessage = await UserMessage.findByIdAndDelete(message_id);
  if (!userMessage) {
    return res.status(404).json({ message: "User message not found" });
  }
console.log('user message', userMessage);

  const assistantMessage = await Message.findOneAndDelete({
    chat_id: userMessage.chat_id, 
    role: "assistant",
    timestamp: { $gte: userMessage.timestamp }, 
  });
console.log("assistant message", assistantMessage);
  if (assistantMessage) {
    console.log("Assistant message deleted");
  } else {
    console.log("No corresponding assistant message found");
  }
const remainingMessages = await UserMessage.find({
  chat_id: userMessage.chat_id,
});

let chatDeleted = false;
// If no messages left, delete the chat
if (remainingMessages.length === 0) {
  await Chat.findByIdAndDelete(userMessage.chat_id);
  chatDeleted = true; // Indicate that the chat was deleted
}
  res
    .status(200)
    .json({
      message: "Message deleted successfully",
      deletedUserMessage: userMessage,
      deletedAssistantMessage: assistantMessage,
      chatDeleted,
    });
};