import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwt.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : req.cookies?.token;

  if (!token) throw new ApiError(401, "Authentication required");

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.id).select("-password");

  if (!user || user.isBanned) throw new ApiError(401, "Invalid or disabled account");

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, "You do not have permission to perform this action");
  }
  next();
};
