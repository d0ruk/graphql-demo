import Sequelize from "sequelize";
import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated, canDeleteEvent } from "./auth";

export default {
  Query: {
    event: (parent, { id }, { models }) => models.Event.findByPk(id),
    events: (parent, { cursor = new Date(), limit = 100 }, { models }) => {
      return models.Event.findAll({
        order: [["createdAt", "DESC"]],
        limit,
        where: {
          createdAt: {
            [Sequelize.Op.lt]: cursor,
          },
        },
      });
    },
  },

  Mutation: {
    createEvent: combineResolvers(
      isAuthenticated,
      async (parent, { name, date }, { me, models }) => {
        const event = await models.Event.create({
          name,
          date,
        });

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
