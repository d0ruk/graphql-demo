import { ApolloServer } from "apollo-server-express";

import typeDefs from "./schema";
import resolvers from "./resolvers";

const isProd = process.env.NODE_ENV === "production";
const PLAYGROUND_CONFIG = {
  settings: {
    "general.betaUpdates": !isProd,
    "editor.cursorShape": "underline",
    "editor.fontSize": 15,
    "editor.reuseHeaders": true,
    "editor.fontFamily": "monospace",
    "editor.theme": isProd ? "light" : "dark",
  },
};

export default (httpServer, app, context) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: process.env.NO_PLAY ? false : true,
    playground: process.env.NO_PLAY ? false : PLAYGROUND_CONFIG,
    formatError: error => {
      const message = error.message
        .replace("SequelizeValidationError: ", "")
        .replace("Validation error: ", "")
        .replace("Context creation failed: ", "");

      return {
        ...error,
        message,
      };
    },
  });

  server.installSubscriptionHandlers(httpServer);
  server.applyMiddleware({ app, path: "/gql" });
};
