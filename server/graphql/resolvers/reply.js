const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/post');
const User = require('../../models/user');
const authChecker = require('../../utils/authChecker');
const errorHandler = require('../../utils/errorHandler');
const { upvoteIt, downvoteIt, replyRep } = require('../../utils/helperFuncs');

module.exports = {
  Mutation: {
    postReply: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, body } = args;

      if (body.trim() === '' || body.length < 30) {
        throw new UserInputError('Reply must be atleast 30 characters long.');
      }

      try {
        const author = await User.findById(loggedUser.id);
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `post with ID: ${postId} does not exist in DB.`
          );
        }

        post.replies.push({
          body,
          author: author._id,
        });
        const savedPost = await post.save();
        const populatedPost = await savedPost
          .populate('replies.author', 'username')
          .populate('replies.comments.author', 'username')
          .execPopulate();

        author.replies.push({
          replyId: savedPost.replies[savedPost.replies.length - 1]._id,
        });
        await author.save();

        return populatedPost.replies;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    deleteReply: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, replyId } = args;

      try {
        const user = await User.findById(loggedUser.id);
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `post with ID: ${postId} does not exist in DB.`
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

        if (
          targetReply.author.toString() !== user._id.toString() &&
          user.role !== 'admin'
        ) {
          throw new AuthenticationError('Access is denied.');
        }

        post.replies = post.replies.filter(
          (a) => a._id.toString() !== replyId
        );
        await post.save();
        return replyId;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    editReply: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, replyId, body } = args;

      if (body.trim() === '' || body.length < 30) {
        throw new UserInputError('Reply must be atleast 30 characters long.');
      }

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `post with ID: ${postId} does not exist in DB.`
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

        if (targetReply.author.toString() !== loggedUser.id.toString()) {
          throw new AuthenticationError('Access is denied.');
        }

        targetReply.body = body;
        targetReply.updatedAt = Date.now();

        post.replies = post.replies.map((a) =>
          a._id.toString() !== replyId ? a : targetReply
        );

        const savedPost = await post.save();
        const populatedPost = await savedPost
          .populate('replies.author', 'username')
          .populate('replies.comments.author', 'username')
          .execPopulate();

        return populatedPost.replies;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    voteReply: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, replyId, voteType } = args;

      try {
        const user = await User.findById(loggedUser.id);
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `post with ID: ${postId} does not exist in DB.`
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

        if (targetReply.author.toString() === user._id.toString()) {
          throw new UserInputError("You can't vote for your own post.");
        }

        let votedReply;
        if (voteType === 'upvote') {
          votedReply = upvoteIt(targetReply, user);
        } else {
          votedReply = downvoteIt(targetReply, user);
        }

        post.replies = post.replies.map((a) =>
          a._id.toString() !== replyId ? a : votedReply
        );

        const savedPost = await post.save();
        const populatedPost = await savedPost
          .populate('replies.author', 'username')
          .populate('replies.comments.author', 'username')
          .execPopulate();

        const author = await User.findById(targetReply.author);
        const addedRepAuthor = replyRep(targetReply, author);
        await addedRepAuthor.save();

        return populatedPost.replies.find((a) => a._id.toString() === replyId);
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    acceptReply: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, replyId } = args;

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `post with ID: ${postId} does not exist in DB.`
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

        if (post.author.toString() !== loggedUser.id.toString()) {
          throw new UserInputError(
            'Only the author of post can accept replies.'
          );
        }

        if (
          !post.acceptedReply ||
          !post.acceptedReply.equals(targetReply._id)
        ) {
          post.acceptedReply = targetReply._id;
        } else {
          post.acceptedReply = null;
        }

        const savedPost = await post.save();
        const populatedPost = await savedPost
          .populate('replies.author', 'username')
          .populate('replies.comments.author', 'username')
          .execPopulate();

        return populatedPost;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
  },
};
