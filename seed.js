import "dotenv/config";
import faker from "faker";
import { range, sampleSize } from "lodash";

import db from "./src/db";
const ROWS = 100;
const ATTENDING = 5;

db.sync({ force: true })
  .then(() =>
    Promise.all([
      Promise.all(fakeUsers(ROWS)),
      Promise.all(fakeEvents(ROWS))
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

function fakeUsers(n) {
  return range(n).map(idx =>
    db.models.user.create({
      username: faker.lorem.word() + idx,
      email: faker.internet.email(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      picture: faker.image.imageUrl(),
      age: faker.random.number(),
      phone: faker.phone.phoneNumber(),
      bio: faker.lorem.paragraph()
    })
  );
}

function fakeEvents(n) {
  return range(n).map(() =>
    db.models.event.create({
      name: faker.lorem.word(),
      date: faker.date.future().toString(),
      country: faker.address.country(),
      city: faker.address.city(),
      description: faker.lorem.paragraph()
    })
  );
}
