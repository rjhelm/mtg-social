import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import storage from './utils/localStorage';
// import backendUrl from './backendUrl';

const httpLink = new HttpLink({
  uri: process.env.PORT,
});

const authLink = setContext(() => {
  const loggedUser = storage.loadUser();

  return {
    headers: {
      authorization: loggedUser ? loggedUser.token : null,
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Post: {
        fields: {
          upvotedBy: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          downvotedBy: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          comments: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          replies: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          tags: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
      Reply: {
        fields: {
          upvotedBy: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          downvotedBy: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          comments: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  link: authLink.concat(httpLink),
});

export default client;
