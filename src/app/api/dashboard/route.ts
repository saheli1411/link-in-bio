import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // 1. Fetch the user or auto-seed on the fly if missing
    let user = await prisma.user.findUnique({
      where: { handle: "johndoe" },
      include: {
        links: {
          orderBy: { position: "asc" },
          include: {
            _count: {
              select: { clicks: true },
            },
          },
        },
        _count: {
          select: { pageViews: true },
        },
      },
    });

    if (!user) {
      const passwordHash = await bcrypt.hash("demo1234", 10);
      user = await prisma.user.create({
        data: {
          email: "demo@example.com",
          passwordHash,
          handle: "johndoe",
          displayName: "John Doe",
          bio: "Tech creator & Open Source Enthusiast 🚀",
          avatarUrl:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
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
                title: "Latest Project Demo",
                url: "https://example.com",
                position: 1,
                isActive: true,
              },
            ],
          },
        },
        include: {
          links: {
            orderBy: { position: "asc" },
            include: {
              _count: {
                select: { clicks: true },
              },
            },
          },
          _count: {
            select: { pageViews: true },
          },
        },
      });
    }

    // 2. Compute 30-day view analytics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentViews = await prisma.pageView.count({
      where: {
        userId: user.id,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        handle: user.handle,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        theme: user.theme,
      },
      links: user.links.map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        position: link.position,
        isActive: link.isActive,
        startDate: link.startDate,
        endDate: link.endDate,
        clicksCount: link._count.clicks,
      })),
      analytics: {
        totalViews30d: recentViews,
        totalClicks30d: user.links.reduce(
          (acc, curr) => acc + curr._count.clicks,
          0
        ),
      },
    });
  } catch (error: any) {
    console.error("Dashboard GET Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    const user = await prisma.user.findUnique({ where: { handle: "johndoe" } });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (action === "create_link") {
      const { title, url, startDate, endDate } = body;
      const count = await prisma.link.count({ where: { userId: user.id } });

      const newLink = await prisma.link.create({
        data: {
          userId: user.id,
          title: title.trim(),
          url: url.trim(),
          position: count,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
        },
      });
      return NextResponse.json(newLink);
    }

    if (action === "update_link") {
      const { id, title, url, isActive, startDate, endDate } = body;
      const updated = await prisma.link.update({
        where: { id },
        data: {
          title: title ? title.trim() : undefined,
          url: url ? url.trim() : undefined,
          isActive: typeof isActive === "boolean" ? isActive : undefined,
          startDate:
            startDate !== undefined
              ? startDate
                ? new Date(startDate)
                : null
              : undefined,
          endDate:
            endDate !== undefined
              ? endDate
                ? new Date(endDate)
                : null
              : undefined,
        },
      });
      return NextResponse.json(updated);
    }

    if (action === "delete_link") {
      const { id } = body;
      await prisma.link.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    if (action === "reorder_links") {
      const { items } = body as { items: { id: string; position: number }[] };
      await prisma.$transaction(
        items.map((item) =>
          prisma.link.update({
            where: { id: item.id },
            data: { position: item.position },
          })
        )
      );
      return NextResponse.json({ success: true });
    }

    if (action === "update_theme") {
      const { theme } = body;
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { theme },
      });
      return NextResponse.json({ success: true, theme: updatedUser.theme });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Dashboard POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}