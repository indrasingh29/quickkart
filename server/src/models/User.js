import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "Home" },
    line1: { type: String, trim: true, required: true },
    line2: { type: String, trim: true },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    pincode: { type: String, trim: true, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [77.5946, 12.9716] }
    },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    phone: { type: String, trim: true, unique: true, sparse: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["customer", "store_owner", "delivery_partner", "admin"],
      default: "customer",
      index: true
    },
    avatar: String,
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isBanned: { type: Boolean, default: false },
    lastLoginAt: Date
  },
  { timestamps: true }
);

userSchema.index({ "addresses.location": "2dsphere" });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
