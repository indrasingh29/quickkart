import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, uppercase: true, trim: true, unique: true, required: true },
    description: String,
    discountType: { type: String, enum: ["percent", "flat"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 500 },
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: true },
    usageLimit: { type: Number, default: 1000 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
