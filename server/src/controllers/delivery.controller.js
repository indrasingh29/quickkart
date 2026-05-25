import { body } from "express-validator";
import DeliveryPartner from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const locationRules = [body("lat").isFloat({ min: -90, max: 90 }), body("lng").isFloat({ min: -180, max: 180 })];

export const assignedOrders = asyncHandler(async (req, res) => {
  const partner = await DeliveryPartner.findOne({ user: req.user._id });
  const orders = partner ? await Order.find({ deliveryPartner: partner._id }).sort({ createdAt: -1 }) : [];
  res.json({ success: true, orders, earnings: partner?.earnings || 0 });
});

export const updateLocation = asyncHandler(async (req, res) => {
  const partner = await DeliveryPartner.findOneAndUpdate(
    { user: req.user._id },
    { currentLocation: { type: "Point", coordinates: [req.body.lng, req.body.lat] } },
    { new: true }
  );
  req.app.get("io")?.emit("delivery:location", { partnerId: partner?._id, lat: req.body.lat, lng: req.body.lng });
  res.json({ success: true, partner });
});
