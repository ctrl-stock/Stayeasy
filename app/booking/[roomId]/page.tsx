import BookingForm from "@/components/BookingForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const { roomId } = await params;
  const { checkIn, checkOut, guests } = await searchParams;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { hotel: true },
  });

  if (!room || !checkIn || !checkOut) notFound();

  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );
  const subtotal = nights * room.pricePerNight;
  const taxes = Math.round(subtotal * 0.14 * 100) / 100;
  const total = subtotal + taxes;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-6">Complete your booking</h1>
        <BookingForm
          roomId={room.id}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={Number(guests) || 1}
        />
      </div>

      <div className="md:col-span-1">
        <div className="border rounded-lg p-5 dark:border-gray-700 sticky top-6">
          <h2 className="font-semibold mb-4">Summary</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Hotel</span>
              <span>{room.hotel.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Room</span>
              <span>{room.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Check-in</span>
              <span>{checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Check-out</span>
              <span>{checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Guests</span>
              <span>{guests}</span>
            </div>
            <hr className="dark:border-gray-700" />
            <div className="flex justify-between">
              <span className="text-gray-500">{nights} Nights × ${room.pricePerNight}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Taxes</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <hr className="dark:border-gray-700" />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}