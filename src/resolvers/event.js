export default {
  Query: {
    event: (parent, { id }, { models }) => models.event.findById(id),
    events: (parent, { limit }, { models }) => models.event.findAll({ limit })
  },

  Mutation: {
    createEvent: async (parent, { name }, { me, models }) => {
      const event = await models.event.create({ name });
      event.addPeople(me.username);

      return event;
    },

    deleteEvent: (parent, { id }, { models }) => {
      return models.event.destroy({ where: { id } });
    }
  },

  Event: {
    going: async ({ id }, args, { models }) => {
      const event = await models.event.findById(id);
      return event.getPeople();
    }
  }
};
