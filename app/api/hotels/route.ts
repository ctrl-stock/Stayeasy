import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || undefined;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const sort = searchParams.get("sort"); // "price_asc" | "price_desc" | "rating"

  const hotels = await prisma.hotel.findMany({
    where: {
      isActive: true,
      city: city ? { contains: city, mode: "insensitive" } : undefined,
      rating: minRating ? { gte: Number(minRating) } : undefined,
    },
    include: {
      rooms: {
        where: {
          isActive: true,
          pricePerNight: {
            gte: minPrice ? Number(minPrice) : undefined,
            lte: maxPrice ? Number(maxPrice) : undefined,
          },
        },
        orderBy: { pricePerNight: "asc" },
      },
    },
  });

  // only keep hotels that still have at least one room matching the price filter
  const filtered = hotels.filter((h) => h.rooms.length > 0);

  const results = filtered.map((h) => ({
    ...h,
    startingPrice: h.rooms[0]?.pricePerNight ?? null,
    availableRoomsCount: h.rooms.length,
  }));

  if (sort === "price_asc") results.sort((a, b) => (a.startingPrice ?? 0) - (b.startingPrice ?? 0));
  if (sort === "price_desc") results.sort((a, b) => (b.startingPrice ?? 0) - (a.startingPrice ?? 0));
  if (sort === "rating") results.sort((a, b) => b.rating - a.rating);

  return NextResponse.json(results);
}