const userResolvers = require('./user');
const postResolvers = require('./post');
const replyResolvers = require('./reply');
const postCommentResolvers = require('./postComment');
const replyCommentResolvers = require('./replyComment');
const tagResolvers = require('./tag');
const { GraphQLDateTime } = require('graphql-iso-date');

module.exports = {
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
    ...tagResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...replyResolvers.Mutation,
    ...postCommentResolvers.Mutation,
    ...replyCommentResolvers.Mutation,
  },
  PostList: {
    replyCount: (parent) => parent.replies.length,
  },
  User: {
    reputation: (parent) => {
      const postRep = parent.posts.reduce((sum, q) => sum + q.rep, 0);
      const replyRep = parent.replies.reduce((sum, a) => sum + a.rep, 0);
      return 1 + postRep + replyRep;
    },
    totalPosts: (parent) => parent.posts.length,
    totalReplies: (parent) => parent.replies.length,
  },
  RoleType: {
    USER: 'user',
    ADMIN: 'admin',
  },
  SortByType: {
    HOT: 'hot',
    VOTES: 'votes',
    VIEWS: 'views',
    NEWEST: 'newest',
    OLDEST: 'oldest',
  },
  VoteType: {
    UPVOTE: 'upvote',
    DOWNVOTE: 'downvote',
  },
  DateTime: GraphQLDateTime,
};
