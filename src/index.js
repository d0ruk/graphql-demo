import "dotenv/config";
import chalk from "chalk";
import express from "express";
import { ApolloServer } from "apollo-server-express";

import db from "./db";
import typeDefs from "./schema";
import resolvers from "./resolvers";

const app = express();

new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    models: db.models,
    me: (await db.models.user.findAll({ limit: 1 }))[0]
  }),
  formatError: error => {
    const message = error.message
      .replace("SequelizeValidationError: ", "")
      .replace('Validation error: ', "");

    return {
      ...error,
      message,
    };
  },
}).applyMiddleware({ app, path: "/gql" });

db
  .sync({ force: Boolean(process.env.SYNC) })
  .then(async () => {
    const port = Number(process.env.PORT) || 8000;
    await app.listen({ port });

    console.log(  // eslint-disable-line
      chalk.green.bold("GraphiQL at http://localhost:%s/gql"),
      port
    );
  });
