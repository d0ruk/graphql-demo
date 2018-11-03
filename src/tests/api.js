import graphql from "graphql.js";

const graph = graphql("http://localhost:8000/gql", {
  asJSON: true,
  alwaysAutodeclare: true,
  fragments: {
    info: "on User {username, email, role}"
  }
});

export const getUser = graph.query(`
  user(username: $username) {
    ...info
  }
`);

export const getUsers = graph.query(`
  users(limit: $limit) {
    ...info
  }
`);

export const getMe = graph.query(`
  me {
    ...info
  }
`);

export const signUp = graph.mutate(`
  signUp(
    username: $username,
    email: $email,
    password: $password
  ) { token }
`);

export const signIn = graph.mutate(`
  signIn(username: $username, password: $password) { token }
`);

export const deleteUser = graph.mutate(`deleteUser(username: $username)`);
