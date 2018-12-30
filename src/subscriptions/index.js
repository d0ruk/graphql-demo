import { PubSub } from "apollo-server";

import * as EVENT from "./event";

export const SUBSCRIPTIONS = {
  EVENT,
};

export default new PubSub();
