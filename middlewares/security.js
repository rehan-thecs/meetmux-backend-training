// middlewares/security.js

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');



const securityHeaders = helmet({
  crossOriginResourcePolicy: false
});



const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Only 5 requests allowed
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 1 minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});


const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP.'
  }
});

module.exports = {
  securityHeaders,
  loginLimiter,
  apiLimiter
};