const {
  googleLogin,
  userSignIn,
  userSignUp,
  getUserFromToken,
  allUsers,
} = require("../controller/authController");
const { authenticateToken } = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Router test");
});

router.post("/signup", userSignUp);
router.post("/login", userSignIn);
router.post("/google", googleLogin);
router.get("/user", authenticateToken, allUsers);
router.get("/me", authenticateToken, getUserFromToken);

module.exports = router;
