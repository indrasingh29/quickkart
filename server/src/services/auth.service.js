import User from "../models/User.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import { ApiError } from "../utils/apiError.js";
import { signToken } from "../utils/jwt.js";

const sanitizeUser = (user) => {
  const json = user.toObject ? user.toObject() : user;
  delete json.password;
  return json;
};

export const registerUser = async (payload) => {
  const existing = await User.findOne({ $or: [{ email: payload.email }, { phone: payload.phone }] });
  if (existing) throw new ApiError(409, "Account already exists");

  const user = await User.create(payload);
  if (payload.role === "delivery_partner") {
    await DeliveryPartner.create({ user: user._id, vehicleType: payload.vehicleType || "bike" });
  }

  return { user: sanitizeUser(user), token: signToken(user) };
};

export const loginUser = async ({ email, phone, password }) => {
  const query = email ? { email } : { phone };
  const user = await User.findOne(query).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }
  if (user.isBanned) throw new ApiError(403, "Account is disabled");

  user.lastLoginAt = new Date();
  await user.save();

  return { user: sanitizeUser(user), token: signToken(user) };
};
