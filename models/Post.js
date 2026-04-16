const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },

  // 🔗 Reference to User
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  date: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 🔹 VIRTUAL FIELD
PostSchema.virtual('contentLength').get(function () {
  return this.content.length;
});

module.exports = mongoose.model('Post', PostSchema);