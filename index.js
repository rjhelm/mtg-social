const { ApolloServer, PubSub } = require('apollo-server-express');
const mongoose = require('mongoose');

const typeDefs = require('./server/typeDefs');
const resolvers = require('./server/resolvers');
const { MONGODB } = require('./config.js');

const pubsub = new PubSub();

const port = process.env || 3000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

mongoose.connect(MONGODB, {useNewUrlParser: true }).then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: Port });
}).then((res) => {
    console.log(`Server running at ${res.url}`);
}).catch((err) => {
    console.error(err);
})