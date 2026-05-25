import User from "../models/User.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js";
import Order from "../models/Order.js";

export const getAnalytics = async () => {
  const [users, products, stores, orders, revenueAgg, recentOrders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Store.countDocuments({ isApproved: true }),
    Order.countDocuments(),
    Order.aggregate([{ $match: { "payment.status": { $in: ["paid", "pending"] } } }, { $group: { _id: null, revenue: { $sum: "$pricing.total" } } }]),
    Order.find().sort({ createdAt: -1 }).limit(8).populate("customer store", "name")
  ]);

  return {
    users,
    products,
    stores,
    orders,
    revenue: revenueAgg[0]?.revenue || 0,
    recentOrders
  };
};

export const listUsers = () => User.find().select("-password").sort({ createdAt: -1 }).limit(100);

export const toggleBanUser = async (id) => {
  const user = await User.findById(id);
  user.isBanned = !user.isBanned;
  await user.save();
  return user;
};
