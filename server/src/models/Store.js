import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    phone: { type: String, trim: true, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    serviceRadiusKm: { type: Number, default: 5 },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }
    },
    isOpen: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true }
  },
  { timestamps: true }
);

storeSchema.index({ location: "2dsphere" });

export default mongoose.model("Store", storeSchema);
