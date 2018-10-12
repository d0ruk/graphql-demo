import { ForbiddenError } from "apollo-server";
import { skip } from "graphql-resolvers";

export const isAuthenticated = (_, args, { me }) =>
  me ? skip : new ForbiddenError("Not authenticated");

export const canDeleteEvent = async (_, { id }, { me, models }) => {
  // only if the user is going to that event can she delete it
  // TODO: associate "me" with created event through "owner" flag
  const event = await models.Event.findById(id);
  const going = (await event.getPeople()).map(u => u.username);

  return going.some(e => e === me.username)
    ? skip
    : new ForbiddenError("You can't delete this event");
};

export const isAdmin = (parent, args, { me: { role } }) =>
  role === "ADMIN" ? skip : new ForbiddenError("You are not an admin");
