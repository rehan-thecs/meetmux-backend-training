require('dotenv').config();

const express = require('express');
const connectDB = require('./db');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// DB Connection
connectDB();

// ----------------------
// Routes
// ----------------------

app.get('/', (req, res) => {
  res.send('Server Running 🚀');
});

// POST: Register User (SAVE TO DB)
app.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Fetch all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ----------------------
// Server
// ----------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});