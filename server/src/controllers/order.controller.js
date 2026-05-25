import { body, param } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as orderService from "../services/order.service.js";

export const placeOrderRules = [
  body("addressId").optional().isMongoId(),
  body("paymentMethod").optional().isIn(["cod", "razorpay"])
];
export const statusRules = [param("id").isMongoId(), body("status").isIn(["accepted", "packed", "picked_up", "delivered", "cancelled", "rejected"])];

export const placeOrder = asyncHandler(async (req, res) => {
  const order = await orderService.placeOrder(req.user, req.body);
  const io = req.app.get("io");
  io?.to(`user:${req.user._id}`).emit("order:update", order);
  io?.emit("admin:order", order);
  res.status(201).json({ success: true, order });
});

export const listOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrdersForUser(req.user);
  res.json({ success: true, orders });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status, req.app.get("io"));
  res.json({ success: true, order });
});

export const assignDelivery = asyncHandler(async (req, res) => {
  const order = await orderService.assignNearestDeliveryPartner(req.params.id);
  req.app.get("io")?.to(`order:${order._id}`).emit("order:update", order);
  res.json({ success: true, order });
});

export const createPayment = asyncHandler(async (req, res) => {
  const data = await orderService.createRazorpayOrder(req.params.id);
  res.json({ success: true, ...data });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const order = await orderService.verifyRazorpayPayment(req.body);
  res.json({ success: true, order });
});
