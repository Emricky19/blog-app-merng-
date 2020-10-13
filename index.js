const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGO_URI } = require("./config");
const resolvers = require('./graphql/resolvers')
const typeDefs = require("./graphql/typeDefs")

const pubsub = new PubSub() //for subscriptions

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("MongoDb connected...");
  })
  .catch((error) => {
    console.log("Failed to connect to Mongo");
  });

server.listen({ port: 8080 || process.env.PORT }).then((res) => {
  console.log(`Server running on port ${res.url}`);
});
