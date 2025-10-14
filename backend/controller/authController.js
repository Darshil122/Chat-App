const axios = require("axios");
const User = require("../models/userModel");
const { oauth2client } = require("../utils/googleConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;
    // console.log("code from frontend", code);

    // Exchange code for tokens
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;
    const cloudinaryUrl = await uploadToCloudinary(picture);

    // Check if user exists or create new
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        pic: cloudinaryUrl,
        loginType: "google",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    res.status(200).json({
      message: "User Logged In Successfully",
      user,
      token,
    });
  } catch (err) {
    // console.error("Google Login Error:", err.response?.data || err.message);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// Upload Google profile picture to Cloudinary
const uploadToCloudinary = async (imageUrl) => {
  try {
    const formData = new FormData();
    formData.append("file", imageUrl);
    formData.append("upload_preset", "chat-app");

    const uploadRes = await fetch(
      "https://api.cloudinary.com/v1_1/dkgvimtjm/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await uploadRes.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || "Cloudinary upload failed.");
    }
  } catch (err) {
    console.error("Image upload failed:", err.message);
    return null;
  }
};

async function userSignUp(req, res) {
  const { name, email, password, pic } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "User already exists" });

  // let uploadPicUrl = null;
  // if(pic){
  //   const allowedExtensions = ["jpg", "jpeg", "png"];
  //   const picExtension = pic.split('.').pop().toLowerCase();
  //   if(!allowedExtensions.includes(picExtension)){
  //     return res.status(400).json({ message: "Please upload jpg, jpeg, png format image." });
  //   }
  //   uploadPicUrl = await uploadToCloudinary(pic);
  //   console.log("image upload url", uploadPicUrl);
  //   if(!uploadPicUrl){
  //     return res.status(500).json({ message: "Image upload failed. Please try again." });
  //   }
  // }

  const hashPassword = await bcrypt.hash(password, 10);
  user = new User({
    name,
    email,
    password: hashPassword,
    pic:
      pic ||
      "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    loginType: "manual",
  });
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({ message: "User Create Successfully", token, user });
}

async function userSignIn(req, res) {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Password does not match" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({ message: "Logged In Successfully", token, user });
}

async function getUserFromToken(req, res) {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
}

async function allUsers(req, res) {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

    if (keyword === "/^[^a-zA-Z0-9]+$/" || Object.keys(keyword).length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide user's name or email to search." });
    }

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
//   const search = req.query.search?.trim().toLowerCase();

// if (!search || search.length < 2 || /^[^a-zA-Z0-9]+$/.test(search)) {
//   return res.status(400).json({ message: "Invalid search input." });
// }

// const users = await User.find({
//   _id: { $ne: req.user._id },
//   $or: [
//     { $expr: { $eq: [{ $toLower: "$name" }, search] } },
//     { $expr: { $eq: [{ $toLower: "$email" }, search] } }
//   ]
// });

  res.status(200).json(users);
}

module.exports = {
  googleLogin,
  userSignIn,
  userSignUp,
  getUserFromToken,
  allUsers,
};
