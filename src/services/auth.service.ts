import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
} from "../repositories/auth.repository.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwt.js";

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);
  console.log("Creating user with:", { name, email, hashed }); // thêm dòng này
  const user = await createUser(name, email, hashed);

  return { id: user.id, name: user.name, email: user.email };
};

export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};
