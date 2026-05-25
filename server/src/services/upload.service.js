import cloudinary from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

const assertCloudinaryConfigured = () => {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new ApiError(503, "Cloudinary is not configured");
  }
};

export const uploadImage = async (file, folder = "quickkart") => {
  assertCloudinaryConfigured();
  if (!file) throw new ApiError(400, "Image file is required");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ width: 1200, height: 1200, crop: "limit" }, { quality: "auto" }, { fetch_format: "auto" }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format
        });
      }
    );

    stream.end(file.buffer);
  });
};
