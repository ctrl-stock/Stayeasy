import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RoomBookingPanel from "@/components/RoomBookingPanel";
import Image from "next/image";

async function getRoom(hotelId: string, roomId: string) {
  const room = await prisma.room.findFirst({
    where: { id: roomId, hotelId, isActive: true },
    include: { hotel: true },
  });
  return room;
}

export default async function RoomDetailsPage({
  params,
}: {
  params: Promise<{ hotelId: string; roomId: string }>;
}) {
  const { hotelId, roomId } = await params;
  const room = await getRoom(hotelId, roomId);

  if (!room) notFound();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden mb-6">
          {room.images.slice(0, 2).map((img, i) => (
            <div key={i} className="relative h-56">
              <Image src={img} alt={room.type} fill className="object-cover" />
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold">{room.type}</h1>
        <p className="text-gray-500 mb-4">{room.hotel.name} · {room.hotel.city}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
          <span>{room.capacity} Guests</span>
          <span>·</span>
          <span>{room.bedType}</span>
          {room.sizeSqm && (
            <>
              <span>·</span>
              <span>{room.sizeSqm} m²</span>
            </>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">{room.description}</p>

        <h2 className="font-semibold mb-2">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {room.amenities.map((a) => (
            <span key={a} className="text-sm border rounded-full px-3 py-1 dark:border-gray-700">
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Booking panel — client component for interactivity */}
      <div className="md:col-span-1">
        <RoomBookingPanel
          hotelId={room.hotelId}
          roomId={room.id}
          pricePerNight={room.pricePerNight}
          capacity={room.capacity}
        />
      </div>
    </div>
  );
}