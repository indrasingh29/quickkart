import { Router } from "express";
import { assignedOrders, locationRules, updateLocation } from "../controllers/delivery.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.use(protect, authorize("delivery_partner"));
router.get("/orders", assignedOrders);
router.post("/location", locationRules, validate, updateLocation);

export default router;
