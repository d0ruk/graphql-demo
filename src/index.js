import "dotenv/config";
import chalk from "chalk";
import express from "express";

const secret = process.env.APP_SECRET ? String(process.env.APP_SECRET) : "";
if (secret.length < 8) {
  throw new Error(
    chalk.red.bold("Invalid secret. Check process.env.APP_SECRET")
  );
}

import registerGqlServer from "./server.js";
import db from "./db";
import { getMe } from "./util.js";

const app = express();
db
  .sync({ force: Boolean(process.env.SYNC) })
  .then(async () => {
    const port = Number(process.env.PORT) || 8000;
    const context = async ({ req }) => {
      const me = await getMe(req);

      return {
        models: db.models,
        me,
        secret
      }
    };

    registerGqlServer(app, context);
    await app.listen({ port });

    console.log(  // eslint-disable-line
      chalk.green.bold("GraphiQL at http://localhost:%s/gql"),
      port
    );
  });
