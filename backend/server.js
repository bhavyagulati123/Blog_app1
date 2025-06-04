const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userModel = require("./models/user");
const postModel = require("./models/post");
const app = express();
const port = process.env.PORT;
app.use(
  cors({
    origin: "https://blog-app1-a7oqyx1ua-bhavyagulati123s-projects.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/upload");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, function (err, bytes) {
      const fn = bytes.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});
const upload = multer({ storage });

// ===== Routes =====
app.get("/", (req, res) => {
  res.send("API is running");
});

// Register
app.post("/register", async (req, res) => {
  const { name, username, email, password, age } = req.body;
  const existingUser = await userModel.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  bcrypt.hash(password, 10, async function (err, hash) {
    const user = await userModel.create({
      name,
      username,
      email,
      age,
      password: hash,
    });

    const token = jwt.sign({ email, userid: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "User registered", user });
  });
});

// Login
app.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User doesn't exist" });

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = jwt.sign(
        { email: user.email, userid: user._id },
        process.env.JWT_SECRET
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });
});

// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// Get user profile
app.get("/profile", isLoggedIn, async (req, res) => {
  // res.cookie("token", token, { httpOnly: true });
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("posts");
  res.json({ user });
});

// Create post
app.post("/post", isLoggedIn, async (req, res) => {
  const { content } = req.body;
  const user = await userModel.findOne({ email: req.user.email });

  const post = await postModel.create({
    user: user._id,
    content,
  });

  user.posts.push(post._id);
  await user.save();
  res.status(201).json({ message: "Post created", post });
});

// Edit post
app.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { content } = req.body;
  await postModel.updateOne({ _id: req.params.id }, { $set: { content } });
  res.json({ message: "Post updated" });
});

// Delete post
app.delete("/delete/:id", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  user.posts = user.posts.filter((pid) => pid.toString() !== req.params.id);
  await user.save();
  await postModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

// Toggle like
app.get("/like/:id", isLoggedIn, async (req, res) => {
  const post = await postModel.findById(req.params.id).populate("user");
  const userId = req.user.userid;

  const index = post.likes.indexOf(userId);
  if (index === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(index, 1);
  }

  await post.save();
  res.json({ message: "Like toggled", likes: post.likes.length });
});

// Upload profile picture
app.post("/upload", isLoggedIn, upload.single("profile"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const user = await userModel.findOne({ email: req.user.email });
  user.profilepic = req.file.filename;
  await user.save();
  res.json({
    message: "Profile picture updated",
    profilepic: req.file.filename,
  });
});

// Get all posts
app.get("/all-posts", async (req, res) => {
  try {
    const posts = await postModel
      .find({})
      .populate("user", "username profilepic")
      .sort({ createdAt: -1 });

    const formatted = posts.map((post) => ({
      _id: post._id,
      username: post.user.username,
      profilepic: post.user.profilepic,
      content: post.content,
      likes: post.likes.length,
      likedBy: post.likes.map((id) => id.toString()),
      createdAt: post.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// ===== Middleware to check login =====
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// ===== Start Server =====
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
