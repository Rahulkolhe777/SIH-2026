import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { loginLimiter, otpLimiter, authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router: Router = Router();

// Public Authentication Endpoints
router.post("/register", authLimiter, (req, res, next) => authController.register(req, res, next));
router.post("/login", loginLimiter, (req, res, next) => authController.login(req, res, next));
router.post("/refresh", (req, res, next) => authController.refresh(req, res, next));
router.post("/logout", (req, res, next) => authController.logout(req, res, next));

// OTP & Verification Endpoints
router.post("/send-otp", otpLimiter, (req, res, next) => authController.sendOtp(req, res, next));
router.post("/verify-otp", (req, res, next) => authController.verifyOtp(req, res, next));

// Password Recovery Endpoints
router.post("/forgot-password", otpLimiter, (req, res, next) => authController.forgotPassword(req, res, next));
router.post("/reset-password", (req, res, next) => authController.resetPassword(req, res, next));

// Protected User Session Endpoint
router.get("/me", authenticate, (req, res, next) => authController.getMe(req, res, next));

export default router;
