const mongoose = require("mongoose");

const chatModel = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: String, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    GroupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const chat = mongoose.model("Chat", chatModel);
module.exports = chat;
