import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
      alias: "id",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    title: {
      type: String,
      default: "New Chat",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
