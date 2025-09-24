const express = require("express");
const mongoose = require("mongoose");
// const http = require("http");
// const socketIO = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

app.use(cors());
app.use(express.json());

// connect db
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error(err));

//socket.io
// io.on("connection", async (socket) => {

//   //old Message
//   const oldMessage = await Message.find().sort({ time: 1 }).limit(20);
//   socket.emit("old-message", oldMessage);

//   //receive new message
//   socket.on("user-msg", async (data) => {
//     const newMsg = new Message(data);
//     await newMsg.save();
//     io.emit("message", data);
//   });
// });

app.get("/", (req, res)=>{
  res.send("i am from backend");
});

app.use("/auth", require("./routes/AuthRouter"));
app.use('/api', require("./routes/AuthRouter"));
app.use("/api/chat", require("./routes/ChatRouter"));

app.listen(8000, () => console.log("server Start"));
