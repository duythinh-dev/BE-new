import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  createRefreshToken,
} from "../repositories/auth.repository.js";
import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} from "../config/jwt.js";
import dayjs from "dayjs";
import prisma from "../prisma.js";

export const generateRefreshToken = (userId: number) => {
  const refreshToken = jwt.sign(
    { userId, type: "refresh" },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN, // refresh token có thời hạn 1 ngày
    },
  );
  return refreshToken;
};

export const generateAccessToken = (userId: number, role: string) => {
  const accessToken = jwt.sign({ userId, type: "access", role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return accessToken;
};

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const existing = await findUserByEmail(email);
  if (existing) return { error: "Email already exists" };

  const hashed = await bcrypt.hash(password, 10);
  console.log("Creating user with:", { name, email, hashed }); // thêm dòng này
  const user = await createUser(name, email, hashed);

  return { id: user.id, name: user.name, email: user.email };
};

export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) return { error: "Invalid email or password" };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: "Invalid email or password" };

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await createRefreshToken(
    refreshToken,
    user.id,
    dayjs().add(1, "day").toDate(),
  );

  return {
    token: accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET!) as JwtPayload;

    if (payload.type !== "refresh") {
      return { error: "Invalid token type" };
    }
  } catch (err) {
    console.error("Refresh token verification failed:", err);
    return { error: "Refresh token expired" };
  }

  const foundToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
    include: {
      user: true,
    },
  });

  if (!foundToken) {
    return { error: "Unauthorized" };
  }

  const accessToken = generateAccessToken(
    foundToken.user.id,
    foundToken.user.role,
  );
  const newRefreshToken = generateRefreshToken(foundToken.user.id);

  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });

    await tx.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: foundToken.user.id,
        expiresAt: dayjs().add(1, "day").toDate(),
      },
    });
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (refreshToken: string) => {
  const deleted = await prisma.refreshToken.deleteMany({
    where: {
      token: refreshToken,
    },
  });

  if (deleted.count === 0) {
    return { error: "Refresh token not found" };
  }

  return {
    message: "Logged out successfully",
  };
};

export const logoutAllDevices = async (userId: number) => {
  const deleted = await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });

  if (deleted.count === 0) {
    return { error: "No refresh tokens found for this user" };
  }

  return {
    message: "Logged out from all devices successfully",
  };
};
