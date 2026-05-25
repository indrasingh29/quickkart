import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import { ApiError } from "../utils/apiError.js";

export const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product coupon");
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

export const upsertCartItem = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new ApiError(404, "Product not found");
  if (product.stock < quantity) throw new ApiError(400, "Insufficient stock");

  const cart = await getCart(userId);
  const item = cart.items.find((entry) => entry.product._id.toString() === productId);
  if (item) item.quantity = quantity;
  else cart.items.push({ product: productId, quantity });

  cart.items = cart.items.filter((entry) => entry.quantity > 0);
  await cart.save();
  return getCart(userId);
};

export const clearCart = async (userId) => {
  const cart = await getCart(userId);
  cart.items = [];
  cart.coupon = undefined;
  await cart.save();
  return cart;
};

export const applyCoupon = async (userId, code) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon || coupon.expiresAt < new Date()) throw new ApiError(404, "Invalid coupon");

  const cart = await getCart(userId);
  cart.coupon = coupon._id;
  await cart.save();
  return getCart(userId);
};

export const calculateCartTotals = (cart) => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 25;
  let discount = 0;
  if (cart.coupon && subtotal >= cart.coupon.minOrderValue) {
    discount =
      cart.coupon.discountType === "percent"
        ? Math.min((subtotal * cart.coupon.discountValue) / 100, cart.coupon.maxDiscount)
        : Math.min(cart.coupon.discountValue, cart.coupon.maxDiscount);
  }
  return { subtotal, deliveryFee, discount, total: Math.max(subtotal + deliveryFee - discount, 0) };
};
