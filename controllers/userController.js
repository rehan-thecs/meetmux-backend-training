const User = require('../models/User');

// GET USERS
const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

module.exports = { getUsers };