import { useState } from 'react';
// Dependencies //
import { useMutation } from '@apollo/client';
import {
  VOTE_REPLY,
  ACCEPT_REPLY,
  EDIT_REPLY,
  DELETE_REPLY,
  ADD_REPLY_COMMENT,
  EDIT_REPLY_COMMENT,
  DELETE_REPLY_COMMENT,
} from '../graphql/mutations';
import { VIEW_POST } from '../graphql/queries';
// Components, Helpers //
import PostReplyDetails from './PostReplyDetails';
import SortReplyBar from './SortReplyBar';
import { useAuthContext } from '../context/auth';
import { useStateContext } from '../context/state';
import sortReplies from '../utils/sortReplies';
import { upvote, downvote } from '../utils/votePostReply';
import { getErrorMsg } from '../utils/helpers';
// Styles //
import { Typography, useMediaQuery, Divider } from '@material-ui/core';
import { usePostPageStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';


const ReplyList = ({ postId, replies, acceptedReply, postAuthor }) => {
  const { user } = useAuthContext();
  const { notify } = useStateContext();
  const classes = usePostPageStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [sortBy, setSortBy] = useState('VOTES');

  const [updateReply] = useMutation(EDIT_REPLY, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });

  const [removeReply] = useMutation(DELETE_REPLY, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });

  const [submitVote] = useMutation(VOTE_REPLY, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });
  const [submitAcceptReply] = useMutation(ACCEPT_REPLY, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });
  const [postReplyComment] = useMutation(ADD_REPLY_COMMENT, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });
  const [updateReplyComment] = useMutation(EDIT_REPLY_COMMENT, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });
  const [removeReplyComment] = useMutation(DELETE_REPLY_COMMENT, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });

  const upvoteReply = (replyId, upvotedBy, downvotedBy) => {
    const { updatedUpvotedArr, updatedDownvotedArr, updatedPoints } = upvote(
      upvotedBy,
      downvotedBy,
      user
    );

    submitVote({
      variables: { postId, replyId, voteType: 'UPVOTE' },
      optimisticResponse: {
        __typename: 'Mutation',
        voteReply: {
          __typename: 'Reply',
          id: replyId,
          upvotedBy: updatedUpvotedArr,
          downvotedBy: updatedDownvotedArr,
          points: updatedPoints,
        },
      },
    });
  };

  const downvoteReply = (replyId, upvotedBy, downvotedBy) => {
    const { updatedUpvotedArr, updatedDownvotedArr, updatedPoints } = downvote(
      upvotedBy,
      downvotedBy,
      user
    );

    submitVote({
      variables: { postId, replyId, voteType: 'DOWNVOTE' },
      optimisticResponse: {
        __typename: 'Mutation',
        voteReply: {
          __typename: 'Reply',
          id: replyId,
          upvotedBy: updatedUpvotedArr,
          downvotedBy: updatedDownvotedArr,
          points: updatedPoints,
        },
      },
    });
  };

  const editReply = (editedReplyBody, replyId) => {
    updateReply({
      variables: { postId, replyId, body: editedReplyBody },
      update: () => {
        notify('Reply updated!');
      },
    });
  };

  const deleteReply = (replyId) => {
    removeReply({
      variables: { postId, replyId },
      update: (proxy, { data }) => {
        const dataInCache = proxy.readQuery({
          query: VIEW_POST,
          variables: { postId },
        });

        const filteredReplies = dataInCache.viewPost.replies.filter(
          (c) => c.id !== data.deleteReply
        );

        const updatedData = {
          ...dataInCache.viewPost,
          replies: filteredReplies,
        };

        proxy.writeQuery({
          query: VIEW_POST,
          variables: { postId },
          data: { viewPost: updatedData },
        });

        notify('Reply deleted!');
      },
    });
  };

  const acceptReply = (replyId) => {
    submitAcceptReply({
      variables: { postId, replyId },
      optimisticResponse: {
        acceptReply: {
          id: postId,
          acceptedReply: acceptedReply === replyId ? null : replyId,
          __typename: 'Post',
        },
      },
      update: (_, { data }) => {
        if (data.acceptReply.acceptedReply) {
          notify('Accepted the reply!');
        } else {
          notify('Un-accepted the reply.');
        }
      },
    });
  };

  const addReplyComment = (commentBody, replyId) => {
    postReplyComment({
      variables: { postId, replyId, body: commentBody },
      update: (proxy, { data }) => {
        const dataInCache = proxy.readQuery({
          query: VIEW_POST,
          variables: { postId },
        });

        const updatedReplies = dataInCache.viewPost.replies.map((a) =>
          a.id === replyId ? { ...a, comments: data.addReplyComment } : a
        );

        const updatedData = {
          ...dataInCache.viewPost,
          replies: updatedReplies,
        };

        proxy.writeQuery({
          query: VIEW_POST,
          variables: { postId },
          data: { viewPost: updatedData },
        });

        notify('Comment added to reply!');
      },
    });
  };

  const editReplyComment = (editedCommentBody, commentId, replyId) => {
    updateReplyComment({
      variables: { postId, replyId, commentId, body: editedCommentBody },
      update: () => {
        notify('Comment edited!');
      },
    });
  };

  const deleteReplyComment = (commentId, replyId) => {
    removeReplyComment({
      variables: { postId, replyId, commentId },
      update: (proxy, { data }) => {
        const dataInCache = proxy.readQuery({
          query: VIEW_POST,
          variables: { postId },
        });

        const targetReply = dataInCache.viewPost.replies.find(
          (a) => a.id === replyId
        );
        const updatedComments = targetReply.comments.filter(
          (c) => c.id !== data.deleteReplyComment
        );

        const updatedReplies = dataInCache.viewPost.replies.map((a) =>
          a.id === replyId ? { ...a, comments: updatedComments } : a
        );

        const updatedData = {
          ...dataInCache.viewPost,
          replies: updatedReplies,
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

  const replyList = sortReplies(sortBy, replies, acceptedReply);

  return (
    <div className={classes.repliesWrapper}>
      {replyList.length !== 0 && (
        <div className={classes.replyHeader}>
          <Typography color="secondary" variant="h6">
            {replyList.length} {replyList.length === 1 ? 'Reply' : 'Replies'}
          </Typography>
          <SortReplyBar
            sortBy={sortBy}
            setSortBy={setSortBy}
            isMobile={isMobile}
          />
        </div>
      )}
      <div>
        {replyList.map((a) => (
          <div key={a.id} className={classes.replyWrapper}>
            <PostReplyDetails
              postReply={a}
              upvotePostReply={() => upvoteReply(a.id, a.upvotedBy, a.downvotedBy)}
              downvotePostReply={() =>
                downvoteReply(a.id, a.upvotedBy, a.downvotedBy)
              }
              editPostReply={editReply}
              deletePostReply={() => deleteReply(a.id)}
              acceptReply={() => acceptReply(a.id)}
              addComment={addReplyComment}
              editComment={editReplyComment}
              deleteComment={deleteReplyComment}
              isReply={true}
              acceptedReply={acceptedReply}
              postAuthor={postAuthor}
            />
            <Divider />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReplyList;
