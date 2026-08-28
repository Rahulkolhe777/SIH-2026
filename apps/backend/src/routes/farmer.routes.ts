import { Router, Request, Response } from "express";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
import { Role } from "@prisma/client";

const router: Router = Router();

// Protect all farmer routes with authenticate and requireRole(Role.FARMER)
router.use(authenticate, requireRole(Role.FARMER));

router.get("/dashboard", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Farmer Dashboard",
    data: {
      userId: req.user!.userId,
      role: req.user!.role,
      modules: ["Crop Management", "Marketplace Prices", "Weather Forecasts", "Direct Bidding"],
    },
  });
});

export default router;
