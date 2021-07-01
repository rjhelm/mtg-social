import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UpvoteButton, DownvoteButton } from './VoteButtons';
import { useAuthContext } from '../context/auth';
import PostedByUser from './PostedByUser';
import CommentSection from './CommentSection';
import AcceptReplyButton from './AcceptReplyButton';
import DeleteDialog from './DeleteDialog';
import AuthFormModal from './AuthFormModal';
import { ReactComponent as AcceptedIcon } from '../svg/accepted.svg';

import {
  Typography,
  Chip,
  Button,
  SvgIcon,
  TextField,
} from '@material-ui/core';
import { usePostPageStyles } from '../styles/muiStyles';

const PostReplyDetails = ({
  postReply,
  upvotePostReply,
  downvotePostReply,
  editPostReply,
  deletePostReply,
  addComment,
  editComment,
  deleteComment,
  acceptReply,
  isReply,
  acceptedReply,
  postAuthor,
}) => {
  const {
    id,
    author,
    body,
    tags,
    comments,
    points,
    upvotedBy,
    downvotedBy,
    createdAt,
    updatedAt,
  } = postReply;

  const classes = usePostPageStyles();
  const { user } = useAuthContext();
  const [editReplyOpen, setEditReplyOpen] = useState(false);
  const [editedReplyBody, setEditedReplyBody] = useState(body);

  useEffect(() => {
    if (isReply) {
      setEditedReplyBody(body);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body]);

  const openEditInput = () => {
    setEditReplyOpen(true);
  };

  const closeEditInput = () => {
    setEditReplyOpen(false);
  };

  const handleReplyEdit = (e) => {
    e.preventDefault();
    editPostReply(editedReplyBody, id);
    closeEditInput();
  };

  return (
    <div className={classes.postReplyWrapper}>
      <div className={classes.voteColumn}>
        {user ? (
          <UpvoteButton
            checked={user ? upvotedBy.includes(user.id) : false}
            user={user}
            handleUpvote={upvotePostReply}
          />
        ) : (
          <AuthFormModal buttonType="upvote" />
        )}
        <Typography variant="h6" color="secondary">
          {points}
        </Typography>
        {user ? (
          <DownvoteButton
            checked={user ? downvotedBy.includes(user.id) : false}
            user={user}
            handleDownvote={downvotePostReply}
          />
        ) : (
          <AuthFormModal buttonType="downvote" />
        )}
        {isReply && user && user.id === postAuthor.id && (
          <AcceptReplyButton
            checked={acceptedReply === id}
            handleAcceptReply={acceptReply}
          />
        )}
        {isReply &&
          acceptedReply === id &&
          (!user || user.id !== postAuthor.id) && (
            <SvgIcon className={classes.checkedAcceptIcon}>
              <AcceptedIcon />
            </SvgIcon>
          )}
      </div>
      <div className={classes.postBody}>
        {!editReplyOpen ? (
          <Typography variant="body1" style={{ wordWrap: 'anywhere' }}>
            {body}
          </Typography>
        ) : (
          <form className={classes.smallForm} onSubmit={handleReplyEdit}>
            <TextField
              value={editedReplyBody}
              required
              fullWidth
              onChange={(e) => setEditedReplyBody(e.target.value)}
              type="text"
              placeholder="Enter at least 30 characters"
              variant="outlined"
              size="small"
              multiline
              rows={4}
            />
            <div className={classes.submitCancelBtns}>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
                style={{ marginRight: 9 }}
              >
                Update Reply
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => setEditReplyOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
        {tags && (
          <div className={classes.tagsWrapper}>
            {tags.map((t) => (
              <Chip
                key={t}
                label={t}
                variant="outlined"
                color="primary"
                size="small"
                component={RouterLink}
                to={`/tags/${t}`}
                className={classes.tag}
                clickable
              />
            ))}
          </div>
        )}
        <div className={classes.bottomWrapper}>
          {!editReplyOpen && (
            <div className={classes.btnsWrapper}>
              {user && user.id === author.id && (
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  style={{ marginRight: 6 }}
                  className={classes.bottomBtns}
                  onClick={isReply ? openEditInput : editPostReply}
                >
                  Edit
                </Button>
              )}
              {user && (user.id === author.id || user.role === 'ADMIN') && (
                <DeleteDialog
                  bodyType={isReply ? 'reply' : 'post'}
                  handleDelete={deletePostReply}
                />
              )}
            </div>
          )}
          <PostedByUser
            username={author.username}
            userId={author.id}
            createdAt={createdAt}
            updatedAt={updatedAt}
            filledVariant={true}
            isReply={isReply}
          />
        </div>
        <CommentSection
          user={user}
          comments={comments}
          addComment={addComment}
          editComment={editComment}
          deleteComment={deleteComment}
          postReplyId={id}
        />
      </div>
    </div>
  );
};

export default PostReplyDetails;
