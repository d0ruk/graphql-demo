export default {
  Query: {
    event: (parent, { id }, { models }) => models.Event.findById(id),
    events: (parent, { limit }, { models }) => models.Event.findAll({ limit })
  },

  Mutation: {
    createEvent: async (parent, { name }, { me, models }) => {
      const event = await models.Event.create({ name });
      event.addPeople(me.username);

      return event;
    },

    deleteEvent: (parent, { id }, { models }) => {
      return models.Event.destroy({ where: { id } });
    }
  },

  Event: {
    going: async ({ id }, args, { models }) => {
      const event = await models.Event.findById(id);
      return event.getPeople();
    }
  }
};
