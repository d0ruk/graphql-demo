import { GraphQLDate, GraphQLDateTime } from "graphql-iso-date";

import userResolvers from "./user";
import eventResolvers from "./event";

export default [
  { Date: GraphQLDate, DateTime: GraphQLDateTime },
  userResolvers,
  eventResolvers,
];
