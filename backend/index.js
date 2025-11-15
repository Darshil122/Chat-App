const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 8000;
const app = express();
dotenv.config();

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

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
