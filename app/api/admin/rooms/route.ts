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
  const {
    hotelId, type, description, pricePerNight, capacity,
    bedType, sizeSqm, amenities, images, totalRooms,
  } = body;

  if (!hotelId || !type || !pricePerNight || !capacity || !bedType || !totalRooms) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel) {
    return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
  }

  const room = await prisma.room.create({
    data: {
      hotelId,
      type,
      description,
      pricePerNight,
      capacity,
      bedType,
      sizeSqm: sizeSqm || null,
      amenities: amenities || [],
      images: images || [],
      totalRooms,
    },
  });

  return NextResponse.json(room, { status: 201 });
}       