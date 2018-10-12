import { ForbiddenError } from "apollo-server";
import { skip } from "graphql-resolvers";

export const isAuthenticated = (_, args, { me }) =>
  me ? skip : new ForbiddenError("Not authenticated");

export const canDeleteEvent = async (_, { id }, { me, models }) => {
  // only if the user is going to that event can she delete it
  const event = await models.Event.findById(id);
  const going = (await event.getPeople()).map(u => u.username);

  return going.some(e => e === me.username)
  ? skip
  : new ForbiddenError("You can't delete this event");
}
