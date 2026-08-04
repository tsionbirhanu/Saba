import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const categories = ["Women Clothes", "Men Clothes", "Gabi", "Jewelry"];

const seedProducts = [
  {
    id: "seed-dress-1",
    name: "Traditional Habesha Dress",
    description: "Beautiful traditional women's dress with intricate embroidery.",
    price: 6400,
    stock: 12,
    image: "/images/dress.jpg",
    category: "Women Clothes",
  },
  {
    id: "seed-dress-2",
    name: "Elegant White Dress",
    description: "Elegant traditional dress perfect for special occasions.",
    price: 5000,
    stock: 9,
    image: "/images/dress2.jpg",
    category: "Women Clothes",
  },
  {
    id: "seed-dress-3",
    name: "Embroidered Cultural Dress",
    description: "Premium handmade dress with detailed artisan work.",
    price: 5300,
    stock: 7,
    image: "/images/traditional.jpg",
    category: "Women Clothes",
  },
  {
    id: "seed-men-1",
    name: "Men's Traditional Set",
    description: "Classic traditional men's outfit with premium fabric.",
    price: 4900,
    stock: 10,
    image: "/images/menn.jpg",
    category: "Men Clothes",
  },
  {
    id: "seed-men-2",
    name: "Handmade Men's Shirt",
    description: "Comfortable handcrafted men's traditional shirt.",
    price: 3700,
    stock: 14,
    image: "/images/men4.jpg",
    category: "Men Clothes",
  },
  {
    id: "seed-gabi-1",
    name: "Handwoven Gabi Wrap",
    description: "Premium traditional gabi wrap for everyday elegance.",
    price: 5000,
    stock: 6,
    image: "/images/gabi.jpg",
    category: "Gabi",
  },
  {
    id: "seed-gabi-2",
    name: "Classic Gabi Shawl",
    description: "Soft handmade gabi shawl woven by local artisans.",
    price: 3500,
    stock: 8,
    image: "/images/gabi00.jpg",
    category: "Gabi",
  },
  {
    id: "seed-jewelry-1",
    name: "Silver Jewelry Set",
    description: "Traditional silver jewelry set with artisan detailing.",
    price: 1200,
    stock: 20,
    image: "/images/rings2.jpg",
    category: "Jewelry",
  },
  {
    id: "seed-jewelry-2",
    name: "Beaded Necklace",
    description: "Handcrafted beaded necklace inspired by Ethiopian heritage.",
    price: 900,
    stock: 18,
    image: "/images/rings.png",
    category: "Jewelry",
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@saba.local";
  const password = process.env.ADMIN_PASSWORD || "SeedAdmin123!";
  const name = process.env.ADMIN_NAME || "Admin";

  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Seeded ADMIN user: ${email}`);

  const seedPassword = await bcrypt.hash("SeedPassword123!", SALT_ROUNDS);

  const designerUser = await prisma.user.upsert({
    where: { email: "designer@saba.local" },
    update: {
      name: "Amina Kedir",
      role: "DESIGNER",
      profileImage: "/images/girl1.png",
    },
    create: {
      name: "Amina Kedir",
      email: "designer@saba.local",
      password: seedPassword,
      role: "DESIGNER",
      profileImage: "/images/girl1.png",
    },
  });

  const buyerUser = await prisma.user.upsert({
    where: { email: "buyer@saba.local" },
    update: {
      name: "Sarah Demse",
      role: "BUYER",
      profileImage: "/images/girl2.png",
    },
    create: {
      name: "Sarah Demse",
      email: "buyer@saba.local",
      password: seedPassword,
      role: "BUYER",
      profileImage: "/images/girl2.png",
    },
  });

  const designerProfile = await prisma.designerProfile.upsert({
    where: { userId: designerUser.id },
    update: {
      bio: "Artisan seller of handmade Ethiopian fashion.",
      skills: "Weaving, embroidery, jewelry",
      isVerified: true,
      verifiedAt: new Date(),
    },
    create: {
      user: { connect: { id: designerUser.id } },
      bio: "Artisan seller of handmade Ethiopian fashion.",
      skills: "Weaving, embroidery, jewelry",
      isVerified: true,
      verifiedAt: new Date(),
    },
  });

  const categoryRows = new Map<string, { id: string; name: string }>();
  for (const categoryName of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });
    categoryRows.set(categoryName, category);
  }

  for (const product of seedProducts) {
    const category = categoryRows.get(product.category);
    if (!category) throw new Error(`Missing seeded category: ${product.category}`);

    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
        categoryId: category.id,
        designerProfileId: designerProfile.id,
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image: product.image,
        categoryId: category.id,
        designerProfileId: designerProfile.id,
      },
    });
  }

  await prisma.favorite.upsert({
    where: { id: "seed-favorite-1" },
    update: {},
    create: {
      id: "seed-favorite-1",
      userId: buyerUser.id,
      productId: "seed-dress-1",
    },
  });

  await prisma.favorite.upsert({
    where: { id: "seed-favorite-2" },
    update: {},
    create: {
      id: "seed-favorite-2",
      userId: buyerUser.id,
      productId: "seed-jewelry-1",
    },
  });

  const seedOrderOne = await prisma.order.upsert({
    where: { id: "seed-order-1" },
    update: {
      status: "DELIVERED",
      totalAmount: 6400,
    },
    create: {
      id: "seed-order-1",
      productId: "seed-dress-1",
      buyerId: buyerUser.id,
      quantity: 1,
      totalAmount: 6400,
      status: "DELIVERED",
      paidAt: new Date(),
    },
  });

  await prisma.orderItem.upsert({
    where: { id: "seed-order-item-1" },
    update: {
      quantity: 1,
      unitPrice: 6400,
      totalAmount: 6400,
    },
    create: {
      id: "seed-order-item-1",
      orderId: seedOrderOne.id,
      productId: "seed-dress-1",
      designerProfileId: designerProfile.id,
      quantity: 1,
      unitPrice: 6400,
      totalAmount: 6400,
    },
  });

  await prisma.review.upsert({
    where: {
      userId_productId: {
        userId: buyerUser.id,
        productId: "seed-dress-1",
      },
    },
    update: {
      rating: 5,
      comment: "Beautiful handmade dress and excellent quality.",
    },
    create: {
      userId: buyerUser.id,
      productId: "seed-dress-1",
      rating: 5,
      comment: "Beautiful handmade dress and excellent quality.",
    },
  });

  const seedOrderTwo = await prisma.order.upsert({
    where: { id: "seed-order-2" },
    update: {
      status: "PENDING",
      totalAmount: 10000,
    },
    create: {
      id: "seed-order-2",
      productId: "seed-gabi-1",
      buyerId: buyerUser.id,
      quantity: 2,
      totalAmount: 10000,
      status: "PENDING",
    },
  });

  await prisma.orderItem.upsert({
    where: { id: "seed-order-item-2" },
    update: {
      quantity: 2,
      unitPrice: 5000,
      totalAmount: 10000,
    },
    create: {
      id: "seed-order-item-2",
      orderId: seedOrderTwo.id,
      productId: "seed-gabi-1",
      designerProfileId: designerProfile.id,
      quantity: 2,
      unitPrice: 5000,
      totalAmount: 10000,
    },
  });

  await prisma.message.upsert({
    where: { id: "seed-message-1" },
    update: {},
    create: {
      id: "seed-message-1",
      senderId: buyerUser.id,
      receiverId: designerUser.id,
      text: "Hi Amina, is the traditional dress available this week?",
    },
  });

  await prisma.message.upsert({
    where: { id: "seed-message-2" },
    update: {},
    create: {
      id: "seed-message-2",
      senderId: designerUser.id,
      receiverId: buyerUser.id,
      text: "Yes, it is available and ready to ship.",
    },
  });

  await prisma.product.updateMany({
    where: { image: { contains: "traditional_dress_1.jpg" } },
    data: { image: "/images/traditional_dress.jpg" },
  });

  await prisma.product.updateMany({
    where: { image: { startsWith: "http://localhost:3000/images/" } },
    data: { image: "/images/image101.jpg" },
  });

  console.log(`Seeded ${categories.length} categories and ${seedProducts.length} mock products with local images.`);
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.log("Seed admin login: admin@saba.local / SeedAdmin123!");
  }
  console.log("Seed buyer login: buyer@saba.local / SeedPassword123!");
  console.log("Seed designer login: designer@saba.local / SeedPassword123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
