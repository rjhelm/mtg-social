const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/post');
const User = require('../../models/user');
const authChecker = require('../../utils/authChecker');
const errorHandler = require('../../utils/errorHandler');

module.exports = {
  Mutation: {
    addPostComment: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, body } = args;

      if (body.trim() === '' || body.length < 5) {
        throw new UserInputError('Comment must be atleast 5 characters long.');
      }

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `Post with ID: ${postId} does not exist in DB.`
          );
        }

        post.comments.push({
          body,
          author: loggedUser.id,
        });

        const savedPost = await post.save();
        const populatedPost = await savedPost
          .populate('comments.author', 'username')
          .execPopulate();

        return populatedPost.comments;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    deletePostComment: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, commentId } = args;

      try {
        const user = await User.findById(loggedUser.id);
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `Post with ID: ${postId} does not exist in DB.`
          );
        }

        const targetComment = post.comments.find(
          (c) => c._id.toString() === commentId
        );

        if (!targetComment) {
          throw new UserInputError(
            `Comment with ID: '${commentId}' does not exist in DB.`
          );
        }

        if (
          targetComment.author.toString() !== user._id.toString() &&
          user.role !== 'admin'
        ) {
          throw new AuthenticationError('Access is denied.');
        }

        post.comments = post.comments.filter(
          (c) => c._id.toString() !== commentId
        );
        await post.save();
        return commentId;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    editPostComment: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, commentId, body } = args;

      if (body.trim() === '' || body.length < 5) {
        throw new UserInputError('Comment must be atleast 5 characters long.');
      }

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `Post with ID: ${postId} does not exist in DB.`
          );
        }

        const targetComment = post.comments.find(
          (c) => c._id.toString() === commentId
        );

        if (!targetComment) {
          throw new UserInputError(
            `Comment with ID: '${commentId}' does not exist in DB.`
          );
        }

        if (targetComment.author.toString() !== loggedUser.id.toString()) {
          throw new AuthenticationError('Access is denied.');
        }

        targetComment.body = body;
        targetComment.updatedAt = Date.now();

        post.comments = post.comments.map((c) =>
          c._id.toString() !== commentId ? c : targetComment
        );
        const savedPost = await post.save();
        const populatedPost = await savedPost
          .populate('comments.author', 'username')
          .execPopulate();

        return populatedPost.comments;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
  },
};
