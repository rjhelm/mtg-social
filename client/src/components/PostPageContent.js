import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  VOTE_POST,
  DELETE_POST,
  ADD_POST_COMMENT,
  EDIT_POST_COMMENT,
  DELETE_POST_COMMENT,
} from '../graphql/mutations';
import { VIEW_POST } from '../graphql/queries';
import { useAuthContext } from '../context/auth';
import { useStateContext } from '../context/state';
import PostReplyDetails from './PostReplyDetails';
import ReplyList from './ReplyList';
import ReplyForm from './ReplyForm';
import { upvote, downvote } from '../utils/votePostReply';
import { getErrorMsg } from '../utils/helperFuncs';

import { Divider } from '@material-ui/core';
import { usePostPageStyles } from '../styles/muiStyles';

const PostPageContent = ({ post }) => {
  const {
    id: postId,
    replies,
    acceptedReply,
    upvotedBy,
    downvotedBy,
    title,
    body,
    tags,
    author,
  } = post;

  const { user } = useAuthContext();
  const { setEditValues, notify } = useStateContext();
  const history = useHistory();
  const classes = usePostPageStyles();

  const [submitVote] = useMutation(VOTE_POST, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });

  const [removePost] = useMutation(DELETE_POST, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });

  const [postPostComment] = useMutation(ADD_POST_COMMENT, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });

  const [updatePostComment] = useMutation(EDIT_POST_COMMENT, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });

  const [removePostComment] = useMutation(DELETE_POST_COMMENT, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });

  const upvotePost = () => {
    const { updatedUpvotedArr, updatedDownvotedArr, updatedPoints } = upvote(
      upvotedBy,
      downvotedBy,
      user
    );

    submitVote({
      variables: { postId, voteType: 'UPVOTE' },
      optimisticResponse: {
        __typename: 'Mutation',
        votePost: {
          __typename: 'Post',
          id: postId,
          upvotedBy: updatedUpvotedArr,
          downvotedBy: updatedDownvotedArr,
          points: updatedPoints,
        },
      },
    });
  };

  const downvotePost = () => {
    const { updatedUpvotedArr, updatedDownvotedArr, updatedPoints } = downvote(
      upvotedBy,
      downvotedBy,
      user
    );

    submitVote({
      variables: { postId, voteType: 'DOWNVOTE' },
      optimisticResponse: {
        __typename: 'Mutation',
        votePost: {
          __typename: 'Post',
          id: postId,
          upvotedBy: updatedUpvotedArr,
          downvotedBy: updatedDownvotedArr,
          points: updatedPoints,
        },
      },
    });
  };

  const editPost = () => {
    setEditValues({ postId, title, body, tags });
    history.push('/ask');
  };

  const deletePost = () => {
    removePost({
      variables: { postId },
      update: () => {
        history.push('/');
        notify('Post deleted!');
      },
    });
  };

  const addPostComment = (commentBody) => {
    postPostComment({
      variables: { postId, body: commentBody },
      update: (proxy, { data }) => {
        const dataInCache = proxy.readQuery({
          query: VIEW_POST,
          variables: { postId },
        });

        const updatedData = {
          ...dataInCache.viewPost,
          comments: data.addPostComment,
        };

        proxy.writeQuery({
          query: VIEW_POST,
          variables: { postId },
          data: { viewPost: updatedData },
        });

        notify('Comment added to post!');
      },
    });
  };

  const editPostComment = (editedCommentBody, commentId) => {
    updatePostComment({
      variables: { postId, commentId, body: editedCommentBody },
      update: () => {
        notify('Comment edited!');
      },
    });
  };

  const deletePostComment = (commentId) => {
    removePostComment({
      variables: { postId, commentId },
      update: (proxy, { data }) => {
        const dataInCache = proxy.readQuery({
          query: VIEW_POST,
          variables: { postId },
        });

        const filteredComments = dataInCache.viewPost.comments.filter(
          (c) => c.id !== data.deletePostComment
        );

        const updatedData = {
          ...dataInCache.viewPost,
          comments: filteredComments,
        };

        proxy.writeQuery({
          query: VIEW_POST,
          variables: { postId },
          data: { viewPost: updatedData },
        });

        notify('Comment deleted!');
      },
    });
  };

  return (
    <div className={classes.content}>
      <PostReplyDetails
        postReply={post}
        upvotePostReply={upvotePost}
        downvotePostReply={downvotePost}
        editPostReply={editPost}
        deletePostReply={deletePost}
        addComment={addPostComment}
        editComment={editPostComment}
        deleteComment={deletePostComment}
      />
      <Divider />
      <ReplyList
        postId={postId}
        replies={replies}
        acceptedReply={acceptedReply}
        postAuthor={author}
      />
      <ReplyForm postId={postId} tags={tags} />
    </div>
  );
};

export default PostPageContent;
