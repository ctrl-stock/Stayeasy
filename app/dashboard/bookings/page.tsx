import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BookingRow from "@/components/BookingRow";

export default async function MyBookingsPage() {
  const session = await auth();
  const bookings = await prisma.booking.findMany({
    where: { userId: session!.user!.id as string },
    include: { hotel: true, room: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}