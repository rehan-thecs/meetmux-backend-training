// routes/activityRoutes.js

const express = require('express');
const { apiLimiter } = require('../middlewares/security');

const router = express.Router();

const activities = [
  { id: 1, name: 'Mountain Hiking' },
  { id: 2, name: 'Tech Networking' },
  { id: 3, name: 'Startup Meetup' }
];

router.get(
  '/activities',
  apiLimiter,
  (req, res) => {
    // Wrap the array in a "data" object property
    return res.status(200).json({
      data: activities
    });
  }
);

module.exports = router;