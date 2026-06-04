import { Redis } from "ioredis";

// Pub/Sub cần 2 connection riêng biệt
// vì subscriber connection bị block chờ message
export const publisher = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const subscriber = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
});
