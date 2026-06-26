import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import {
  register,
  login,
  refreshAccessToken,
  logout,
  logoutAllDevices,
} from "../services/auth.service.js";

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = registerSchema.parse(req.body);
    const user = await register(body.name, body.email, body.password);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await login(body.email, body.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const result = await refreshAccessToken(refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const result = await logout(refreshToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const logoutAllDevicesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await logoutAllDevices(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
