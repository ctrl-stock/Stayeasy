import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, phone } = await req.json();

  await prisma.user.update({
    where: { id: session.user.id as string },
    data: { name, phone },
  });

  return NextResponse.json({ success: true });
}