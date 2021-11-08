const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { typeDefs, resolvers } = require('./Schemas');
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');
// const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // Creating a new server with ApolloServer
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    context: authMiddleware 
  });

  // Waiting for server to start
  await server.start();

  // Applying middleware
  server.applyMiddleware({ app });

  // Listening at this port for graphql
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
};

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
});