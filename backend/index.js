const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect db
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("something error",err));

  // routes
  app.use("/auth", require("./routes/AuthRouter"));
  app.use("/api/chat", require("./routes/ChatRouter"));
  app.use("/api/message", require("./routes/MessageRouter"));

  // create server
  const server = http.createServer(app);

  // socket.io setup
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (user) => {
      socket.join(user._id);
      socket.emit("connected");
    });
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: ", room);
    });
    socket.on("new message", (message) => {
      const chat = message.chat;
      if(!chat.users) return;

      chat.users.forEach((u) => {
        if(u._id == message.sender._id) return;
        socket.in(u._id).emit("message received", message);
      });
    });
    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  });

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
