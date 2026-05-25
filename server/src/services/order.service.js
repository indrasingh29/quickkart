import crypto from "node:crypto";
import Razorpay from "razorpay";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { calculateCartTotals } from "./cart.service.js";

const razorpay =
  env.razorpay.keyId && env.razorpay.keySecret
    ? new Razorpay({ key_id: env.razorpay.keyId, key_secret: env.razorpay.keySecret })
    : null;

export const placeOrder = async (user, { addressId, paymentMethod = "cod" }) => {
  const cart = await Cart.findOne({ user: user._id }).populate("items.product coupon");
  if (!cart || cart.items.length === 0) throw new ApiError(400, "Cart is empty");

  const address = user.addresses.id(addressId) || user.addresses.find((entry) => entry.isDefault) || user.addresses[0];
  if (!address) throw new ApiError(400, "Delivery address required");

  const outOfStock = cart.items.find((item) => item.product.stock < item.quantity);
  if (outOfStock) throw new ApiError(400, `${outOfStock.product.name} is out of stock`);

  const totals = calculateCartTotals(cart);
  const firstStore = cart.items[0].product.store;
  const order = await Order.create({
    customer: user._id,
    store: firstStore,
    items: cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0],
      price: item.product.price,
      quantity: item.quantity
    })),
    address,
    payment: { method: paymentMethod, status: paymentMethod === "cod" ? "pending" : "pending" },
    pricing: totals,
    couponCode: cart.coupon?.code,
    timeline: [{ status: "placed", message: "Order placed successfully" }]
  });

  await Promise.all(
    cart.items.map((item) => Product.updateOne({ _id: item.product._id }, { $inc: { stock: -item.quantity } }))
  );
  cart.items = [];
  cart.coupon = undefined;
  await cart.save();

  return order.populate("items.product store customer", "name email phone city");
};

export const createRazorpayOrder = async (orderId) => {
  if (!razorpay) throw new ApiError(503, "Razorpay is not configured");
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  const rpOrder = await razorpay.orders.create({
    amount: Math.round(order.pricing.total * 100),
    currency: "INR",
    receipt: order.orderNumber
  });
  order.payment.razorpayOrderId = rpOrder.id;
  await order.save();
  return { razorpayOrder: rpOrder, key: env.razorpay.keyId };
};

export const verifyRazorpayPayment = async ({ orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const digest = crypto
    .createHmac("sha256", env.razorpay.keySecret || "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  if (digest !== razorpay_signature) throw new ApiError(400, "Payment verification failed");

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  order.payment.status = "paid";
  order.payment.razorpayPaymentId = razorpay_payment_id;
  order.payment.razorpaySignature = razorpay_signature;
  await order.save();
  return order;
};

export const listOrdersForUser = (user) => {
  const filter = user.role === "customer" ? { customer: user._id } : {};
  return Order.find(filter).populate("store deliveryPartner").sort({ createdAt: -1 }).limit(100);
};

export const updateOrderStatus = async (orderId, status, io) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  order.status = status;
  order.timeline.push({ status, message: `Order ${status.replaceAll("_", " ")}` });
  await order.save();
  io?.to(`order:${order._id}`).emit("order:update", order);
  return order;
};

export const assignNearestDeliveryPartner = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  const partner = await DeliveryPartner.findOne({ isAvailable: true }).sort({ updatedAt: -1 });
  if (!partner) throw new ApiError(404, "No delivery partner available");
  order.deliveryPartner = partner._id;
  order.status = "assigned";
  order.timeline.push({ status: "assigned", message: "Delivery partner assigned" });
  partner.isAvailable = false;
  await Promise.all([order.save(), partner.save()]);
  return order;
};
