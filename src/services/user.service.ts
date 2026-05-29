import {
  findUserById,
  insertUser,
  findAllUsers,
} from "../repositories/user.repository.js";

export const getUserById = async (id: number) => {
  return findUserById(id);
};

export const getAllUsers = async () => {
  return findAllUsers();
};

export const createNewUser = async (name: string, email: string) => {
  return insertUser(name, email);
};
