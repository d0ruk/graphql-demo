export default {
  Query: {
    me: (parent, args, { me }) => {
      return me;
    },
    user: (parent, { id }, { models }) => {
      return models.users[id];
    },
    users: (parent, { limit = Infinity }, { models }) => {
      return Object.values(models.users).slice(0, limit);
    }
  },

  User: {
    fullname: ({ firstname, lastname }) => firstname + " " + lastname,
    events: ({ events = [] }, args, { models }) => {
      return events.map(eventId => models.events[eventId]);
    }
  }
};
