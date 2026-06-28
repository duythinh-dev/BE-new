import prisma from "../prisma.js";

const removePassword = (user: any) => {
  const { password, ...rest } = user;
  return rest;
};

export const findUserById = (userId: number) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
    },
  });
};
export const insertUser = async (name: string, email: string) => {
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
