import { Link as RouterLink } from 'react-router-dom';
import { formatDateAgo } from '../utils/helpers';
import { Typography } from '@material-ui/core';
import { useUserPageStyles } from '../styles/muiStyles';

const RecentPosts = ({ post }) => {
  const classes = useUserPageStyles();

  return (
    <div className={classes.recentPostReply}>
      <div className={classes.votesTitleWrapper}>
        <div className={classes.votes}>
          <Typography color="primary" variant="subtitle2">
            {post.points}
          </Typography>
        </div>
        <Typography
          variant="subtitle2"
          color="secondary"
          className={classes.title}
          component={RouterLink}
          to={`/posts/${post.id}`}
        >
          {post.title}
        </Typography>
      </div>
      <Typography variant="caption" className={classes.timeAgo}>
        {formatDateAgo(post.createdAt)} ago
      </Typography>
    </div>
  );
};

export default RecentPosts;
