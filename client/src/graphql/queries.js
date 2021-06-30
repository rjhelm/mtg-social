import { gql } from '@apollo/client';
import { AUTHOR_DETAILS, COMMENT_DETAILS, REPLY_DETAILS } from './fragments';

export const GET_POSTS = gql`
  query fetchPosts(
    $sortBy: SortByType!
    $page: Int!
    $limit: Int!
    $filterByTag: String
    $filterBySearch: String
  ) {
    getPosts(
      sortBy: $sortBy
      page: $page
      limit: $limit
      filterByTag: $filterByTag
      filterBySearch: $filterBySearch
    ) {
      next {
        page
      }
      previous {
        page
      }
      posts {
        id
        author {
          ...AuthorDetails
        }
        title
        body
        tags
        points
        views
        createdAt
        updatedAt
        replyCount
      }
    }
  }
  ${AUTHOR_DETAILS}
`;

export const VIEW_POST = gql`
  query fetchPost($postId: ID!) {
    viewPost(postId: $postId) {
      id
      author {
        ...AuthorDetails
      }
      title
      body
      tags
      points
      views
      createdAt
      updatedAt
      replies {
        ...ReplyDetails
      }
      author {
        ...AuthorDetails
      }
      comments {
        ...CommentDetails
      }
      acceptedReply
      upvotedBy
      downvotedBy
    }
  }

  ${REPLY_DETAILS}
  ${COMMENT_DETAILS}
  ${AUTHOR_DETAILS}
`;

export const GET_USER = gql`
  query fetchUser($username: String!) {
    getUser(username: $username) {
      id
      username
      role
      createdAt
      reputation
      totalPosts
      totalReplies
      recentPosts {
        id
        title
        points
        createdAt
      }
      recentReplies {
        id
        title
        points
        createdAt
      }
    }
  }
`;

export const GET_ALL_TAGS = gql`
  query {
    getAllTags {
      tagName
      count
    }
  }
`;

export const GET_ALL_USERS = gql`
  query {
    getAllUsers {
      id
      username
      createdAt
    }
  }
`;
