import { Router } from "express";
import { applyCoupon, cartItemRules, clearCart, couponRules, getCart, updateItem } from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.use(protect);
router.get("/", getCart);
router.post("/items", cartItemRules, validate, updateItem);
router.post("/coupon", couponRules, validate, applyCoupon);
router.delete("/", clearCart);

export default router;
