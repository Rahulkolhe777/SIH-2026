import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router: Router = Router();

// Dedicated Role Registration Endpoints
router.post("/farmer", authLimiter, (req, res, next) => userController.registerFarmer(req, res, next));
router.post("/mandi", authLimiter, (req, res, next) => userController.registerMandi(req, res, next));

export default router;
