import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImage } from "../services/upload.service.js";

export const uploadProductImage = asyncHandler(async (req, res) => {
  const image = await uploadImage(req.file, "quickkart/products");
  res.status(201).json({ success: true, image });
});
