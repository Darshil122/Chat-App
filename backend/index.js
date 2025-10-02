const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// connect db
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error(err));


  
  app.use("/auth", require("./routes/AuthRouter"));
  app.use("/api", require("./routes/AuthRouter"));
  app.use("/api/chat", require("./routes/ChatRouter"));
  
  // --- Deployment ---
  // __dirname = path.resolve();
  // if (process.env.NODE_ENV === "production") {
  //   app.use(express.static(path.join(__dirname, "../frontend/dist")));
  //   app.get("*", (req, res) => {
  //     res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  //   });
  // } else {
  //   app.get("/", (req, res) => {
  //     res.send("API is running..");
  //   });
  // }
  
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
  
  // Catch-all: Serve React index.html for any non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
  // --- Deployment ---
app.listen(8000, () => console.log("server Start"));
