/* eslint-env mocha */
import { expect } from "chai";

import * as apiActions from "./api";

describe("User queries", () => {
  describe("user(username: String!): User", () => {
    it("returns a user if found", async () => {
      const expectedResult = {
        user: {
          email: "g@root.com",
          role: "ADMIN",
        },
      };

      const result = await apiActions.getUser({ username: "adm1n" });
      expect(result).to.eql(expectedResult);
    });

    it("returns null when user cannot be found", async () => {
      const expectedResult = { user: null };
      const result = await apiActions.getUser({ username: "notfound" });

      expect(result).to.eql(expectedResult);
    });
  });

  describe("users(limit: Int): [!User]", () => {
    it("returns 5 users", async () => {
      const { users } = await apiActions.getUsers({ limit: 5 });

      expect(users.length).to.eql(5);
    });
  });

  describe("me: User", () => {
    it("returns null if no token is provided", async () => {
      const { me } = await apiActions.getMe();
      expect(me).to.eql(null);
    });

    it("returns the logged in user if a token is provided", async () => {
      const {
        signIn: { token },
      } = await apiActions.signIn({
        username: "adm1n",
        password: "imgroot",
      });

      const expectedResult = {
        email: "g@root.com",
        role: "ADMIN",
      };

      const { me } = await apiActions.getMe(
        {},
        {
          headers: { "x-token": token },
        }
      );

      expect(me).to.eql(expectedResult);
    });
  });
});

describe("User mutations", () => {
  describe("deleteUser(username: String!): Boolean!", () => {
    it("throws error if a non-admin user tries to delete another user", async () => {
      const {
        signIn: { token },
      } = await apiActions.signIn({
        username: "marv1n",
        password: "urgroot",
      });

      try {
        await apiActions.deleteUser(
          { username: "adm1n" },
          { headers: { "x-token": token } }
        );
      } catch (errors) {
        expect(errors[0].message).to.eql("You are not an admin");
      }
    });

    // TODO user can delete self
  });

  describe("signUp(username: String!, email: String!, password: String!): Token!", () => {
    it("expects a unique username", async () => {
      try {
        await apiActions.signUp({
          username: "adm1n",
          email: "some@email.co",
          password: "drowssap",
        });
      } catch (errors) {
        expect(errors[0].message).to.eql("User name already exists");
      }
    });

    it("successfully signs a user up", async () => {
      const { token } = await apiActions.signUp({
        username: "user" + (new Date()).getMilliseconds(),
        email: "some@email.co",
        password: "drowssap",
      });

      expect(token).to.exist();
    });
  });

  describe("signIn(username: String!,  password: String!): Token!", () => {
    it("successfully signs a user in", async () => {
      const {
        signIn: { token },
      } = await apiActions.signIn({
        username: "adm1n",
        password: "imgroot",
      });

      expect(token).to.exist();
    });
  });
});
