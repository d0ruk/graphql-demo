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

- `docker-compose up -d`
- edit .env
- `npm run seed`
- `npm start`

adminer is at localhost:8080

graphiql is at localhost:8000/gql

---

### query User

```js
query {
  me {
    username,
    events { name, date }
  }
  user(username: "someuser") {
    username,
    fullname,
    email,
    events { name, country }
  }
  users(limit: 10) { username }
}
```

### query Event

```js
query {
  event(id: 42) {
    id,
    name,
    going { username }
  }
  events(limit: 3) {
    name,
    going { username }
  }
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
  createEvent(name: "someevent") { # 1
    id,
    name,
    going { username }
  }
  deleteEvent(id: 101)  # 1
}
```

1. You need to set the appropriate *x-token* header for this mutation to work.
