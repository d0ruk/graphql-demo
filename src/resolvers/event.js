import Sequelize from "sequelize";
import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated, canDeleteEvent } from "./auth";

export default {
  Query: {
    event: (parent, { id }, { models }) => models.Event.findByPk(id),
    events: async (
      parent,
      { cursor = new Date(), limit = 100 },
      { models }
    ) => {
      const Events = await models.Event.findAll({
        order: [["createdAt", "DESC"]],
        limit: limit + 1,
        where: {
          createdAt: {
            [Sequelize.Op.lt]: cursor,
          },
        },
      });

      // we list limit + 1 documents and thus know if there is a next page
      const hasNextPage = Events.length > limit;
      const events = hasNextPage ? Events.slice(0, -1) : Events;

      return {
        events,
        meta: {
          hasNextPage,
          endCursor: events[events.length - 1]?.createdAt,
        },
      };
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
