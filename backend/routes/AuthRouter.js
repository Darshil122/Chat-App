const router = require("express").Router();

router.get("/test", (req, res)=>{
    res.send("Router test");
})

module.exports = router;