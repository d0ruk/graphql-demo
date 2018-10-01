import express from "express";
import { ApolloServer } from "apollo-server-express";

import typeDefs from "./schema";
import resolvers from "./resolvers";
import models from "./models";

const app = express();
const context = {
  me: models.users[Object.keys(models.users)[0]],
  models,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
}).applyMiddleware({ app, path: "/graphql" });

app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
