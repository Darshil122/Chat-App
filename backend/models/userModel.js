const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    pic: {
      type: String,
      required: true,
      default:
        "https://www.vecteezy.com/vector-art/2076534-default-user-icon-vector.jpg",
    },
    loginType: { type: String, enum: ["manual", "google"], default: "manual" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
