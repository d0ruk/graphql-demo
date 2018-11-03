import graphql from "graphql.js";

const graph = graphql("http://localhost:8000/gql", {
  asJSON: true,
  alwaysAutodeclare: true
});

export const getUser = graph.query(`
  user(username: $username) {
    email,
    role
  }
`);

export const getUsers = graph.query(`
  users(limit: $limit) {
    email,
    role
  }
`);

export const getMe = graph.query(`
  me {
    email,
    role
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
