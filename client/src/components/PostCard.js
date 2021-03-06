import { Link as RouterLink } from 'react-router-dom';
import PostedByUser from './PostedByUser';

import { Paper, Typography, Chip } from '@material-ui/core';
import { usePostCardStyles } from '../styles/muiStyles';

const PostCard = ({ post }) => {
  const classes = usePostCardStyles();

  const {
    id,
    title,
    author,
    body,
    tags,
    points,
    views,
    replyCount,
    createdAt,
  } = post;

  return (
    <Paper elevation={0} className={classes.root}>
      <div className={classes.infoWrapper}>
        <div className={classes.innerInfo}>
          <Typography variant="body2" className={classes.mainText}>
            {points}
          </Typography>
          <Typography variant="caption">Votes</Typography>
        </div>
        <div className={classes.innerInfo}>
          <Typography variant="body2" className={classes.mainText}>
            {replyCount}
          </Typography>
          <Typography variant="caption">Replies</Typography>
        </div>
        <Typography variant="caption" noWrap>
          {views} Views
        </Typography>
      </div>
      <div className={classes.quesDetails}>
        <Typography
          variant="body2"
          color="secondary"
          className={classes.title}
          component={RouterLink}
          to={`/posts/${id}`}
        >
          {title}
        </Typography>
        <Typography variant="body2" style={{ wordWrap: 'anywhere' }}>
          {body.length > 150 ? body.slice(0, 150) + '...' : body}
        </Typography>
        <div className={classes.bottomWrapper}>
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
          <PostedByUser
            username={author.username}
            userId={author.id}
            createdAt={createdAt}
          />
        </div>
      </div>
    </Paper>
  );
};

export default PostCard;
