import { prisma } from "@/lib/prisma";
import RoomForm from "@/components/admin/RoomForm";
import { notFound } from "next/navigation";

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) notFound();

  const hotels = await prisma.hotel.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Room</h1>
      <RoomForm room={room} hotels={hotels} />
    </div>
  );
}