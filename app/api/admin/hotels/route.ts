// app/api/admin/hotels/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;
  return session;
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { name, description, city, location, rating, images, amenities } = body;

  const hotel = await prisma.hotel.create({
    data: {
      name,
      description,
      city,
      location,
      rating: rating ? Number(rating) : 0,
      images: images || [],
      amenities: amenities || [],
    },
  });

  return NextResponse.json(hotel, { status: 201 });
}