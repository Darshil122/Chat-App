const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message: "Access Denied. no token provided"});
    }

     const parts = authHeader.split(" ");

     if (parts.length !== 2 || parts[0] !== "Bearer") {
       return res.status(401).json({ message: "Invalid Authorization format" });
     }

     const token = parts[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({message: "Invalid Token"});
    }
};

module.exports = {authenticateToken};