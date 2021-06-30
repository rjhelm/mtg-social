const mongoose = require('mongoose');
const commentSchema = require('./comment').schema;
const replySchema = require('./reply').schema;
const schemaCleaner = require('../utils/schemaCleaner');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 15,
  },
  body: {
    type: String,
    required: true,
    trim: true,
    minlength: 30,
  },
  tags: [{ type: String, required: true, trim: true }],
  comments: [commentSchema],
  replies: [replySchema],
  points: {
    type: Number,
    default: 0,
  },
  upvotedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  downvotedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  views: { type: Number, default: 0 },
  hotAlgo: { type: Number, default: Date.now },
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

schemaCleaner(postSchema);

module.exports = mongoose.model('Post', postSchema);
