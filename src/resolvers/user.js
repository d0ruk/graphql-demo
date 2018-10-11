import { AuthenticationError, UserInputError } from "apollo-server";

import { createToken } from "../util";

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
    }
  },

  User: {
    fullname: ({ firstname, lastname }) => firstname + " " + lastname,
    events: async ({ username }, args, { models }) => {
      const user = await models.User.findById(username);
      return user.getEvents();
    }
  }
};
