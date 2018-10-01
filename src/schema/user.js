import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users(limit: Int): [User!]
  }

  type User {
    _id: ID!
    email: String!
    picture: String
    age: Int
    firstname: String
    lastname: String
    fullname: String
    phone: String
    bio: String
    events: [Event!]
  }
`;
