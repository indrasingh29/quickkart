import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listCategories,
  listProducts,
  mongoIdParam,
  productRules,
  updateProduct
} from "../controllers/product.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.get("/", listProducts);
router.get("/categories", listCategories);
router.get("/:id", mongoIdParam, validate, getProduct);
router.post("/", protect, authorize("admin", "store_owner"), productRules, validate, createProduct);
router.patch("/:id", protect, authorize("admin", "store_owner"), mongoIdParam, validate, updateProduct);
router.delete("/:id", protect, authorize("admin", "store_owner"), mongoIdParam, validate, deleteProduct);

export default router;
