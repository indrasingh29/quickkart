import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["order", "inventory", "payment", "system"], default: "system" },
    meta: { type: mongoose.Schema.Types.Mixed },
    readAt: Date
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
