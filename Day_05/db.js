const mongoose = require('mongoose');

const dbURI = "mongodb+srv://meetmux:Rehan123@meetmux.hjyn7nx.mongodb.net/?appName=MeetMux"; // from .env

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error("❌ Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;