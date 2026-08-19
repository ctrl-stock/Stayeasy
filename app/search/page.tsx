import HotelCard from "@/components/HotelCard";
import SearchFilters from "@/components/SearchFilters";
import { prisma } from "@/lib/prisma";

async function getHotels(params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/hotels?${query}`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const hotels = await getHotels(params);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1">
        <SearchFilters />
      </aside>
      <div className="md:col-span-3">
        <p className="text-sm text-gray-500 mb-4">{hotels.length} hotels found</p>
        <div className="grid gap-4">
          {hotels.map((hotel: any) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
          {hotels.length === 0 && (
            <p className="text-gray-500">No hotels match your search. Try adjusting filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}