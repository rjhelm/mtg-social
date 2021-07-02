const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const db = require('./db');
const cors = require('cors')
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { PORT } = require('./utils/config');


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

