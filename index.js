require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');



const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);



const userController = require('./controllers/userController');
const User = require('./models/User');
const Post = require('./models/Post');
const auth = require('./middlewares/auth');



// 🔹 Connect Database
connectDB();


// 🔹 Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Allow Live Server
    methods: ["GET", "POST"],
    credentials: true
  }
});



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
    // 🔹 Query Params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;

    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', ['username', 'email'])
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: posts
    });

  } catch (err) {
    res.status(500).send('Server Error');
  }
});



io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // 🔹 Receive message
  socket.on('message', (data) => {
    console.log('Message received:', data);

    // 🔥 Broadcast to all clients
    io.emit('message_broadcast', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


io.on('connection', (socket) => {

  // 🔹 Join Room
  socket.on('join_activity', (activityId) => {
    socket.join(activityId);
    console.log(`User joined room: ${activityId}`);
  });

  // 🔹 Send message to room
  socket.on('send_activity_chat', (data) => {
    io.to(data.activityId).emit('new_chat', data.message);
  });

});



io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;

    next();

  } catch (err) {
    next(new Error("Unauthorized"));
  }
});



// 🔹 START SERVER
// 🔹 START SERVER
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});