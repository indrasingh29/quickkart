import { body, param } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as productService from "../services/product.service.js";

export const productRules = [
  body("name").trim().notEmpty(),
  body("slug").trim().notEmpty(),
  body("category").isMongoId(),
  body("store").isMongoId(),
  body("price").isFloat({ min: 0 }),
  body("mrp").isFloat({ min: 0 }),
  body("stock").isInt({ min: 0 })
];

export const mongoIdParam = [param("id").isMongoId()];

export const listProducts = asyncHandler(async (req, res) => {
  const data = await productService.listProducts(req.query);
  res.json({ success: true, ...data });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.json({ success: true, product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  req.app.get("io")?.emit("inventory:update", { productId: product._id, stock: product.stock });
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  req.app.get("io")?.emit("inventory:update", { productId: product._id, stock: product.stock });
  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);
  res.json({ success: true, product });
});

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await productService.listCategories();
  res.json({ success: true, categories });
});
