import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_POSTS } from '../graphql/queries';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useStateContext } from '../context/state';
import { useAuthContext } from '../context/auth';
import SortPostBar from '../components/SortPostBar';
import PostCard from '../components/PostCard';
import AuthFormModal from '../components/AuthFormModal';
import LoadMoreButton from '../components/LoadMoreButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { filterDuplicates, getErrorMsg } from '../utils/helpers';

import { Typography, Button, Divider, useMediaQuery } from '@material-ui/core';
import { usePostListStyles } from '../styles/muiStyles';
import { useTheme } from '@material-ui/core/styles';

const PostListPage = ({ tagFilterActive, searchFilterActive }) => {
  const { tagName, query } = useParams();
  const { clearEdit, notify } = useStateContext();
  const { user } = useAuthContext();
  const [postData, setPostData] = useState(null);
  const [sortBy, setSortBy] = useState('HOT');
  const [page, setPage] = useState(1);
  const classes = usePostListStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const [fetchPosts, { data, loading }] = useLazyQuery(GET_POSTS, {
    fetchPolicy: 'network-only',
    onError: (err) => {
      notify(getErrorMsg(err), 'error');
    },
  });

  const getPost = (sortBy, page, limit, filterByTag, filterBySearch) => {
    fetchPosts({
      variables: { sortBy, page, limit, filterByTag, filterBySearch },
    });
  };

  useEffect(() => {
    getPost(sortBy, 1, 12, tagName, query);
    setPage(1);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, tagName, query]);

  useEffect(() => {
    if (data && page === 1) {
      setPostData(data.getPosts);
    }

    if (data && page !== 1) {
      setPostData((prevState) => ({
        ...data.getPosts,
        posts: prevState.posts.concat(
          filterDuplicates(prevState.posts, data.getPosts.posts)
        ),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleLoadPosts = () => {
    getPost(sortBy, page + 1, 12, tagName, query);
    setPage(page + 1);
  };

  return (
    <div className={classes.root}>
      <div className={classes.topBar}>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          color="secondary"
          style={{ wordWrap: 'anywhere' }}
        >
          {tagFilterActive
            ? `Posts tagged [${tagName}]`
            : searchFilterActive
            ? `Search results for "${query}"`
            : 'All Posts'}
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
      <SortPostBar isMobile={isMobile} sortBy={sortBy} setSortBy={setSortBy} />
      <Divider />
      {loading && page === 1 && (
        <div style={{ minWidth: '100%', marginTop: '1em' }}>
          <LoadingSpinner size={60} />
        </div>
      )}
      {postData &&
        (postData.posts.length !== 0 ? (
          postData.posts.map((q) => <PostCard key={q.id} post={q} />)
        ) : (
          <Typography
            color="secondary"
            variant="h6"
            className={classes.noPostText}
          >
            {tagFilterActive
              ? `There are no posts tagged "${tagName}".`
              : searchFilterActive
              ? `No matches found for your search "${query}".`
              : 'No posts found.'}
          </Typography>
        ))}
      {postData && postData.next && (
        <LoadMoreButton
          loading={page !== 1 && loading}
          handleLoadPosts={handleLoadPosts}
        />
      )}
    </div>
  );
};

export default PostListPage;
