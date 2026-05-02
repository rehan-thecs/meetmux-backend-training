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

const connectDB = require('./db');
const userController = require('./controllers/userController');
const User = require('./models/User');
const Post = require('./models/Post');
const auth = require('./middlewares/auth');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger_config');
const activityRoutes = require('./routes/activityRoutes');

const app = express();
const server = http.createServer(app);

// index.js (relevant connection section)

connectDB();

const client = redis.createClient({
  url: 'redis://127.0.0.1:6379'
});

client.on('error', (err) => console.error('Redis Error:', err));

// Prevent Redis from connecting and hanging during Jest tests
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await client.connect();
      console.log('Redis Connected');
    } catch (err) {
      console.error('Redis Connection Failed:', err.message);
    }
  })();
}

const io = new Server(server, {
// ... rest of your index.js stays exactly the same
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(securityHeaders);
app.use('/api', apiLimiter);


app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use('/api', activityRoutes);



const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;

app.get('/api/activities', async (req, res) => {
  try {
    const cacheKey = 'activities';
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      return res.json({
        success: true,
        source: 'redis-cache',
        data: JSON.parse(cachedData)
      });
    }

    const activities = await Post.find().limit(100);

    await client.setEx(cacheKey, 60, JSON.stringify(activities));

    res.json({
      success: true,
      source: 'mongodb',
      data: activities
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/activities-no-cache', async (req, res) => {
  try {
    const activities = await Post.find().limit(100);

    res.json({
      success: true,
      source: 'mongodb-only',
      data: activities
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Unauthorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();

  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('message', (data) => {
    io.emit('message_broadcast', data);
  });

  socket.on('join_activity', (activityId) => {
    socket.join(activityId);
  });

  socket.on('send_activity_chat', (data) => {
    io.to(data.activityId).emit('new_chat', data.message);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get('/status', (req, res) => {
  res.json({
    message: "System Online",
    port: PORT,
    apiKey: API_KEY ? "Loaded" : "Missing"
  });
});

app.get('/about', (req, res) => {
  res.send('Backend running');
});

app.get('/api/users', userController.getUsers);

app.get('/dashboard', auth, (req, res) => {
  res.send("Private Dashboard");
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, age } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const newUser = new User({ username, email, password, age });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', loginLimiter, async (req, res) => {
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
      user: { id: user._id, username: user.username }
    });

  } catch {
    res.status(500).json({ msg: "Server Error" });
  }
});

app.post('/api/posts', auth, async (req, res) => {
  try {
    const post = await new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id
    }).save();

    res.json(post);

  } catch {
    res.status(500).send('Server Error');
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const start = Date.now();
    const cached = await client.get(req.params.id);

    if (cached) {
      return res.json({
        source: "Redis",
        time: `${Date.now() - start} ms`,
        data: JSON.parse(cached)
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Not found");

    await client.setEx(req.params.id, 3600, JSON.stringify(post));

    res.json({
      source: "MongoDB",
      time: `${Date.now() - start} ms`,
      data: post
    });

  } catch {
    res.status(500).send("Server Error");
  }
});

app.put('/api/posts/:id', async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await client.del(req.params.id);

    res.json(updated);

  } catch {
    res.status(500).send("Server Error");
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: "Server responsive" });
});

app.get('/api/heavy-task', (req, res) => {
  const worker = new Worker('./worker.js', { workerData: 40 });

  worker.on('message', (data) => {
    res.json({ success: true, data });
  });

  worker.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = { app, server };