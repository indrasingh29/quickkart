import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    price: Number,
    quantity: Number
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner", index: true },
    items: [orderItemSchema],
    address: {
      label: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: [Number]
      }
    },
    status: {
      type: String,
      enum: ["placed", "accepted", "packed", "assigned", "picked_up", "delivered", "cancelled", "rejected"],
      default: "placed",
      index: true
    },
    payment: {
      method: { type: String, enum: ["cod", "razorpay"], default: "cod" },
      status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String
    },
    pricing: {
      subtotal: { type: Number, default: 0 },
      deliveryFee: { type: Number, default: 25 },
      discount: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    couponCode: String,
    deliveryLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date
    },
    timeline: [
      {
        status: String,
        message: String,
        at: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

orderSchema.pre("save", function setOrderNumber(next) {
  if (!this.orderNumber) {
    this.orderNumber = `QK${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model("Order", orderSchema);
