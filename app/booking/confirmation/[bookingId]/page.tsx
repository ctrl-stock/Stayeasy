import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { hotel: true, room: true },
  });

  if (!booking) notFound();

  return (
    <div className="max-w-lg mx-auto py-16 px-4 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold mb-2">Booking Confirmed</h1>
      <p className="text-gray-500 mb-8">Booking ID: #{booking.id.slice(-8).toUpperCase()}</p>

      <div className="border rounded-lg p-6 text-left space-y-2 dark:border-gray-700">
        <div className="flex justify-between">
          <span className="text-gray-500">Hotel</span>
          <span>{booking.hotel.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Room</span>
          <span>{booking.room.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Check-in</span>
          <span>{booking.checkIn.toDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Check-out</span>
          <span>{booking.checkOut.toDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Guests</span>
          <span>{booking.guests}</span>
        </div>
        <hr className="dark:border-gray-700" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${booking.total.toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/dashboard/bookings"
        className="inline-block mt-8 bg-blue-600 text-white px-6 py-2.5 rounded font-medium"
      >
        View My Bookings
      </Link>
    </div>
  );
}