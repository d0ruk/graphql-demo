import { AuthenticationError, UserInputError } from "apollo-server";
import { combineResolvers } from "graphql-resolvers";

import { createToken } from "../util.js";
import { isAdmin, isAuthenticated } from "./auth.js"

export default {
  Query: {
    me: (parent, args, { models, me }) => models.User.findById(me.username),
    user: (parent, { username }, { models }) => models.User.findById(username),
    users: (parent, { limit }, { models }) => models.User.findAll({ limit })
  },

  Mutation: {
    signUp: async (parent, args, { models, secret }) => {
      const { username, email, password } = args;
      const user = await models.User.create({
        username,
        email,
        password
      });

      return { token: createToken(user, secret) };
    },

    signIn: async (parent, args, { models, secret }) => {
      const { username, password } = args;

      const user = await models.User.findById(username);
      if (!user) throw new UserInputError("No user with this username");

      const isValid = await user.validatePassword(password);
      if (!isValid) throw new AuthenticationError("Invalid password");

      return { token: createToken(user, secret) };
    },

    deleteUser: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { username }, { models }) => {
        return await models.User.destroy({ where: { username } });
      }
    ),
  },

  User: {
    fullname: ({ firstname, lastname }) => {
      return firstname
        ? lastname
          ? firstname + " " + lastname
          : firstname + " Doe"
        : lastname
          ? "Mr(s). " + lastname
          : null;
    },
    events: async ({ username }, args, { models }) => {
      const user = await models.User.findById(username);
      return user.getEvents();
    }
  }
};
