import { ForbiddenError } from "apollo-server";
import { combineResolvers } from "graphql-resolvers";

export const isAuthenticated = (_, args, { me }) =>
  me ? undefined : new ForbiddenError("Not authenticated");

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === "ADMIN"
      ? undefined
      : new ForbiddenError("You are not an admin")
);

export const canDeleteEvent = async (_, { id }, { me, models }) => {
  const owner = await getOwner(id, models.Event);

  return owner.username === me.username
    ? undefined
    : isAdmin(_, _, { me });
};

export const canDeleteUser = async (_, { username }, { me }) => {
  return username === me.username
    ? undefined
    : isAdmin(_, _, { me });
};

async function getOwner(eventId, Model) {
  const event = await Model.findByPk(eventId);
  const owner = await event?.getOwner();

  return owner || {};
}
