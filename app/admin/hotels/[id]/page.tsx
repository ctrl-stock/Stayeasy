import { prisma } from "@/lib/prisma";
import HotelForm from "@/components/admin/HotelForm";
import { notFound } from "next/navigation";

export default async function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hotel = await prisma.hotel.findUnique({ where: { id } });
  if (!hotel) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Hotel</h1>
      <HotelForm hotel={hotel} />
    </div>
  );
}