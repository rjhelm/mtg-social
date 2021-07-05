const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/post');
const User = require('../../models/user');
const authChecker = require('../../utils/authChecker');
const errorHandler = require('../../utils/errorHandler');

module.exports = {
  Mutation: {
    addReplyComment: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, replyId, body } = args;

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

        const targetReply = post.replies.find(
          (a) => a._id.toString() === replyId
        );

        if (!targetReply) {
          throw new UserInputError(
            `Reply with ID: '${replyId}' does not exist in DB.`
          );
        }

        targetReply.comments.push({
          body,
          author: loggedUser.id,
        });

        post.replies = post.replies.map((a) =>
          a._id.toString() !== replyId ? a : targetReply
        );

        const savedPost = await post.save();
        const populatedPost = await savedPost
          .populate('replies.comments.author', 'username')
          .execPopulate();

        const updatedReply = populatedPost.replies.find(
          (a) => a._id.toString() === replyId
        );
        return updatedReply.comments;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    deleteReplyComment: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, replyId, commentId } = args;

      try {
        const user = await User.findById(loggedUser.id);
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `Post with ID: ${postId} does not exist in DB.`
          );
        }

        const targetReply = post.reply.find(
          (r) => r._id.toString() === replyId
        );

        if (!targetReply) {
          throw new UserInputError(
            `Reply with ID: '${replyId}' does not exist in DB.`
          );
        }

        const targetComment = targetReply.comments.find(
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

        targetReply.comments = targetReply.comments.filter(
          (c) => c._id.toString() !== commentId
        );

        post.replies = post.replies.map((r) =>
          r._id.toString() !== replyId ? r : targetReply
        );

        await post.save();
        return commentId;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    editReplyComment: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, replyId, commentId, body } = args;

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

        const targetReply = post.replies.find(
          (r) => r._id.toString() === replyId
        );

        if (!targetReply) {
          throw new UserInputError(
            `Reply with ID: '${replyId}' does not exist in DB.`
          );
        }

        const targetComment = targetReply.comments.find(
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

        targetReply.comments = targetReply.comments.map((c) =>
          c._id.toString() !== commentId ? c : targetComment
        );
        post.replies = post.replies.map((a) =>
          a._id.toString() !== replyId ? a : targetReply
        );

        const savedPost = await post.save();
        const populatedPost = await savedPost
          .populate('replies.comments.author', 'username')
          .execPopulate();

        const updatedReply = populatedPost.replies.find(
          (r) => r._id.toString() === replyId
        );

        return updatedReply.comments;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
  },
};
