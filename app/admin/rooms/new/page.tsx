import { prisma } from "@/lib/prisma";
import RoomForm from "@/components/admin/RoomForm";

export default async function NewRoomPage() {
  const hotels = await prisma.hotel.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Room</h1>
      <RoomForm hotels={hotels} />
    </div>
  );
}