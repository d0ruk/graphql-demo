/* eslint-env mocha */
import { expect } from "chai";
import { omit } from "lodash";
import * as apiActions from "./api";

const adm1n = {
  username: "adm1n",
  password: "imgroot",
  email: "g@root.com",
  role: "ADMIN",
};

const marv1n = {
  username: "marv1n",
  email: "some@email.co",
  password: "urgroot",
};

describe("User queries", () => {
  describe("user(username: String!): User", () => {
    it("returns a user if found", async () => {
      const expectedResult = omit(adm1n, ["password"]);
      const { user } = await apiActions.getUser({ username: adm1n.username });

      expect(user).to.eql(expectedResult);
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
      const expectedResult = omit(adm1n, ["password"]);
      const signingIn = omit(adm1n, ["email", "role"]);

      const { signIn: { token } } = await apiActions.signIn(signingIn);

      const { me } = await apiActions.getMe(
        {},
        { headers: { "x-token": token } }
      );

      expect(me).to.eql(expectedResult);
    });
  });
});

describe("User mutations", () => {
  describe(
    "signUp(username: String!, email: String!, password: String!): Token!",
    () => {
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
        const { signUp: { token } } = await apiActions.signUp(marv1n);

        expect(token).to.exist;
      });
    },
  );

  describe("signIn(username: String!,  password: String!): Token!", () => {
    it("successfully signs a user in", async () => {
      const signingIn = omit(adm1n, ["email", "role"]);
      const { signIn: { token } } = await apiActions.signIn(signingIn);

      expect(token).to.exist;
    });
  });

  describe("deleteUser(username: String!): Boolean!", () => {
    let marvtoken;
    const signingIn = omit(marv1n, ["email", "role"]);

    it(
      "throws error if a non-admin user tries to delete another user",
      async () => {
        const { signIn: { token } } = await apiActions.signIn(signingIn);

        marvtoken = token;
        try {
          await apiActions.deleteUser(
            { username: adm1n.username },
            { headers: { "x-token": token } }
          );
        } catch (errors) {
          expect(errors[0].message).to.eql("You are not an admin");
        }
      }
    );

    it("user can delete self", async () => {
      await apiActions.deleteUser(
        { username: marv1n.username },
        { headers: { "x-token": marvtoken } }
      );
    });

    it("admin can delete any user", async () => {
      const signingIn = omit(adm1n, ["email", "role"]);
      const { signIn: { token }} = await apiActions.signIn(signingIn);

      const { users } = await apiActions.getUsers({ limit: 1 });

      await apiActions.deleteUser(
        { username: users[0].username },
        { headers: { "x-token": token } }
      );
    });
  });
});
