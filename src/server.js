import { ApolloServer } from "apollo-server-express";

import typeDefs from "./schema";
import resolvers from "./resolvers";

export default (app, context) =>
  new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: process.env.NODE_ENV === "development",
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
  }).applyMiddleware({ app, path: "/gql" });
