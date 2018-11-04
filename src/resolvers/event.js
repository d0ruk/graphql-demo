import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated, canDeleteEvent } from "./auth";

export default {
  Query: {
    event: (parent, { id }, { models }) => models.Event.findByPk(id),
    events: (parent, { limit }, { models }) => models.Event.findAll({ limit }),
  },

  Mutation: {
    createEvent: combineResolvers(
      isAuthenticated,
      async (parent, { name }, { me, models }) => {
        const event = await models.Event.create({ name });
        await event.setOwner(me.username);

        return event;
      }
    ),

    deleteEvent: combineResolvers(
      isAuthenticated,
      canDeleteEvent,
      (parent, { id }, { models }) => models.Event.destroy({ where: { id } })
    ),
  },

  Event: {
    going: async ({ id }, args, { models }) => {
      const event = await models.Event.findByPk(id);
      return event.getPeople();
    },

    owner: async ({ id }, args, { models }) => {
      const event = await models.Event.findByPk(id);
      return event.getOwner();
    },
  },
};
