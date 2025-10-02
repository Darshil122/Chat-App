const express = require("express");
const mongoose = require("mongoose");
// const http = require("http");
// const socketIO = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config();
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

// --- Deployment ---
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// --- Deployment ---

app.use("/auth", require("./routes/AuthRouter"));
app.use('/api', require("./routes/AuthRouter"));
app.use("/api/chat", require("./routes/ChatRouter"));

app.listen(8000, () => console.log("server Start"));
