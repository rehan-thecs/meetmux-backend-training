require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Worker } = require('worker_threads');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('redis');
const {
  securityHeaders,
  loginLimiter,
  apiLimiter
} = require('./middlewares/security');

// Database & Controllers
const connectDB = require('./db');
const userController = require('./controllers/userController');
const User = require('./models/User');
const Post = require('./models/Post');
const auth = require('./middlewares/auth');

const app = express();
const server = http.createServer(app);

// 🔹 Connect MongoDB
connectDB();

// 🔹 Connect Redis
const client = redis.createClient({
  url: 'redis://127.0.0.1:6379' // Explicitly bind to IPv4 to prevent ECONNREFUSED ::1 errors
});

client.on('error', (err) => console.error('Redis Error:', err));

(async () => {
  try {
    await client.connect();
    console.log("✅ Redis Connected");
  } catch (err) {
    console.error("❌ Redis Connection Failed:", err.message);
  }
})();

// 🔹 Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Allow Live Server
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 🔹 Middleware (Logger & Body Parser)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(express.json());


app.use(securityHeaders);
app.use(express.json());

app.use('/api', apiLimiter);



// 🔹 ENV Variables
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;




// ==========================================
// SOCKET.IO LOGIC
// ==========================================

// 1. Socket Middleware MUST come before the connection event
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


// 2. Single Connection Block
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id} (User ID: ${socket.user?.id})`);

  // General Broadcast Message
  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.emit('message_broadcast', data);
  });

  // Room / Activity Logic
  socket.on('join_activity', (activityId) => {
    socket.join(activityId);
    console.log(`User joined room: ${activityId}`);
  });

  socket.on('send_activity_chat', (data) => {
    io.to(data.activityId).emit('new_chat', data.message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ==========================================
// REST API ROUTES
// ==========================================




// Status & Basic Routes
app.get('/status', (req, res) => {
  res.json({ message: "System Online", port: PORT, apiKey: API_KEY ? "Loaded" : "Missing" });
});

app.get('/about', (req, res) => {
  res.send('Backend running successfully');
});

app.get('/user', (req, res) => {
  res.json({ name: "John", role: "Developer" });
});

// User & Auth Routes
app.get('/api/users', userController.getUsers);

app.get('/dashboard', auth, (req, res) => {
  res.send("Welcome to the Private Dashboard");
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, age } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, Email and Password are required" });
    }
    const newUser = new User({ username, email, password, age });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


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
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// Post Routes
app.post('/api/posts', auth, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const start = Date.now();

    // 1. Check Redis
    const cachedPost = await client.get(id);
    if (cachedPost) {
      console.log("⚡ Cache Hit");
      return res.json({
        source: "Redis",
        time: `${Date.now() - start} ms`,
        data: JSON.parse(cachedPost)
      });
    }

    // 2. Fetch from DB
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    // 3. Save to Redis (TTL = 1 hour)
    await client.setEx(id, 3600, JSON.stringify(post));
    console.log("🐢 Cache Miss");

    res.json({
      source: "MongoDB",
      time: `${Date.now() - start} ms`,
      data: post
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    // ❗ Delete cache on update
    await client.del(req.params.id);
    console.log("🧹 Cache Cleared");
    res.json(updatedPost);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Performance Test Routes
app.get('/api/block', (req, res) => {
  let result = 0;
  for (let i = 0; i < 1_000_000_000; i++) result += i;
  res.json({ result });
});

app.get('/api/test', (req, res) => {
  res.json({ message: "Server is responsive", time: new Date().toISOString() });
});

app.get('/api/heavy-task', (req, res) => {
  console.log(`[MAIN] Request received at ${new Date().toISOString()}`);
  
  // Ensure you have a worker.js file in your root directory!
  const worker = new Worker('./worker.js', {
    workerData: { iterations: 1_000_000_000 }
  });

  worker.on('message', (result) => {
    console.log(`[MAIN] Worker completed at ${new Date().toISOString()}`);
    res.json({ success: true, result });
  });

  worker.on('error', (err) => {
    console.error(err);
    res.status(500).json({ error: err.message });
  });
});

// 🔹 START SERVER
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});