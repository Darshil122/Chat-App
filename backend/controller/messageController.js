const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const sendMessage = async (req, res) => {
    try{
        const { content, chatId} = req.body;
        if(!content || !chatId){
            return res.status(400).json({message: "Invalid data passed into request"});
        }

        let newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        };

        let message = await Message.create(newMessage);

        // Populate sender and chat
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");

        // Populate chat users
        message = await User.populate(message, {
          path: "chat.users",
          select: "name pic email",
        });
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        });
        res.status(200).json(message);
    }catch(error){
        res.status(500).json({message: error.message});
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