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
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    loginType: { type: String, enum: ["manual", "google"], default: "manual" },
  },
  { timestamps: true }
);

const user = mongoose.model("User", userSchema);
module.exports =  user;
