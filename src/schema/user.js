import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    me: User
    user(username: String!): User
    users(limit: Int): [User!]
  }

  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): Token!
    signIn(username: String!, password: String!): Token!
  }

  type Token {
    token: String!
  }

  type User {
    username: ID!
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
