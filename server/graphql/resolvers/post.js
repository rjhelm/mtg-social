const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/post');
const User = require('../../models/user');
const authChecker = require('../../utils/authChecker');
const { postValidator } = require('../../utils/validators');
const errorHandler = require('../../utils/errorHandler');
const {
  paginateResults,
  upvoteIt,
  downvoteIt,
  postRep,
} = require('../../utils/helperFuncs');

module.exports = {
  Query: {
   getPosts: async (_, args) => {
      const { sortBy, filterByTag, filterBySearch } = args;
      const page = Number(args.page);
      const limit = Number(args.limit);

      let sortQuery;
      switch (sortBy) {
        case 'votes':
          sortQuery = { points: -1 };
          break;
        case 'views':
          sortQuery = { views: -1 };
          break;
        case 'newest':
          sortQuery = { createdAt: -1 };
          break;
        case 'oldest':
          sortQuery = { createdAt: 1 };
          break;
        default:
          sortQuery = { hotAlgo: -1 };
      }

      let findQuery = {};
      if (filterByTag) {
        findQuery = { tags: { $all: [filterByTag] } };
      } else if (filterBySearch) {
        findQuery = {
          $or: [
            {
              title: {
                $regex: filterBySearch,
                $options: 'i',
              },
            },
            {
              body: {
                $regex: filterBySearch,
                $options: 'i',
              },
            },
          ],
        };
      }

      try {
        const postCount = await Post.find(findQuery).countDocuments();
        const paginated = paginateResults(page, limit, postCount);
        const posts = await Post.find(findQuery)
          .sort(sortQuery)
          .limit(limit)
          .skip(paginated.startIndex)
          .populate('author', 'username');

        const paginatedPost = {
          previous: paginated.results.previous,
          posts,
          next: paginated.results.next,
        };

        return paginatedPost;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    viewPost: async (_, args) => {
      const { postId } = args;

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error(`Post with ID: ${postId} does not exist in DB.`);
        }

        post.views++;
        const savedPost = await post.save();
        const populatedPost = await savedPost
          .populate('author', 'username')
          .populate('comments.author', 'username')
          .populate('replies.author', 'username')
          .populate('replies.comments.author', 'username')
          .execPopulate();

        return populatedPost;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
  },
  Mutation: {
    newPost: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { title, body, tags } = args;

      const { errors, valid } = postValidator(title, body);
      if (!valid) {
        throw new UserInputError(Object.values(errors)[0], { errors });
      }

      try {
        const author = await User.findById(loggedUser.id);
        const newPost = new Post({
          title,
          body,
          author: author._id,
        });
        const savedPost = await newPost.save();
        const populatedPost = await savedPost
          .populate('author', 'username')
          .execPopulate();

        author.posts.push({ postId: savedPost._id });
        await author.save();

        return populatedPost;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    deletePost: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId } = args;

      try {
        const user = await User.findById(loggedUser.id);
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `Post with ID: ${postId} does not exist in DB.`
          );
        }

        if (
          post.author.toString() !== user._id.toString() &&
          user.role !== 'admin'
        ) {
          throw new AuthenticationError('Access is denied.');
        }

        await Post.findByIdAndDelete(postId);
        return post._id;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    editPost: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, title, body, tags } = args;

      const { errors, valid } = postValidator(title, body, tags);
      if (!valid) {
        throw new UserInputError(Object.values(errors)[0], { errors });
      }

      const updatedPostObj = {
        title,
        body,
        tags,
        updatedAt: Date.now(),
      };

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `Post with ID: ${postId} does not exist in DB.`
          );
        }

        if (post.author.toString() !== loggedUser.id) {
          throw new AuthenticationError('Access is denied.');
        }

        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          updatedPostObj,
          { new: true }
        )
          .populate('author', 'username')
          .populate('comments.author', 'username')
          .populate('replies.author', 'username')
          .populate('replies.comments.author', 'username');

        return updatedPost;
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
    votePost: async (_, args, context) => {
      const loggedUser = authChecker(context);
      const { postId, voteType } = args;

      try {
        const user = await User.findById(loggedUser.id);
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError(
            `Post with ID: ${postId} does not exist in DB.`
          );
        }

        if (post.author.toString() === user._id.toString()) {
          throw new UserInputError("You can't vote for your own post.");
        }

        let votedPost;
        if (voteType === 'upvote') {
          votedPost = upvoteIt(post, user);
        } else {
          votedPost = downvoteIt(post, user);
        }

        votedPost.hotAlgo =
          Math.log(Math.max(Math.abs(votedPost.points), 1)) +
          Math.log(Math.max(votedPost.views * 2, 1)) +
          votedPost.createdAt / 4500;

        const savedPost = await votedPost.save();
        const author = await User.findById(post.author);
        const addedRepAuthor = quesRep(post, author);
        await addedRepAuthor.save();

        return await savedPost
          .populate('author', 'username')
          .populate('comments.author', 'username')
          .populate('replies.author', 'username')
          .populate('replies.comments.author', 'username')
          .execPopulate();
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
  },
};
