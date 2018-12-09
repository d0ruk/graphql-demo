import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    event(id: ID!): Event
    events(cursor: Date, limit: Int): [Event!]
  }

  extend type Mutation {
    createEvent(name: String!): Event!
    deleteEvent(id: ID!): Boolean!
  }

  type Event {
    id: ID!
    name: String!
    date: Date!
    country: String
    city: String
    description: String
    going: [User!]
    owner: User!
    createdAt: DateTime!
  }
`;
