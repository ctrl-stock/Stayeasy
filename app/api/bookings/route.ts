import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const TAX_RATE = 0.14; // adjust as needed

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "You must be logged in to book" }, { status: 401 });
    }

    const body = await req.json();
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
      firstName,
      lastName,
      email,
      phone,
      specialRequests,
    } = body;

    if (!roomId || !checkIn || !checkOut || !guests || !firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room || !room.isActive) {
      return NextResponse.json({ error: "Room not available" }, { status: 404 });
    }

    if (guests > room.capacity) {
      return NextResponse.json({ error: `Room fits up to ${room.capacity} guests` }, { status: 400 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
    }

    const subtotal = nights * room.pricePerNight;
    const taxes = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = subtotal + taxes;

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        hotelId: room.hotelId,
        roomId: room.id,
        firstName,
        lastName,
        email,
        phone,
        guests,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        pricePerNight: room.pricePerNight,
        taxes,
        total,
        specialRequests: specialRequests || null,
        status: "CONFIRMED", // no payment gateway yet, so auto-confirm
      },
    });

    return NextResponse.json({ id: booking.id }, { status: 201 });
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}