import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { ApiError } from "../utils/apiError.js";

export const listProducts = async (query) => {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Number(query.limit || 12), 50);
  const filter = { isActive: true };

  if (query.category) filter.category = query.category;
  if (query.store) filter.store = query.store;
  if (query.search) filter.$text = { $search: query.search };
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("store", "name city")
      .sort(query.search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter)
  ]);

  return { items, total, page, pages: Math.ceil(total / limit) };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate("category store");
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const createProduct = async (payload) => Product.create(payload);

export const updateProduct = async (id, payload) => {
  const product = await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const listCategories = () => Category.find({ isActive: true }).sort("name");
