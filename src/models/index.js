import path from "path";

import USERS from "./users.json";
import EVENTS from "./events.json";

export const EVENTS_DB = path.join(__dirname, "events.json");
export const USERS_DB = path.join(__dirname, "users.json");

export default {
  users: USERS,
  events: EVENTS,
};
