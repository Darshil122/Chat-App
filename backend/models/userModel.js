const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fdefault-user&psig=AOvVaw0J5Jnim9F7ZcWBZIxBUomT&ust=1756275330358000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJDMpM3pp48DFQAAAAAdAAAAABAL",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);
module.exports = User;
