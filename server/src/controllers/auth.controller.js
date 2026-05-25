import { body } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginUser, registerUser } from "../services/auth.service.js";

export const registerRules = [
  body("name").trim().notEmpty(),
  body("email").optional().isEmail().normalizeEmail(),
  body("phone").optional().isLength({ min: 10 }),
  body("password").isLength({ min: 6 }),
  body("role").optional().isIn(["customer", "store_owner", "delivery_partner", "admin"])
];

export const loginRules = [
  body("email").optional().isEmail().normalizeEmail(),
  body("phone").optional().isLength({ min: 10 }),
  body("password").notEmpty()
];

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json({ success: true, ...result });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json({ success: true, ...result });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
