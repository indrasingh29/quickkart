import { Router } from "express";
import {
  assignDelivery,
  createPayment,
  listOrders,
  placeOrder,
  placeOrderRules,
  statusRules,
  updateStatus,
  verifyPayment
} from "../controllers/order.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.use(protect);
router.get("/", listOrders);
router.post("/", placeOrderRules, validate, placeOrder);
router.post("/:id/payment", createPayment);
router.post("/payment/verify", verifyPayment);
router.patch("/:id/status", authorize("admin", "store_owner", "delivery_partner"), statusRules, validate, updateStatus);
router.post("/:id/assign", authorize("admin", "store_owner"), assignDelivery);

export default router;
