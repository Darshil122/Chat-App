const {
  googleLogin,
  userSignIn,
  userSignUp,
  getUserFromToken,
} = require("../controller/authController");
const { authenticateToken } = require("../middleware/authenticateToken");
const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Router test");
});

router.post("/signup", userSignUp);
router.post("/login", userSignIn);
router.get("/me", authenticateToken, getUserFromToken);
router.post("/google", googleLogin);

module.exports = router;
