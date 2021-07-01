import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { NEW_POST, EDIT_POST } from '../graphql/mutations';
import { useStateContext } from '../context/state';
import ErrorMessage from '../components/ErrorMessage';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getErrorMsg } from '../utils/helperFuncs';

import {
  Typography,
  TextField,
  Button,
  InputAdornment,
  Chip,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useNewPostStyles } from '../styles/muiStyles';

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Required')
    .min(15, 'Must be at least 15 characters'),
  body: yup
    .string()
    .required('Required')
    .min(30, 'Must be at least 30 characters'),
});

const NewPostPage = () => {
  const classes = useNewPostStyles();
  const history = useHistory();
  const { editValues, clearEdit, notify } = useStateContext();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(editValues ? editValues.tags : []);
  const [errorMsg, setErrorMsg] = useState(null);
  const { register, handleSubmit, reset, errors } = useForm({
    defaultValues: {
      title: editValues ? editValues.title : '',
      body: editValues ? editValues.body : '',
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const [addPost, { loading: addPostLoading }] = useMutation(
    NEW_POST,
    {
      onError: (err) => {
        setErrorMsg(getErrorMsg(err));
      },
    }
  );

  const [updatePost, { loading: editPostLoading }] = useMutation(
    EDIT_POST,
    {
      onError: (err) => {
        setErrorMsg(getErrorMsg(err));
      },
    }
  );

  const newPost = ({ title, body }) => {
    if (tags.length === 0) return setErrorMsg('Atleast one tag must be added.');

    addPost({
      variables: { title, body, tags },
      update: (_, { data }) => {
        history.push(`/posts/${data.newPost.id}`);
        reset();
        notify('Post added!');
      },
    });
  };

  const editPost = ({ title, body }) => {
    if (tags.length === 0) return setErrorMsg('Atleast one tag must be added.');

    updatePost({
      variables: { postId: editValues.postId, title, body, tags },
      update: (_, { data }) => {
        history.push(`/posts/${data.editPost.id}`);
        clearEdit();
        notify('Post edited!');
      },
    });
  };

  const handleTags = (e) => {
    if (!e || (!e.target.value && e.target.value !== '')) return;
    const value = e.target.value.toLowerCase().trim();
    setTagInput(value);

    const keyCode = e.target.value
      .charAt(e.target.selectionStart - 1)
      .charCodeAt();

    if (keyCode === 32 && value.trim() !== '') {
      if (tags.includes(value))
        return setErrorMsg(
          "Duplicate tag found! You can't add the same tag twice."
        );

      if (!/^[a-zA-Z0-9-]*$/.test(value)) {
        return setErrorMsg('Only alphanumeric characters & dash are allowed.');
      }

      if (tags.length >= 5) {
        setTagInput('');
        return setErrorMsg('Max 5 tags can be added! Not more than that.');
      }

      if (value.length > 15) {
        return setErrorMsg("A single tag can't have more than 15 characters.");
      }

      setTags((prevTags) => [...prevTags, value]);
      setTagInput('');
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" color="secondary">
        {editValues ? 'Edit Your Post' : 'Command Post'}
      </Typography>
      <form
        className={classes.postForm}
        onSubmit={
          editValues ? handleSubmit(editPost) : handleSubmit(newPost)
        }
      >
        <div className={classes.inputWrapper}>
          <Typography variant="caption" color="secondary">
            Looking for a game, Deck discussions, card discussions, post it!
          </Typography>
          <TextField
            required
            fullWidth
            inputRef={register}
            name="title"
            placeholder="Enter atleast 15 characters"
            type="text"
            label="Title"
            variant="outlined"
            size="small"
            error={'title' in errors}
            helperText={'title' in errors ? errors.title.message : ''}
            className={classes.inputField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <div></div>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.inputWrapper}>
          <Typography variant="caption" color="secondary">
            Include whether you are looking for a game, deck advice, card discussion, etc.
            Include power you want to play, local, online, deck details, card info.
          </Typography>
          <TextField
            required
            multiline
            rows={5}
            fullWidth
            inputRef={register}
            name="body"
            placeholder="Enter atleast 30 characters"
            type="text"
            label="Body"
            variant="outlined"
            size="small"
            error={'body' in errors}
            helperText={'body' in errors ? errors.body.message : ''}
            className={classes.inputField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <div></div>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.inputWrapper}>
          <Typography variant="caption" color="secondary">
            Add Tags To Inform Other Commanders The Nature Of Your Post
            (Power Level, Spelltable, Local, Deck Advice, Etc.)
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            getOptionLabel={(option) => option}
            value={tags}
            inputValue={tagInput}
            onInputChange={handleTags}
            onChange={(e, value, reason) => {
              setTags(value);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Enter space button to add tags"
                onKeyDown={handleTags}
                fullWidth
                className={classes.inputField}
                size="small"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  color="primary"
                  size="small"
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </div>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          size="large"
          className={classes.submitBtn}
          disabled={addPostLoading || editPostLoading}
        >
          {editValues ? 'Update Your Post' : 'Post Your Post'}
        </Button>
        <ErrorMessage
          errorMsg={errorMsg}
          clearErrorMsg={() => setErrorMsg(null)}
        />
      </form>
    </div>
  );
};

export default NewPostPage;
