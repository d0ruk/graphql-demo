export default {
  Query: {
    me: (parent, args, { models, me }) => models.user.findById(me.username),
    user: (parent, { username }, { models }) => models.user.findById(username),
    users: (parent, { limit }, { models }) => models.user.findAll({ limit }),
  },

  User: {
    fullname: ({ firstname, lastname }) => firstname + " " + lastname,
    events: async ({ username }, args, { models }) => {
      const user = await models.user.findById(username);
      return user.getEvents();
    }
  }
};
