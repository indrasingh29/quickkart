import { body } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as cartService from "../services/cart.service.js";

export const cartItemRules = [body("productId").isMongoId(), body("quantity").isInt({ min: 0 })];
export const couponRules = [body("code").trim().notEmpty()];

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  res.json({ success: true, cart, totals: cartService.calculateCartTotals(cart) });
});

export const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.upsertCartItem(req.user._id, req.body.productId, req.body.quantity);
  res.json({ success: true, cart, totals: cartService.calculateCartTotals(cart) });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  res.json({ success: true, cart, totals: cartService.calculateCartTotals(cart) });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const cart = await cartService.applyCoupon(req.user._id, req.body.code);
  res.json({ success: true, cart, totals: cartService.calculateCartTotals(cart) });
});
