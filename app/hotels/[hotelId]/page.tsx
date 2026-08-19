import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getHotel(id: string) {
  const hotel = await prisma.hotel.findUnique({
    where: { id, isActive: true },
    include: {
      rooms: { where: { isActive: true }, orderBy: { pricePerNight: "asc" } },
    },
  });
  return hotel;
}

export default async function HotelDetailsPage({
  params,
}: {
  params: Promise<{ hotelId: string }>;
}) {
  const { hotelId } = await params;
  const hotel = await getHotel(hotelId);

  if (!hotel) notFound();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Image gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 rounded-lg overflow-hidden">
        {hotel.images.slice(0, 2).map((img, i) => (
          <div key={i} className="relative h-72">
            <Image src={img} alt={`${hotel.name} ${i + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Hotel info */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          <p className="text-gray-500">{hotel.location}</p>
          <p className="text-yellow-500 mt-1">⭐ {hotel.rating.toFixed(1)}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">About this hotel</h2>
        <p className="text-gray-600 dark:text-gray-300">{hotel.description}</p>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Amenities</h2>
        <div className="flex flex-wrap gap-3">
          {hotel.amenities.map((a) => (
            <span
              key={a}
              className="border rounded-full px-4 py-1.5 text-sm dark:border-gray-700"
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Available rooms */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>
        <div className="grid gap-4">
          {hotel.rooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg overflow-hidden flex flex-col md:flex-row dark:border-gray-700"
            >
              <div className="relative w-full md:w-56 h-40">
                {room.images?.[0] && (
                  <Image src={room.images[0]} alt={room.type} fill className="object-cover" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{room.type}</h3>
                  <p className="text-sm text-gray-500">
                    {room.capacity} Guests · {room.bedType}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {room.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="text-xs text-gray-500 border rounded px-2 py-0.5 dark:border-gray-700">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold">${room.pricePerNight}</p>
                  <p className="text-xs text-gray-400 mb-2">per night</p>
                  <Link
                    href={`/hotels/${hotel.id}/rooms/${room.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded inline-block"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {hotel.rooms.length === 0 && (
            <p className="text-gray-500">No rooms currently available.</p>
          )}
        </div>
      </div>
    </div>
  );
}