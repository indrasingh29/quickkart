import dotenv from "dotenv";

dotenv.config();

const splitOrigins = (...origins) => origins.filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quickkart",
  jwtSecret: process.env.JWT_SECRET || "quickkart_dev_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  allowedOrigins: splitOrigins(
    process.env.CLIENT_URL || "http://localhost:5173",
    process.env.ADMIN_URL || "http://localhost:5174",
    process.env.DELIVERY_URL || "http://localhost:5175"
  ),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET
  }
};
