import { Router } from "express";
import { analytics, toggleBan, users } from "../controllers/admin.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/analytics", analytics);
router.get("/users", users);
router.patch("/users/:id/toggle-ban", toggleBan);

export default router;
