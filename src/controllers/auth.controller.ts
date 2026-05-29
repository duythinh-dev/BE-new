import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { register, login } from "../services/auth.service.js";

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
