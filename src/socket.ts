import { Server } from "socket.io";
import { createServer } from "http";
import { type Express } from "express";
import { CHANNELS, subscriber } from "./services/notification.service.js";

interface NotificationPayload {
  [key: string]: unknown;
}

type RedisChannel = (typeof CHANNELS)[keyof typeof CHANNELS];

export const setupSocket = (app: Express) => {
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // Lắng nghe Redis Pub/Sub → broadcast qua WebSocket
  subscriber.on("message", (channel: RedisChannel, message: string) => {
    const data: NotificationPayload = JSON.parse(message);

    switch (channel) {
      case CHANNELS.NEW_POST:
        io.emit("new_post", data);
        break;
      case CHANNELS.POST_UPDATED:
        io.emit("post_updated", data);
        break;
      case CHANNELS.POST_DELETED:
        io.emit("post_deleted", data);
        break;
    }
  });

  return httpServer;
};
