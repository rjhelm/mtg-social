import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { VIEW_POST } from '../graphql/queries';
import { useStateContext } from '../context/state';
import { useAuthContext } from '../context/auth';
import PostPageContent from '../components/PostPageContent';
import RightSidePanel from '../components/RightSidePanel';
import AuthFormModal from '../components/AuthFormModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateAgo, getErrorMsg } from '../utils/helpers';

import {
  Typography,
  Button,
  Divider,
  Grid,
  useMediaQuery,
} from '@material-ui/core';
import { usePostPageStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';

const PostPage = () => {
  const { clearEdit, notify } = useStateContext();
  const { user } = useAuthContext();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const classes = usePostPageStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [fetchPost, { data, loading }] = useLazyQuery(VIEW_POST, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });

  useEffect(() => {
    fetchPost({ variables: { postId } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  useEffect(() => {
    if (data) {
      setPost(data.viewPost);
    }
  }, [data]);

  if (loading || !post) {
    return (
      <div style={{ minWidth: '100%', marginTop: '20%' }}>
        <LoadingSpinner size={80} />
      </div>
    );
  }

  const { title, views, createdAt, updatedAt } = post;

  return (
    <div className={classes.root}>
      <div className={classes.topBar}>
        <div className={classes.titleWrapper}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            color="secondary"
            style={{ wordWrap: 'anywhere' }}
          >
            {title}
          </Typography>
          {user ? (
            <Button
              variant="contained"
              color="primary"
              size={isMobile ? 'small' : 'medium'}
              component={RouterLink}
              to="/ask"
              onClick={() => clearEdit()}
              style={{ minWidth: '9em' }}
            >
              Command Post
            </Button>
          ) : (
            <AuthFormModal buttonType="ask" />
          )}
        </div>
        <div className={classes.postInfo}>
          <Typography variant="caption" style={{ marginRight: 10 }}>
            Commander <strong>{formatDateAgo(createdAt)} Posted</strong>
          </Typography>
          {createdAt !== updatedAt && (
            <Typography variant="caption" style={{ marginRight: 10 }}>
              Commander <strong>{formatDateAgo(updatedAt)} Edited</strong>
            </Typography>
          )}
          <Typography variant="caption">
            Commanders <strong>{views} Viewed</strong>
          </Typography>
        </div>
      </div>
      <Divider />
      <Grid container direction="row" wrap="nowrap" justify="space-between">
        <PostPageContent post={post} />
        <RightSidePanel />
      </Grid>
    </div>
  );
};

export default PostPage;
