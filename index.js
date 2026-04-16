require('dotenv').config();
const express = require('express');

const connectDB = require('./db');
const userController = require('./controllers/userController');
const User = require('./models/User');

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

// 🔹 DAY 4 + DAY 5 (SAVE USER)
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, age } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        error: "Username and Email are required"
      });
    }

    const newUser = new User({ username, email, age });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});