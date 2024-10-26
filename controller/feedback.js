import { Message } from "../model/message.js"; 

export const submitFeedback = async (req, res) => {
  const { messageId, feedback, userId } = req.body;

  if (!messageId || !feedback) {
    return res
      .status(400)
      .json({ error: "Message ID and feedback are required" });
  }
  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.role !== "assistant") {
      return res
        .status(400)
        .json({ error: "Feedback can only be given for assistant messages" });
    }
    message.feedback = feedback;
    await message.save();

    return res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
