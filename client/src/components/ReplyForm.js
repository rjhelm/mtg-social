import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { POST_REPLY } from '../graphql/mutations';
import { VIEW_POST } from '../graphql/queries';
import { useAuthContext } from '../context/auth';
import { useStateContext } from '../context/state';
import AuthFormModal from './AuthFormModal';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getErrorMsg } from '../utils/helpers';
import { Typography, Button, TextField, Chip, Link } from '@material-ui/core';
import { usePostPageStyles } from '../styles/muiStyles';

const validationSchema = yup.object({
  replyBody: yup.string().min(30, 'Must be at least 30 characters'),
});

const ReplyForm = ({ postId, tags }) => {
  const classes = usePostPageStyles();
  const { user } = useAuthContext();
  const { clearEdit, notify } = useStateContext();
  const { register, handleSubmit, reset, errors } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const [addReply, { loading }] = useMutation(POST_REPLY, {
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });

  const postReply = ({ replyBody }) => {
    addReply({
      variables: { postId, body: replyBody },
      update: (proxy, { data }) => {
        reset();

        const dataInCache = proxy.readQuery({
          query: VIEW_POST,
          variables: { postId },
        });

        const updatedData = {
          ...dataInCache.viewPosttion,
          replies: data.postReply,
        };

        proxy.writeQuery({
          query: VIEW_POST,
          variables: { postId },
          data: { viewPosttion: updatedData },
        });

        notify('Reply submitted!');
      },
    });
  };

  return (
    <div className={classes.replyForm}>
      {user && (
        <Typography variant="h6" color="secondary">
          Your Reply
        </Typography>
      )}
      {user && (
        <form onSubmit={handleSubmit(postReply)}>
          <TextField
            inputRef={register}
            name="replyBody"
            required
            fullWidth
            type="text"
            placeholder="Enter atleast 30 characters"
            variant="outlined"
            size="small"
            error={'replyBody' in errors}
            helperText={'replyBody' in errors ? errors.replyBody.message : ''}
            multiline
            rows={5}
          />
          <div>
            <Button
              color="primary"
              variant="contained"
              style={{ marginTop: '0.8em' }}
              type="submit"
              disabled={loading}
            >
              Post Your Reply(Up for a Game? Answer deck/card questions, add your opinion!)
            </Button>
          </div>
        </form>
      )}
      <div className={classes.footerText}>
        <span>
          Browse other posts tagged{' '}
          {tags.map((t) => (
            <Chip
              key={t}
              label={t}
              variant="outlined"
              color="primary"
              size="small"
              component={RouterLink}
              to={`/tags/${t}`}
              className={classes.footerTag}
              clickable
            />
          ))}
          or{' '}
          {user ? (
            <Link component={RouterLink} to="/ask" onClick={() => clearEdit()}>
                create your own post. Find games, discuss cards/decks, and more!
            </Link>
          ) : (
            <AuthFormModal buttonType="link" />
          )}
        </span>
      </div>
    </div>
  );
};

export default ReplyForm;
