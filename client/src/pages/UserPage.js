import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries";
import RecentPosts from '../components/RecentPosts';
import LoadingSpinner from '../components/LoadingSpinner';
import { useStateContext } from "../context/state";
import { formatDateAgo, getErrorMsg } from "../utils/helpers";
import { Avatar, Typography, Divider } from "@material-ui/core";
import { useUserPageStyles } from "../styles/muiStyles";

function UserPage() {
  const classes = useUserPageStyles();
  const { notify } = useStateContext();
  const { username } = useParams();
  const [fetchedUser, setFetchedUser] = useState(null);
  const [fetchUser, { data, loading }] = useLazyQuery(GET_USER, {
    onError: (err) => {
      notify(getErrorMsg(err), "error");
    },
  });
  useEffect(() => {
    fetchUser({ variables: { username } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    if (data) {
      setFetchedUser(data.getUser);
    }
  }, [data]);

  if (loading || !fetchedUser) {
    return (
      <div style={{ minWidth: '100%', marginTop: '20%' }}>
        <LoadingSpinner size={80} />
      </div>
    );
  }

  const {
    id,
    username: userName,
    createdAt,
    reputation,
    totalPosts,
    totalReplies,
    recentPosts,
    recentReplies,
  } = fetchedUser;
  return (
    <div className={classes.root}>
      <div className={classes.userCard}>
        <Avatar
          src={`https://secure.gravatar.com/avatar/${id}?s=164&d=identicon`}
          alt={username}
          className={classes.avatar}
          component={RouterLink}
          to={`/user/${username}`}
        />
        <Typography variant="h5" color="secondary" className={classes.cardText}>
          {reputation} <Typography variant="caption">COMMANDER REPUTATION</Typography>
        </Typography>
      </div>
      <div className={classes.infoCard}>
        <div className={classes.userInfo}>
          <div>
            <Typography
              variant="h4"
              color="primary"
              className={classes.bigText}
            >
              {userName}
            </Typography>
            <Typography
              variant="body1"
              color="secondary"
              className={classes.smallText}
            >
              Commander Since {formatDateAgo(createdAt)}
            </Typography>
          </div>
          <div className={classes.statsBar}>
            <div style={{ marginRight: 10 }}>
              <Typography
                variant="h4"
                color="primary"
                className={classes.bigText}
              >
                {totalReplies}
              </Typography>
              <Typography
                variant="body1"
                color="secondary"
                className={classes.smallText}
              >
                Replies
              </Typography>
            </div>
            <div>
              <Typography
                variant="h4"
                color="primary"
                className={classes.bigText}
              >
                {totalPosts}
              </Typography>
              <Typography
                variant="body1"
                color="secondary"
                className={classes.smallText}
              >
                Posts
              </Typography>
            </div>
          </div>
        </div>
        <Divider />
        <div className={classes.recentActivity}>
          <div style={{ marginBottom: '1em' }}>
            <Typography variant="h6" color="primary">
              Your Most Recent Post
            </Typography>
            <Divider />
            {recentPosts.length !== 0 ? (
              recentPosts.map((q) => (
                <div key={q.id}>
                  <RecentPosts post={q} />
                  <Divider />
                </div>
              ))
            ) : (
              <Typography variant="subtitle1">
                No posts asked yet.
              </Typography>
            )}
          </div>
          <div>
            <Typography variant="h6" color="primary">
              Last Post You Replied
            </Typography>
            <Divider />
            {recentReplies.length !== 0 ? (
              recentReplies.map((q) => (
                <div key={q.id}>
                  {/* <RecentPosts post={q} /> */}
                  <Divider />
                </div>
              ))
            ) : (
              <Typography variant="subtitle1">
                No Posts Replied To
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;

