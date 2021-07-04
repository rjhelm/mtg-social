import { Link as RouterLink } from 'react-router-dom';
import { formatDateAgo, formatDayTime } from '../utils/helpers';
import { Typography, Link, Avatar } from '@material-ui/core';
import { usePostCardStyles } from '../styles/muiStyles';

const ByUser = ({
  username,
  userId,
  createdAt,
  updatedAt,
  filledVariant,
  isReply,
}) => {
  const classes = usePostCardStyles();

  return (
    <div
      className={filledVariant ? classes.filledByUser : classes.byUserWrapper}
    >
      <Avatar
        src={`https://secure.gravatar.com/avatar/${userId}?s=164&d=identicon`}
        alt={username}
        className={filledVariant ? classes.postReplyAvatar : classes.homeAvatar}
        component={RouterLink}
        to={`/user/${username}`}
      />
      <div>
        <Typography variant="caption" color="secondary">
          {filledVariant
            ? `${isReply ? 'replied' : 'posted'} ${formatDayTime(createdAt)}`
            : `posted ${formatDateAgo(createdAt)} ago`}
        </Typography>
        <br />
        {filledVariant && createdAt !== updatedAt && (
          <Typography variant="caption" color="secondary">
            {`updated ${formatDayTime(updatedAt)}`}
          </Typography>
        )}
        <Link component={RouterLink} to={`/user/${username}`}>
          <Typography variant="body2">{username}</Typography>
        </Link>
      </div>
    </div>
  );
};

export default ByUser;
