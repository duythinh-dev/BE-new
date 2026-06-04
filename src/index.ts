import express from "express";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import redis from "./redis.js";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware.js";

// Thêm dòng này sau khi import
redis.ping().then((result) => console.log("Redis ping:", result));
const app = express();

app.use(
  rateLimitMiddleware({
    windowMs: 60, // 60 giây
    max: 100, // tối đa 100 request mỗi window
  }),
);

app.use(
  "/auth",
  rateLimitMiddleware({
    windowMs: 60, // 60 giây
    max: 5, // tối đa 20 request mỗi window cho các route auth,
    message: "Too many login attempts, please try again later.", // message riêng cho auth
  }),
);

app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:postId/comments", commentRoutes);

app.use(errorHandler); // phải để cuối cùng

app.listen(3000, () => console.log("Server running on port 3000"));
