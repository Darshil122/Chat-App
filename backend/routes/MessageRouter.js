const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authenticateToken");
const { sendMessage, fetchMessages } = require("../controller/messageController");

router.post("/", authenticateToken, sendMessage);
router.get("/:chatId", authenticateToken, fetchMessages);

module.exports = router;