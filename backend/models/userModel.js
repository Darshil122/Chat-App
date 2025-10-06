const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    pic: {
      type: String,
      required: true
    },
    loginType: { type: String, enum: ["manual", "google"], default: "manual" },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);
module.exports =  user;
