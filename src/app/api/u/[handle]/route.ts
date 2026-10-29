import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  // Await the params Promise
  const { handle: rawHandle } = await params;
  const handle = rawHandle?.toLowerCase();

  if (!handle) {
    return NextResponse.json({ error: "Handle is required" }, { status: 400 });
  }

  const now = new Date();

  const user = await prisma.user.findUnique({
    where: { handle },
    select: {
      id: true,
      handle: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      theme: true,
      links: {
        where: {
          isActive: true,
          AND: [
            { OR: [{ startDate: null }, { startDate: { lte: now } }] },
            { OR: [{ endDate: null }, { endDate: { gte: now } }] }
          ]
        },
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          url: true,
          position: true
        }
      }
    }
  });

  if (!user) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Record page view asynchronously
  await prisma.pageView.create({
    data: { userId: user.id }
  });

  return NextResponse.json(user);
}