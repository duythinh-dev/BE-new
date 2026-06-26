import prisma from "../prisma.js";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      createdAt: true,
      role: true,
    },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  return prisma.user.create({
    data: { name, email, password },
  });
};

export const createRefreshToken = (
  token: string,
  userId: number,
  expiresAt: Date,
) => {
  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};
