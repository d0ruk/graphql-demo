```json
"dependencies": {
  "apollo-server": "^2.0.5",
  "apollo-server-express": "^2.0.4",
  "bcrypt": "^3.0.1",
  "express": "^4.16.3",
  "graphql": "^14.0.0",
  "jsonwebtoken": "^8.3.0",
  "pg": "^7.4.3",
  "sequelize": "^4.39.0"
}
```

## usage

- edit .env
- `docker-compose up -d`
- `npm run seed`
- `npm start`

adminer is at localhost:8080

graphiql is at localhost:8000/gql

---

### query User

```js
fragment info on User {
  username,
  fullname,
  events {
    name,
    country,
    date
  }
}

query {
  user(username: "someuser") {
    ...info
    events {
      owner { ...info }
    }
  }
  users(limit: 10) { username }
  me { ...info }
}
```

### query Event

```js
fragment userInfo on User {
  username,
  fullname,
  email,
}

fragment eventInfo on Event {
  id,
  name,
  date,
  createdAt,
  going { ...userInfo }
  owner { ...userInfo }
}

query {
  event(id: 42) { ...eventInfo }
  events(cursor:"2018-12-04", limit: 3) { id, createdAt }
}
```

### mutate User

```
mutation {
  signUp(
    username: "test",
    email: "asd@asd.xyz",
    password: "somepass"
  ) { token }
  signIn(username: "adm1n", password:"imgroot") { token }
  deleteUser(username: "someuser") # 1
}
```

### mutate Event

```
mutation {
  createEvent(name: "bigcrowd",  date: "2017-01-20") { # 1
    id,
    name,
    date,
    owner { username }
  }
  deleteEvent(id: 101) # 1
}
```

1. You need to set the appropriate *x-token* header for this mutation to work.
