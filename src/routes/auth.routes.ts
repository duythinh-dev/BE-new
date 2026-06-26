import { Router } from "express";
import {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
  logoutAllDevicesController,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController); // Thêm route refresh token
router.post("/logout", logoutController); // Thêm route logout
router.post("/logout-all", logoutAllDevicesController); // Thêm route logout tất cả thiết bị

export default router;
