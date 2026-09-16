import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create regular user
  const userPassword = await hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Demo User",
      password: userPassword,
      role: "USER",
    },
  });

  // Sample products
  const products = [
    {
      name: "Wireless Noise-Cancelling Headphones",
      description:
        "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound. Perfect for travel and focus.",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      category: "Electronics",
      stock: 45,
      featured: true,
    },
    {
      name: "Minimalist Leather Backpack",
      description:
        "Handcrafted full-grain leather backpack with laptop sleeve, multiple compartments, and timeless design. Ages beautifully.",
      price: 189.0,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      category: "Accessories",
      stock: 28,
      featured: true,
    },
    {
      name: "Smart Fitness Watch",
      description:
        "Track heart rate, sleep, workouts, and more. Bright AMOLED display, 7-day battery, and water resistant to 50m.",
      price: 249.0,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      category: "Electronics",
      stock: 62,
      featured: true,
    },
    {
      name: "Organic Cotton T-Shirt",
      description:
        "Ultra-soft 100% organic cotton tee. Pre-shrunk, breathable, and available in multiple colors. Ethically made.",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      category: "Clothing",
      stock: 120,
      featured: false,
    },
    {
      name: "Ceramic Pour-Over Coffee Set",
      description:
        "Elegant ceramic dripper, server, and filters. Brew cafe-quality coffee at home with this beautiful set.",
      price: 68.0,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      category: "Home",
      stock: 35,
      featured: true,
    },
    {
      name: "Mechanical Keyboard",
      description:
        "Tactile switches, RGB backlight, aluminum frame, and hot-swappable keys. Built for typing and gaming.",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80",
      category: "Electronics",
      stock: 40,
      featured: false,
    },
    {
      name: "Scented Soy Candle Trio",
      description:
        "Three hand-poured soy candles: Sandalwood, Lavender, and Citrus. Clean burn, long lasting, beautiful packaging.",
      price: 42.0,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
      category: "Home",
      stock: 80,
      featured: false,
    },
    {
      name: "Running Shoes Pro",
      description:
        "Lightweight, responsive cushioning and breathable mesh upper. Designed for daily training and long runs.",
      price: 129.0,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      category: "Clothing",
      stock: 55,
      featured: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("✅ Seed complete!");
  console.log("Admin login → email: admin@example.com  password: admin123");
  console.log("User login  → email: user@example.com   password: user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
