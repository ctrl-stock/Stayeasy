import Image from "next/image";
import Link from "next/link";

export default function HotelCard({ hotel }: { hotel: any }) {
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col md:flex-row ">
      <div className="relative w-full md:w-64 h-48">
        {hotel.images?.[0] && (
          <Image src={hotel.images[0]} alt={hotel.name} fill className="object-cover" />
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">{hotel.name}</h3>
          <p className="text-sm text-gray-500">{hotel.city}</p>
          <p className="text-yellow-500">⭐ {hotel.rating.toFixed(1)}</p>
        </div>
        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="text-xl font-bold">${hotel.startingPrice ?? "—"}/night</p>
            <p className="text-xs text-gray-400">{hotel.availableRoomsCount} rooms available</p>
          </div>
          <Link href={`/hotels/${hotel.id}`} className="bg-blue-600 text-white px-4 py-2 rounded">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}