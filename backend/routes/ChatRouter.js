const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authenticateToken");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  deleteGroup,
} = require("../controller/chatControllers");

router.post("/", authenticateToken, accessChat);
router.get("/", authenticateToken, fetchChat);
router.post("/group", authenticateToken, createGroupChat);
router.put("/rename", authenticateToken, renameGroup);
router.put("/groupadd", authenticateToken, addToGroup);
router.put("/groupremove", authenticateToken, removeFromGroup);
router.delete("/deleteGroup", authenticateToken, deleteGroup);

module.exports = router;
