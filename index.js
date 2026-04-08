require('dotenv').config();

const express = require('express');
const app = express();

// ----------------------
// Config
// ----------------------
const PORT = process.env.PORT || 5000;
const apiKey = process.env.API_KEY;

// ----------------------
// Middleware
// ----------------------

// Parse JSON body
app.use(express.json());

// Logger Middleware (should be above routes)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
  next();
});

// ----------------------
// Controllers
// ----------------------
const userController = require('./controllers/userController');

// ----------------------
// Routes
// ----------------------

// Home Route
app.get('/', (req, res) => {
  res.send('Server Running Successfully 🚀');
});

// About Route
app.get('/about', (req, res) => {
  res.send('This is the About API — Backend logic is active.');
});

// User Route (Static JSON)
app.get('/user', (req, res) => {
  res.json({
    name: "John",
    age: 22,
    role: "Developer"
  });
});

// Users Route (Controller-based)
app.get('/api/users', userController.getUsers);

// Status Route (ENV check)
app.get('/status', (req, res) => {
  res.json({
    message: "System Online",
    environment_port: PORT,
    auth_status: apiKey ? "Securely Loaded" : "Missing Key"
  });
});

// Register Route (POST)
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and Password are required!"
    });
  }

  res.status(201).json({
    message: "User Registered Successfully",
    user: username
  });
});

// ----------------------
// Server Start
// ----------------------
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});