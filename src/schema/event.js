import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    events(limit: Int): [Event!]!
    event(id: ID!): Event!
  }

  extend type Mutation {
    createEvent(name: String!): Event!
    deleteEvent(id: ID!): Boolean!
  }

  type Event {
    _id: ID!
    name: String!
    date: String
    country: String
    city: String
    description: String
    going: [User!]
  }
`;
