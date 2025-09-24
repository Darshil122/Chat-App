const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId not provided" });
  }

  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      return res.send(isChat[0]);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return res.status(200).send(fullChat);
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const fetchChat = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await Chat.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    throw new Error(error.message);
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).json({
      message: "More than two users are required for the group chat",
    });
  }

  users.push(req.user._id); // Add the creator

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password"); // ✅ Correct field name

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).json({ message: "Chat not found" });
  } else {
    res.json(updatedChat);
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const chat = await Chat.findById(chatId);

  if (chat.users.includes(userId)) {
    return res.status(400).json({ message: "User is already in the group" });
  }
  const addUserToGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $addToSet: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addUserToGroup) {
    res.status(404).json({ message: "Chat not found" });
  } else {
    res.json({ message: "added new user in group", addUserToGroup });
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const removedFromGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removedFromGroup) {
    res.status(404).json({ message: "Chat not found" });
  } else {
    res.json({ message: "removed successfully", removedFromGroup });
  }
};

const deleteGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    // Step 1: Find the chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    // Step 2: Ensure it's a group chat
    if (!chat.isGroupChat) {
      return res.status(400).json({ message: "This is not a group chat" });
    }

    // Step 3: Check if user is group admin
    if (chat.groupAdmin !== userId) {
      return res
        .status(403)
        .json({ message: "Only group admin can delete the group" });
    }

    // Step 4: Delete the group chat
    await Chat.findByIdAndDelete(chatId);

    // (Optional) Step 5: Delete related messages
    // await Message.deleteMany({ chat: chatId });

    res.status(200).json({ message: "Group chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting group chat:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteGroup,
};
