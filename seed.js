/* eslint no-console: 0 */
import "dotenv/config";
import faker from "faker";
import { range, sampleSize, random } from "lodash";
import chalk from "chalk";
import meow from "meow";

import db from "./src/db";
const ATTENDING = 5;

const admin = {
  username: "adm1n",
  password: "imgroot",
  email: "g@root.com",
  role: "ADMIN",
};

const cli = meow(
  `
	Options
	  --rows, -r

	Examples
	  $ seed -r 5
`,
  {
    flags: {
      rows: {
        type: "number",
        alias: "r",
      },
    },
    description: false,
  }
);

run(db, cli.flags)
  .then(() => {
    console.log(
      chalk.green.bold("Successfully seeded database " + process.env.DB_NAME)
    );
  })
  .catch(err => {
    console.error(chalk.red.bold(err));
    process.exit(42);
  });

function run(db, { rows = 100 }) {
  return db
    .sync({ force: true })
    .then(() =>
      Promise.all([
        Promise.all(createUsers(rows)),
        Promise.all(createEvents(rows)),
      ])
    )
    .then(([users, events]) => {
      const userEvents = Array.from(users, user =>
        user.addEvents(sampleSize(events, ATTENDING))
      );

      const eventOwner = Array.from(events, event => {
        const [owner] = sampleSize(users, 1);
        return event.setOwner(owner.username);
      });

      return Promise.all([...eventOwner, ...userEvents]);
    })
    .then(() => db.models.User.create(admin))
    .then(() => db.close());

  function createUsers(n) {
    return range(n).map(idx =>
      db.models.User.create({
        username: faker.lorem.word() + idx,
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        picture: faker.image.imageUrl(),
        age: faker.random.number(),
        phone: faker.phone.phoneNumber(),
        bio: faker.lorem.paragraph(),
      })
    );
  }

  function createEvents(n) {
    return range(n).map(() =>
      db.models.Event.create({
        name: faker.lorem.word(),
        date: faker.date
          .future()
          .toISOString()
          .substring(0, 10),
        country: faker.address.countryCode(),
        city: faker.address.city(),
        description: faker.lorem.paragraph(),
        createdAt: dateInPastWeek(),
      })
    );
  }
}

function dateInPastWeek() {
  const d = new Date();
  d.setDate(d.getDate() - random(6));

  return d;
}
