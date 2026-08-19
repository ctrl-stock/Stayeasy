import { prisma } from "@/lib/prisma";
import Link from "next/link";
import RoomActions from "@/components/admin/RoomActions";

export default async function AdminRoomsPage() {
  const rooms = await prisma.room.findMany({
    include: { hotel: true },
    orderBy: { hotel: { name: "asc" } },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <Link href="/admin/rooms/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Room
        </Link>
      </div>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b dark:border-gray-700">
            <th className="py-2">Hotel</th>
            <th className="py-2">Room Type</th>
            <th className="py-2">Price/Night</th>
            <th className="py-2">Capacity</th>
            <th className="py-2">Total Rooms</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id} className="border-b dark:border-gray-700">
              <td className="py-3">{r.hotel.name}</td>
              <td className="py-3">{r.type}</td>
              <td className="py-3">${r.pricePerNight}</td>
              <td className="py-3">{r.capacity} guests</td>
              <td className="py-3">{r.totalRooms}</td>
              <td className="py-3">{r.isActive ? "Visible" : "Hidden"}</td>
              <td className="py-3">
                <RoomActions roomId={r.id} isActive={r.isActive} />
              </td>
            </tr>
          ))}
          {rooms.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-gray-500">
                No rooms yet. Add your first one.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}