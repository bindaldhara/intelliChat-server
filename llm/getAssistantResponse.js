import { Message, AssistantMessage } from "../model/message.js";
import { Mistral } from "@mistralai/mistralai";
import {MISTRAL_API_KEY} from "../config/index.js"

const apiKey = MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

export const getAssistantResponse = async (chat_id) => {
  const messages = await Message.find({ chat_id }).sort({ timestamp: 1 });
  const lastMessage = messages.slice(-1)[0];

  if (!lastMessage || lastMessage.role === "assistant") {
    throw new Error("Last message is not a user message");
  }
const conversationHistory = messages.map((msg) => ({
    role: msg.role ,
    content: msg.role === 'user' ? msg.message : (msg.result_text ?? msg.errors),
  }));

  const userMessage = lastMessage.message;

  try {
    if(userMessage.toLowerCase().includes("error")) throw new Error("test Error");
    
    const chatResponse = await client.chat.complete({
      model: "mistral-large-latest",
      messages: conversationHistory,
    });
    console.log(chatResponse);


    return new AssistantMessage({
      chat_id,
      role: "assistant",
      timestamp: Date.now(),
      result_text:
        chatResponse.choices[0].message.content || "No response from Mistral",
        summary : userMessage.toLowerCase().includes("summary")? "this is summaryy" : undefined,
    });
  } catch (error) {
    return new AssistantMessage({
      chat_id,
      role: "assistant",
      timestamp: Date.now(),
      error: "Failed to get response from Mistral AI",
    });
  }
};