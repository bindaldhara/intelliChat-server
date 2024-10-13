import { Message, AssistantMessage } from "../model/message.js";

export const getAssistantResponse = async (chat_id) => {
  const messages = await Message.find({ chat_id }).sort({ timestamp: 1 });

  const lastMessage = messages.slice(-1)[0];
  if (!lastMessage || lastMessage.role === "assistant") {
    throw new Error("Last message is not a user message");
  }

  if (lastMessage.message.includes("error")) {
    return new AssistantMessage({
      chat_id,
      role: "assistant",
      timestamp: Date.now(),
      error: "Something went wrong",
    });
  }

  if (lastMessage.message.includes("summary")) {
    return new AssistantMessage({
      chat_id,
      role: "assistant",
      timestamp: Date.now(),
      result_text: "This is a test message",
      summary: "This is a test summary",
    });
  }

  return new AssistantMessage({
    chat_id,
    role: "assistant",
    timestamp: Date.now(),
    result_text: "This is a test message",
  });
};
