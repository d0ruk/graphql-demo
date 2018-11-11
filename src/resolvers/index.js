import { GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import eventResolvers from "./event";

export default [
  { Date: GraphQLDateTime },
  userResolvers,
  eventResolvers
];
