const { googleLogin, userSignIn, userSignUp } = require('../controller/authController');
const express = require("express");
const router = express.Router();

router.get("/test", (req, res)=>{
    res.send("Router test");
});

router.post('/signup', userSignUp);
router.post('/login', userSignIn);
router.post('/google', googleLogin);

module.exports = router; 