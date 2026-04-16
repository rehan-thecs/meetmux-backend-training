require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const connectDB = require('./db');
const userController = require('./controllers/userController');
const User = require('./models/User');
const Post = require('./models/Post');
const auth = require('./middlewares/auth');

const app = express();

// 🔹 Connect Database
connectDB();

// 🔹 Middleware (Logger)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 🔹 Body Parser
app.use(express.json());

// 🔹 ENV
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;

// 🔹 STATUS ROUTE
app.get('/status', (req, res) => {
  res.json({
    message: "System Online",
    port: PORT,
    apiKey: API_KEY ? "Loaded" : "Missing"
  });
});

// 🔹 DAY 3 ROUTES
app.get('/about', (req, res) => {
  res.send('Backend running successfully');
});

app.get('/user', (req, res) => {
  res.json({ name: "John", role: "Developer" });
});

// 🔹 CONTROLLER ROUTE
app.get('/api/users', userController.getUsers);


// Day6-report.md

// 🔹 PRIVATE ROUTE
app.get('/dashboard', auth, (req, res) => {
  res.send("Welcome to the Private Dashboard");
});


// 🔹 LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});




// 🔹 DAY 4 + DAY 5 (SAVE USER)
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, age } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, Email and Password are required"
      });
    }

    const newUser = new User({ username, email, password, age });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




//Day8-report.md
// 🔹 CREATE POST
app.post('/api/posts', auth, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id   // 🔗 linking user
    });

    const post = await newPost.save();
    res.json(post);

  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 🔹 GET POSTS WITH AUTHOR DETAILS
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username', 'email']);

    res.json(posts);

  } catch (err) {
    res.status(500).send('Server Error');
  }
});



// 🔹 START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});