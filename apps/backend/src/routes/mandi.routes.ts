import { Router, Request, Response } from "express";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
import { Role } from "@prisma/client";

const router: Router = Router();

// Protect all Mandi routes with authenticate and requireRole(Role.MANDI_OPERATOR)
router.use(authenticate, requireRole(Role.MANDI_OPERATOR));

router.get("/dashboard", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Mandi Operator Dashboard",
    data: {
      userId: req.user!.userId,
      role: req.user!.role,
      modules: ["Daily Rate Updates", "Arrival Management", "Auction Records", "Farmer Inquiries"],
    },
  });
});

export default router;
