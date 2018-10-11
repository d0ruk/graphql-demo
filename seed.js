import "dotenv/config";
import faker from "faker";
import { range, sampleSize } from "lodash";

import db from "./src/db";
const ROWS = 100;
const ATTENDING = 5;

db.sync({ force: true })
  .then(() =>
    Promise.all([
      Promise.all(createUsers(ROWS)),
      Promise.all(createEvents(ROWS))
    ])
  )
  .then(([users, events]) =>
    Promise.all(
      Array.from(
        users,
        user => user.addEvents(sampleSize(events, ATTENDING))
    ))
  )
  .then(() => db.close())
  .catch(console.error);

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
      bio: faker.lorem.paragraph()
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
      description: faker.lorem.paragraph()
    })
  );
}
