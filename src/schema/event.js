import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    event(id: ID!): Event
    events(cursor: DateTime, limit: Int): EventConnection!
  }

  extend type Mutation {
    createEvent(name: String!, date: Date!): Event!
    deleteEvent(id: ID!): Boolean!
  }

  type EventConnection {
    events: [Event!]!
    meta: Meta!
  }

  type Meta {
    hasNextPage: Boolean!
    endCursor: DateTime
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
