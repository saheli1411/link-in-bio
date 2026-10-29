import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const link = await prisma.link.findUnique({
      where: { id }
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    await prisma.linkClick.create({
      data: { linkId: id }
    });

    return NextResponse.json({ success: true, targetUrl: link.url });
  } catch (error) {
    return NextResponse.json({ error: "Failed to record click" }, { status: 500 });
  }
}