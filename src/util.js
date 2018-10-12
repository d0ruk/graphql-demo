import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server-express";

export const hashPassword = str => bcrypt.hash(str, 10);

export const createToken = async (user, secret, expiresIn = "30m") => {
  const { id, email, username, role } = user;

  return await jwt.sign({ id, email, username, role }, secret, { expiresIn });
};

export const comparePasswords = async (actual, supplied) =>
  await bcrypt.compare(supplied, actual);

export const getMe = req => {
  const token = req.headers["x-token"];

  if (token) {
    try {
      return jwt.verify(token, process.env.APP_SECRET);
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
};
