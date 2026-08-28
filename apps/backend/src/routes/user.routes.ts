import { Router } from "express";
import { registerFarmer, registerMandi } from "../controllers/user.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";

const router: Router = Router();

// Dedicated Role Registration Endpoints
router.post("/farmer", authLimiter, registerFarmer);
router.post("/mandi", authLimiter, registerMandi);

export default router;
