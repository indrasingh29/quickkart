import mongoose from "mongoose";

const deliveryPartnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    vehicleType: { type: String, enum: ["bike", "scooter", "cycle"], default: "bike" },
    vehicleNumber: String,
    isAvailable: { type: Boolean, default: true, index: true },
    currentLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [77.5946, 12.9716] }
    },
    earnings: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 5 },
    completedDeliveries: { type: Number, default: 0 }
  },
  { timestamps: true }
);

deliveryPartnerSchema.index({ currentLocation: "2dsphere" });

export default mongoose.model("DeliveryPartner", deliveryPartnerSchema);
