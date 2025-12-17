const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.use("/auth", require("./routes/AuthRouter"));
app.use("/api/chat", require("./routes/ChatRouter"));
app.use("/api/message", require("./routes/MessageRouter"));

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [
      "http://localhost:3000",
      "https://chat-app-2hwm.onrender.com",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("setup", (user) => {
    if (!user?._id) return;
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  socket.on("new message", (message) => {
    const chat = message.chat;
    if (!chat?.users) return;

    chat.users.forEach((u) => {
      if (u._id === message.sender._id) return;
      socket.in(u._id).emit("message received", message);
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
