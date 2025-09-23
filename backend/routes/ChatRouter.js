const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authenticateToken");
const { accessChat } = require("../controller/chatControllers");

// router.post("/",authenticateToken, accessChat);
// router.post("/", fetchChat);
// router.post("/group", authenticateToken, createGroupChat);
// router.put("/rename", authenticateToken, renameGroup);
// router.put("/groupremove", authenticateToken, removeFromGroup);
// router.put("/groupadd", authenticateToken, addToGroup);

// module.export = router;

// const express = require("express");
// const router = express.Router();

// const { authenticateToken } = require("../middleware/authenticateToken");
// const { accessChat } = require("../controller/chatControllers");

router.post("/", authenticateToken, accessChat);

module.exports = router;
