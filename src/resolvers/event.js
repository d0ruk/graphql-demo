import uuidv4 from "uuid/v4";
import writeJsonFile from "write-json-file";

import { EVENTS_DB, USERS_DB } from "../models/";

export default {
  Query: {
    event: (parent, { id }, { models }) => {
      return models.events[id];
    },
    events: (parent, { limit = Infinity }, { models }) => {
      return Object.values(models.events).slice(0, limit);
    }
  },

  Mutation: {
    createEvent: async (parent, { name }, { me, models }) => {
      const _id = uuidv4();
      const event = {
        _id,
        name,
        going: [me._id]
      };

      models.events[_id] = event;
      await writeJsonFile(EVENTS_DB, models.events);

      let userEvents = models.users[me._id].events;
      if (Array.isArray(userEvents)) {
        userEvents.push(_id);
      } else {
        userEvents = [_id];
      }

      models.users[me._id].events = userEvents;
      await writeJsonFile(USERS_DB, models.users);
      return event;
    },

    deleteEvent: async (parent, { id: eventId }, { models }) => {
      const { [eventId]: event, ...rest } = models.events;
      if (!event) return false;

      if (Array.isArray(event.going)) {
        event.going.forEach(userId => {
          const userEvents = models.users[userId].events;
          if (Array.isArray(userEvents)) {
            models.users[userId].events = userEvents.filter(
              id => id !== eventId
            );
          }
        });

        await writeJsonFile(USERS_DB, models.users);
      }

      await writeJsonFile(EVENTS_DB, rest);
      return true;
    }
  },

  Event: {
    going: ({ going = [] }, args, { models }) => {
      return going.map(userId => models.users[userId]);
    }
  }
};
