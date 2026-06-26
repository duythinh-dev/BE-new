import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import prisma from "../prisma.js";
import type { Role } from "@prisma/client";

export interface TokenPayload {
  userId: number;
  role: Role;
  type: "access";
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    if (decoded.type !== "access") {
      return res.status(401).json({ message: "Invalid token type" });
    }

    // Check userId có thật trong DB không
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
      },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize =
  (...roles: ("USER" | "ADMIN")[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
