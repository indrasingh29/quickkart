import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: "text" },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, trim: true },
    brand: { type: String, trim: true },
    images: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    mrp: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, default: "1 pc" },
    stock: { type: Number, required: true, min: 0, index: true },
    lowStockThreshold: { type: Number, default: 10 },
    tags: [{ type: String, index: true }],
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", brand: "text", tags: "text" });

export default mongoose.model("Product", productSchema);
