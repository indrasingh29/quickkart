import { asyncHandler } from "../utils/asyncHandler.js";
import * as adminService from "../services/admin.service.js";

export const analytics = asyncHandler(async (_req, res) => {
  const data = await adminService.getAnalytics();
  res.json({ success: true, data });
});

export const users = asyncHandler(async (_req, res) => {
  const data = await adminService.listUsers();
  res.json({ success: true, users: data });
});

export const toggleBan = asyncHandler(async (req, res) => {
  const user = await adminService.toggleBanUser(req.params.id);
  res.json({ success: true, user });
});
