import { type Request, type Response, type NextFunction } from "express";
import redis from "../redis.js";

interface RateLimitOptions {
  windowMs: number; // thời gian window tính bằng giây
  max: number; // số request tối đa
  message?: string;
}

export const rateLimitMiddleware = (options: RateLimitOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `rate_limit:${ip}:${req.path}`;

    try {
      const current = await redis.incr(key);

      // Lần đầu tiên — set TTL cho key
      if (current === 1) {
        await redis.expire(key, options.windowMs);
      }

      // Thêm header để client biết còn bao nhiêu request nữa trước khi bị block
      res.setHeader("X-RateLimit-Limit", options.max);
      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(0, options.max - current),
      );

      if (current > options.max) {
        return res.status(429).json({
          message:
            options.message || "Too many requests, please try again later.",
        });
      }

      next();
    } catch (err) {
      // Nếu Redis lỗi thì cho qua — không block user
      next();
    }
  };
};
