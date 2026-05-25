import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Store.deleteMany({}),
    Product.deleteMany({}),
    Coupon.deleteMany({}),
    DeliveryPartner.deleteMany({})
  ]);

  const [admin, owner, delivery, customer] = await User.create([
    { name: "QuickKart Admin", email: "admin@quickkart.dev", phone: "9000000001", password: "password123", role: "admin" },
    { name: "Fresh Hub Owner", email: "owner@quickkart.dev", phone: "9000000002", password: "password123", role: "store_owner" },
    { name: "Aman Rider", email: "rider@quickkart.dev", phone: "9000000003", password: "password123", role: "delivery_partner" },
    {
      name: "Demo Customer",
      email: "customer@quickkart.dev",
      phone: "9000000004",
      password: "password123",
      role: "customer",
      addresses: [{ label: "Home", line1: "Indiranagar 12th Main", city: "Bengaluru", state: "KA", pincode: "560038", isDefault: true }]
    }
  ]);

  await DeliveryPartner.create({ user: delivery._id, vehicleType: "bike", vehicleNumber: "KA01QK1234" });

  const categories = await Category.create([
    { name: "Fruits & Vegetables", slug: "fruits-vegetables", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" },
    { name: "Dairy & Breakfast", slug: "dairy-breakfast", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80" },
    { name: "Snacks", slug: "snacks", image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80" },
    { name: "Beverages", slug: "beverages", image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=600&q=80" }
  ]);

  const store = await Store.create({
    name: "Fresh Hub Indiranagar",
    owner: owner._id,
    phone: "9000000099",
    address: "100 Feet Road, Indiranagar",
    city: "Bengaluru",
    location: { type: "Point", coordinates: [77.6408, 12.9719] }
  });

  const products = [
    ["Farm Banana", "farm-banana", "Naturally ripened Robusta bananas.", 65, 49, "1 dozen", 60, 0],
    ["Tomato Local", "tomato-local", "Fresh tomatoes for daily cooking.", 45, 32, "500 g", 80, 0],
    ["Amul Butter", "amul-butter", "Creamy salted butter.", 62, 58, "100 g", 35, 1],
    ["Greek Yogurt", "greek-yogurt", "High protein breakfast yogurt.", 120, 99, "200 g", 25, 1],
    ["Masala Chips", "masala-chips", "Crunchy spicy chips.", 30, 25, "52 g", 100, 2],
    ["Trail Mix", "trail-mix", "Nuts and berries snack pack.", 180, 149, "200 g", 30, 2],
    ["Cold Coffee", "cold-coffee", "Ready to drink cold coffee.", 90, 75, "250 ml", 45, 3],
    ["Coconut Water", "coconut-water", "Tender coconut water.", 70, 59, "300 ml", 40, 3]
  ];

  await Product.create(
    products.map(([name, slug, description, mrp, price, unit, stock, categoryIndex]) => ({
      name,
      slug,
      description,
      mrp,
      price,
      unit,
      stock,
      category: categories[categoryIndex]._id,
      store: store._id,
      images: [`https://source.unsplash.com/600x600/?${encodeURIComponent(name)},grocery`],
      tags: ["quick", "fresh", "daily"]
    }))
  );

  await Coupon.create({
    code: "QUICK50",
    description: "50 off your first basket",
    discountType: "flat",
    discountValue: 50,
    minOrderValue: 199,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
  });

  console.log("Seed complete");
  console.log("Demo logins: admin/customer/owner/rider @quickkart.dev, password password123");
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
