import prisma from "../prisma.js";

const removePassword = (user: any) => {
  const { password, ...rest } = user;
  return rest;
};

export const findUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return removePassword(user);
};

export const insertUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const user = await prisma.user.create({
    data: { name, email, password: "" },
  });
  return removePassword(user);
};

export const findAllUsers = async () => {
  return prisma.user
    .findMany()
    .then((users: any[]) => users.map(removePassword));
};
