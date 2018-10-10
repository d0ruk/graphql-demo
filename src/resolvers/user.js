export default {
  Query: {
    me: (parent, args, { models, me }) => models.User.findById(me.username),
    user: (parent, { username }, { models }) => models.User.findById(username),
    users: (parent, { limit }, { models }) => models.User.findAll({ limit }),
  },

  User: {
    fullname: ({ firstname, lastname }) => firstname + " " + lastname,
    events: async ({ username }, args, { models }) => {
      const user = await models.User.findById(username);
      return user.getEvents();
    }
  }
};
