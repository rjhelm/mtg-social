import { Switch, Route, Redirect } from 'react-router-dom';
import NavMenuDesktop from '../components/NavMenuDesktop';
import RightSidePanel from '../components/RightSidePanel';
import PostListPage from './PostListPage';
import AllTagsPage from './AllTagsPage';
import AllUsersPage from './AllUsersPage';
import PostPage from './PostPage';
import NewPost from './NewPost';
import UserPage from './UserPage';
import NotFoundPage from './NotFoundPage';
import { useAuthContext } from '../context/auth';

import { Container, Grid } from '@material-ui/core';

const Routes = () => {
  const { user } = useAuthContext();

  return (
    <Container disableGutters>
      <Grid container direction="row" wrap="nowrap" justify="space-between">
        <Switch>
          <Route exact path="/">
            <NavMenuDesktop />
            <PostListPage />
            <RightSidePanel />
          </Route>
          <Route exact path="/ask">
            {user ? (
              <>
                <NavMenuDesktop />
                <NewPost />
                <RightSidePanel />
              </>
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route exact path="/tags">
            <NavMenuDesktop />
            <AllTagsPage />
          </Route>
          <Route exact path="/users">
            <NavMenuDesktop />
            <AllUsersPage />
          </Route>
          <Route exact path="/user/:username">
            <NavMenuDesktop />
            <UserPage />
          </Route>
          <Route exact path="/posts/:postId">
            <NavMenuDesktop />
            <PostPage />
          </Route>
          <Route exact path="/tags/:tagName">
            <NavMenuDesktop />
            <PostListPage tagFilterActive={true} />
            <RightSidePanel />
          </Route>
          <Route exact path="/search/:query">
            <NavMenuDesktop />
            <PostListPage searchFilterActive={true} />
            <RightSidePanel />
          </Route>
          <Route>
            <NavMenuDesktop />
            <NotFoundPage />
            <RightSidePanel />
          </Route>
        </Switch>
      </Grid>
    </Container>
  );
};

export default Routes;
