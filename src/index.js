import "dotenv/config";
import chalk from "chalk";
import express from "express";

import registerGqlServer from "./server.js";
import db from "./db";
const app = express();

db
  .sync({ force: Boolean(process.env.SYNC) })
  .then(async () => {
    const port = Number(process.env.PORT) || 8000;
    const me = await db.models.User.findAll({ limit: 1 })[0];
    const context = async ({ req }) => ({
      models: db.models,
      me,
    });

    registerGqlServer(app, context);
    await app.listen({ port });

    console.log(  // eslint-disable-line
      chalk.green.bold("GraphiQL at http://localhost:%s/gql"),
      port
    );
  });
