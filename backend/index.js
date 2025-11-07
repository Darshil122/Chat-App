const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
// const path = require("path");
const PORT = process.env.PORT || 8000;
const app = express();
dotenv.config();

// ✅ Allow both localhost and deployed frontend
const allowedOrigins = [
  "http://localhost:5173", // local dev frontend
  "https://real-time-chat-app-81hp.onrender.com", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy does not allow access from this origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

// connect db
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("something error",err));

  // routes
  app.use("/auth", require("./routes/AuthRouter"));
  // app.use("/api", require("./routes/AuthRouter"));
  app.use("/api/chat", require("./routes/ChatRouter"));
  
  // --- Deployment ---
  // const __dirname1 = path.resolve();
  // if (process.env.NODE_ENV === "production") {
  //     app.use(express.static(path.join(__dirname1, "../frontend/dist")));
  //     app.get(/.*/, (req, res) => {
  //       res.sendFile(path.resolve(__dirname1, "../frontend/dist/index.html"));
  //     });
  // } else {
  //   app.get("/", (req, res) => {
  //     res.send("API is running..");
  //   });
  // }
  // --- Deployment ---

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
