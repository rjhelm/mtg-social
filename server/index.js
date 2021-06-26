const { ApolloServer, PubSub } = require('apollo-server-express');
const { PORT } = require('./utils/config');
const typeDefs = require('./server/typeDefs');
const resolvers = require('./resolvers');
const app = require('./app');
const http = require('http');
const connectToDB = require('./db');

connectToDB();

const server = http.createServer(app);

const pubsub = new PubSub();

const PORT = process.env || 3000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});