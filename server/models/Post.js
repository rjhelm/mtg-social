const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateFormat');

const PostSchema = new Schema(
  {
    postText: {
      type: String,
      required: 'You need to leave a thought!',
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    },
    username: {
      type: String,
      required: true
    },
    reactions: [CommentSchema]
  },
  {
    toJSON: {
      getters: true
    }
  }
);

PostSchema.virtual('commentCount').get(function() {
  return this.comment.length;
});

const Post = model('Post', PostSchema);

module.exports = Post;