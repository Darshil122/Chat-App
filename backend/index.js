const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
// const path = require("path");
const PORT = process.env.PORT || 8000;
const app = express();
dotenv.config();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
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
