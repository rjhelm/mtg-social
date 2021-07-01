import { gql } from '@apollo/client';
import {
  POST_DETAILS,
  LOGGED_USER_DETAILS,
  COMMENT_DETAILS,
  REPLY_DETAILS,
} from './fragments';

export const REGISTER_USER = gql`
  mutation registerUser($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      ...LoggedUserDetails
    }
  }
  ${LOGGED_USER_DETAILS}
`;

export const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ...LoggedUserDetails
    }
  }
  ${LOGGED_USER_DETAILS}
`;

export const NEW_POST = gql`
  mutation addPost($title: String!, $body: String!, $tags: [String!]!) {
    postPost(title: $title, body: $body, tags: $tags) {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`;

export const EDIT_POST = gql`
  mutation updatePost(
    $postId: ID!
    $title: String!
    $body: String!
    $tags: [String!]!
  ) {
    editPost(postId: $postId, title: $title, body: $body, tags: $tags) {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`;

export const DELETE_POST = gql`
  mutation removePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const VOTE_POST = gql`
  mutation submitVote($postId: ID!, $voteType: VoteType!) {
    votePost(postId: $postId, voteType: $voteType) {
      id
      upvotedBy
      downvotedBy
      points
    }
  }
`;

export const ADD_POST_COMMENT = gql`
  mutation postPostComment($postId: ID!, $body: String!) {
    addPostComment(postId: $postId, body: $body) {
      ...CommentDetails
    }
  }
  ${COMMENT_DETAILS}
`;

export const EDIT_POST_COMMENT = gql`
  mutation updatePostComment($postId: ID!, $commentId: ID!, $body: String!) {
    editPostComment(postId: $postId, commentId: $commentId, body: $body) {
      ...CommentDetails
    }
  }
  ${COMMENT_DETAILS}
`;

export const DELETE_POST_COMMENT = gql`
  mutation removePostComment($postId: ID!, $commentId: ID!) {
    deletePostComment(postId: $postId, commentId: $commentId)
  }
`;

export const POST_REPLY = gql`
  mutation addReply($postId: ID!, $body: String!) {
    postReply(postId: $postId, body: $body) {
      ...ReplyDetails
    }
  }
  ${REPLY_DETAILS}
`;

export const EDIT_REPLY = gql`
  mutation updateReply($postId: ID!, $replyId: ID!, $body: String!) {
    editReply(postId: $postId, replyId: $replyId, body: $body) {
      ...ReplyDetails
    }
  }
  ${REPLY_DETAILS}
`;

export const DELETE_REPLY = gql`
  mutation removeReply($postId: ID!, $replyId: ID!) {
    deleteReply(postId: $postId, replyId: $replyId)
  }
`;

export const VOTE_REPLY = gql`
  mutation submitVote($postId: ID!, $replyId: ID!, $voteType: VoteType!) {
    voteReply(postId: $postId, replyId: $replyId, voteType: $voteType) {
      id
      upvotedBy
      downvotedBy
      points
    }
  }
`;

export const ACCEPT_REPLY = gql`
  mutation submitAcceptReply($postId: ID!, $replyId: ID!) {
    acceptReply(postId: $postId, replyId: $replyId) {
      id
      acceptedReply
    }
  }
`;

export const ADD_REPLY_COMMENT = gql`
  mutation postReplyComment($postId: ID!, $replyId: ID!, $body: String!) {
    addReplyComment(postId: $postId, replyId: $replyId, body: $body) {
      ...CommentDetails
    }
  }
  ${COMMENT_DETAILS}
`;

export const EDIT_REPLY_COMMENT = gql`
  mutation updateReplyComment(
    $postId: ID!
    $replyId: ID!
    $commentId: ID!
    $body: String!
  ) {
    editReplyComment(
      postId: $postId
      replyId: $replyId
      commentId: $commentId
      body: $body
    ) {
      ...CommentDetails
    }
  }
  ${COMMENT_DETAILS}
`;

export const DELETE_REPLY_COMMENT = gql`
  mutation removeReplyComment($postId: ID!, $replyId: ID!, $commentId: ID!) {
    deleteReplyComment(postId: $postId, replyId: $replyId, commentId: $commentId)
  }
`;
