import mongoose from "mongoose";

const options = {
  versionKey: false,
  toJSON: { virtuals: true },
};

const baseMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
      alias: "id",
    },
    timestamp: {
      type: Number,
      required: true,
    },
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },
  options
);

const Message = mongoose.model("Message", baseMessageSchema);

const UserMessage = Message.discriminator(
  "user_message",
  new mongoose.Schema(
    {
      message: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["user"],
        required: true,
        default: "user",
      },
    },
    options
  )
);

const AssistantMessage = Message.discriminator(
  "assistant_message",
  new mongoose.Schema(
    {
      summary: String,
      result_text: String,
      result_table_path: String,
      result_visualization_path: String,
      error: String,
      role: {
        type: String,
        enum: ["assistant"],
        required: true,
        default: "assistant",
      },
    },
    options
  )
);

export { Message, UserMessage, AssistantMessage };
