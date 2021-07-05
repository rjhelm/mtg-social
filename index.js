const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const db = require("./db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { PORT } = require("./utils/config");
const path = require("path");

const app = express();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req })
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "./client/build/")));
}

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './client/build/index.html'));
  });

db.once("open", () => {
	app.listen(PORT, () => {
		console.log(`API server running on port ${PORT}!`);
		console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
	});
});

