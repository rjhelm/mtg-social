import { gql } from '@apollo/client';

export const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    username
  }
`;

export const COMMENT_DETAILS = gql`
  fragment CommentDetails on Comment {
    id
    author {
      ...AuthorDetails
    }
    body
    createdAt
    updatedAt
  }
  ${AUTHOR_DETAILS}
`;

export const REPLY_DETAILS = gql`
  fragment ReplyDetails on Reply {
    id
    author {
      ...AuthorDetails
    }
    body
    comments {
      ...CommentDetails
    }
    points
    upvotedBy
    downvotedBy
    createdAt
    updatedAt
  }
  ${COMMENT_DETAILS}
  ${AUTHOR_DETAILS}
`;

export const POST_DETAILS = gql`
  fragment PostDetails on Post {
    id
    author {
      ...AuthorDetails
    }
    title
    body
    tags
    points
    views
    acceptedReply
    comments {
      ...CommentDetails
    }
    replies {
      ...ReplyDetails
    }
    upvotedBy
    downvotedBy
    createdAt
    updatedAt
  }
  ${COMMENT_DETAILS}
  ${AUTHOR_DETAILS}
  ${REPLY_DETAILS}
`;

export const LOGGED_USER_DETAILS = gql`
  fragment LoggedUserDetails on LoggedUser {
    id
    username
    role
    token
  }
`;
