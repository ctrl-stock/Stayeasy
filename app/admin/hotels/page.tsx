import { prisma } from "@/lib/prisma";
import Link from "next/link";
import HotelActions from "@/components/admin/HotelActions";

export default async function AdminHotelsPage() {
  const hotels = await prisma.hotel.findMany({
    include: { rooms: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hotels</h1>
        <Link href="/admin/hotels/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Hotel
        </Link>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b dark:border-gray-700">
            <th className="py-2">Name</th>
            <th className="py-2">City</th>
            <th className="py-2">Rooms</th>
            <th className="py-2">Rating</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((h) => (
            <tr key={h.id} className="border-b dark:border-gray-700">
              <td className="py-3">{h.name}</td>
              <td className="py-3">{h.city}</td>
              <td className="py-3">{h.rooms.length}</td>
              <td className="py-3">⭐ {h.rating.toFixed(1)}</td>
              <td className="py-3">{h.isActive ? "Active" : "Inactive"}</td>
              <td className="py-3">
                <HotelActions hotelId={h.id} isActive={h.isActive} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}