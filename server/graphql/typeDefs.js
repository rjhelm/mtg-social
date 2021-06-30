const { gql } = require('apollo-server');

module.exports = gql`
  enum RoleType {
    USER
    ADMIN
  }

  enum VoteType {
    UPVOTE
    DOWNVOTE
  }

  enum SortByType {
    HOT
    VOTES
    VIEWS
    NEWEST
    OLDEST
  }

  scalar DateTime

  type PostRep {
    postId: ID!
    rep: Int!
  }

  type ReplyRep {
    replyId: ID!
    rep: Int!
  }

  type RecentActivity {
    id: ID!
    title: String!
    points: Int!
    createdAt: DateTime!
  }

  type LoggedUser {
    id: ID!
    username: String!
    token: String!
    role: RoleType!
  }

  type User {
    id: ID!
    username: String!
    role: RoleType!
    posts: [PostRep]!
    replies: [ReplyRep]!
    createdAt: DateTime!
    reputation: Int!
    recentPosts: [RecentActivity]!
    recentReplies: [RecentActivity]!
    totalPosts: Int!
    totalReplies: Int!
  }

  type UserList {
    id: ID!
    username: String!
    createdAt: DateTime!
  }

  type Author {
    id: ID!
    username: String!
  }

  type Comment {
    id: ID!
    author: Author!
    body: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Reply {
    id: ID!
    author: Author!
    body: String!
    comments: [Comment]!
    points: Int!
    upvotedBy: [ID]!
    downvotedBy: [ID]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type PostList {
    id: ID!
    author: Author!
    title: String!
    body: String!
    tags: [String!]!
    points: Int!
    views: Int!
    replies: [Reply]!
    replyCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Post {
    id: ID!
    author: Author!
    title: String!
    body: String!
    tags: [String!]!
    points: Int!
    views: Int!
    acceptedReply: ID
    comments: [Comment]!
    replies: [Reply]!
    upvotedBy: [ID]!
    downvotedBy: [ID]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type NextPrevPage {
    page: Int!
    limit: Int!
  }

  type PaginatedPostList {
    posts: [PostList]!
    next: NextPrevPage
    previous: NextPrevPage
  }

  type Tag {
    tagName: String!
    count: Int!
  }

  type Query {
    getPosts(
      sortBy: SortByType!
      page: Int!
      limit: Int!
      filterByTag: String
      filterBySearch: String
    ): PaginatedPostList!
    viewPost(postId: ID!): Post
    getUser(username: String!): User!
    getAllUsers: [UserList]!
    getAllTags: [Tag]!
  }

  type Mutation {
    register(username: String!, password: String!): LoggedUser!
    login(username: String!, password: String!): LoggedUser!

    postPost(title: String!, body: String!, tags: [String!]!): Post!
    deletePost(postId: ID!): ID!
    editPost(
      postId: ID!
      title: String!
      body: String!
      tags: [String!]!
    ): Post!
    votePost(postId: ID!, voteType: VoteType!): Post!

    postReply(postId: ID!, body: String!): [Reply!]!
    deleteReply(postId: ID!, replyId: ID!): ID!
    editReply(postId: ID!, replyId: ID!, body: String!): [Reply!]!
    voteReply(postId: ID!, replyId: ID!, voteType: VoteType!): Reply!
    acceptReply(postId: ID!, replyId: ID!): Post!

    addPostComment(postId: ID!, body: String!): [Comment!]!
    deletePostComment(postId: ID!, commentId: ID!): ID!
    editPostComment(postId: ID!, commentId: ID!, body: String!): [Comment!]!

    addReplyComment(postId: ID!, replyId: ID!, body: String!): [Comment!]!
    deleteReplyComment(postId: ID!, replyId: ID!, commentId: ID!): ID!
    editReplyComment(
      postId: ID!
      replyId: ID!
      commentId: ID!
      body: String!
    ): [Comment!]!
  }
`;
