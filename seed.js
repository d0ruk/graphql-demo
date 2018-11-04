import "dotenv/config";
import faker from "faker";
import { range, sampleSize } from "lodash";
import chalk from "chalk";

import db from "./src/db";
const ROWS = 100;
const ATTENDING = 5;

const admin = {
  username: "adm1n",
  password: "imgroot",
  email: "g@root.com",
  role: "ADMIN",
};

db.sync({ force: true })
  .then(() =>
    Promise.all([
      Promise.all(createUsers(ROWS)),
      Promise.all(createEvents(ROWS)),
    ])
  )
  .then(([users, events]) =>
    Promise.all(
      Array.from(users, user => user.addEvents(sampleSize(events, ATTENDING)))
    )
  )
  .then(() => db.models.User.create(admin))
  .then(() => {
    console.log(
      chalk.green.bold("Successfully seeded database " + process.env.DB_NAME)
    );

    return db.close();
  })
  .catch(err => {
    console.error(chalk.red.bold(err));
    process.exit(42);
  });

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
      role: "MUNCHKIN",
    })
  );
}

function createEvents(n) {
  return range(n).map(() =>
    db.models.Event.create({
      name: faker.lorem.word(),
      date: faker.date.future().toString(),
      country: faker.address.countryCode(),
      city: faker.address.city(),
      description: faker.lorem.paragraph(),
    })
  );
}
