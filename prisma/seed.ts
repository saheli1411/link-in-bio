import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.linkClick.deleteMany();
  await prisma.pageView.deleteMany();
  await prisma.link.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo1234", 10);
  const now = new Date();

  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      passwordHash,
      handle: "johndoe",
      displayName: "John Doe",
      bio: "Tech creator & Open Source Enthusiast 🚀",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      theme: "dark-neon",
      links: {
        create: [
          {
            title: "Check my Portfolio",
            url: "https://github.com",
            position: 0,
            isActive: true,
          },
          {
            title: "Limited Summer Deal (Active Now)",
            url: "https://gumroad.com",
            position: 1,
            isActive: true,
            startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
            endDate: new Date(now.getTime() + 48 * 60 * 60 * 1000),   // 2 days in future
          },
          {
            title: "Old Flash Sale (Expired - Should NOT Show)",
            url: "https://example.com/expired",
            position: 2,
            isActive: true,
            startDate: new Date(now.getTime() - 72 * 60 * 60 * 1000),
            endDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          },
          {
            title: "Upcoming Announcement (Future - Should NOT Show)",
            url: "https://example.com/future",
            position: 3,
            isActive: true,
            startDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          }
        ]
      }
    }
  });

  // Seed sample page views and clicks
  await prisma.pageView.createMany({
    data: [
      { userId: user.id, createdAt: new Date() },
      { userId: user.id, createdAt: new Date(now.getTime() - 86400000) },
      { userId: user.id, createdAt: new Date(now.getTime() - 172800000) }
    ]
  });

  console.log("Database seeded successfully with demo account: handle -> johndoe, password -> demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });