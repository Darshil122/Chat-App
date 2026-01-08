const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

  // Routes
app.use("/auth", require("./routes/AuthRouter"));
app.use("/api/chat", require("./routes/ChatRouter"));
app.use("/api/message", require("./routes/MessageRouter"));

// Create HTTP server
const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "https://chat-app-2hwm.onrender.com"],
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  // console.log("Socket connected:", socket.id);

  socket.on("setup", (user) => {
    if (!user?._id) return;

    socket.join(user._id);
    onlineUsers.set(user._id, socket.id);

    socket.emit("connected");
    io.emit("user online", user._id);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  /* ---------- TYPING INDICATOR ---------- */
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  /* ---------- NEW MESSAGE ---------- */
  socket.on("new message", (message) => {
    const chat = message.chat;
    if (!chat?.users) return;

    chat.users.forEach((u) => {
      if (u._id === message.sender._id) return;
      socket.in(u._id).emit("message received", message);
    });
  });

  socket.on("disconnect", () => {
    // console.log("Socket disconnected:", socket.id);

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("user offline", userId);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
