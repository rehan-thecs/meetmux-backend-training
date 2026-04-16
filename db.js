const mongoose = require('mongoose');

const dbURI = process.env.DB_URL;

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