const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res
        .status(400)
        .json({ message: "Invalid data passed into request" });
    }

    let newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);

    message = await Message.findById(message._id)
      .populate("sender", "name pic email")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "name pic email",
        },
      });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    return res.status(200).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: error.message });
  }
};

const fetchMessages = async (req, res) => {
    try{
        const messages = await Message.find({chat: req.params.chatId})
        .populate("sender", "name pic email")
        .populate("chat");
        res.status(200).json(messages);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

module.exports = { sendMessage, fetchMessages };