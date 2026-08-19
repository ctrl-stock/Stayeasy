import HotelCard from "@/components/HotelCard";
import SearchBox from "@/components/SearchBox";
import { prisma } from "@/lib/prisma";


export default async function HomePage() {
  const hotels = await prisma.hotel.findMany({
    where: { isActive: true },
    include: { rooms: { where: { isActive: true }, orderBy: { pricePerNight: "asc" } } },
    orderBy: { rating: "desc" },
    take: 6,
  });

  const featured = hotels.map((h) => ({
    ...h,
    startingPrice: h.rooms[0]?.pricePerNight ?? null,
    availableRoomsCount: h.rooms.length,
  }));

  const cities = [...new Set(hotels.map((h) => h.city))];

  return (
    <div>
      <section className="relative py-24 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white px-4">
        <h1 className="text-4xl font-bold mb-6">Find your next stay</h1>
        <SearchBox />
      </section>

      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-semibold mb-6">Popular Destinations</h2>
        <div className="flex gap-3 flex-wrap">
          {cities.map((city) => (
            <span key={city} className="border rounded-full px-4 py-2">{city}</span>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-semibold mb-6">Featured Hotels</h2>
        <div className="grid gap-4">
          {featured.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
    </div>
  );
}