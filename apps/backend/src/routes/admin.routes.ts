import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { Role } from "@prisma/client";
import * as mandiController from "../controllers/mandi.controller.js";
import * as mandiSchema from "../schemas/mandi.schema.js";

const router: Router = Router();

// Protect all admin routes with authentication and Role.ADMIN
router.use(authenticate, requireRole(Role.ADMIN));

// List all Mandis pending verification
router.get("/mandi/pending", mandiController.adminListPendingMandisHandler);

// Approve, reject, or request documents for a Mandi
router.patch(
  "/mandi/:id/approval-status",
  validate(mandiSchema.adminApprovalSchema),
  mandiController.adminUpdateApprovalStatusHandler
);

export default router;
