import { prisma } from "@/lib/prisma";
import BookingStatusSelect from "@/components/admin/BookingStatusSelect";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { hotel: true, room: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b dark:border-gray-700">
            <th className="py-2">ID</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Hotel</th>
            <th className="py-2">Dates</th>
            <th className="py-2">Total</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b dark:border-gray-700">
              <td className="py-3">#{b.id.slice(-6).toUpperCase()}</td>
              <td className="py-3">{b.firstName} {b.lastName}</td>
              <td className="py-3">{b.hotel.name}</td>
              <td className="py-3">
                {new Date(b.checkIn).toLocaleDateString()} – {new Date(b.checkOut).toLocaleDateString()}
              </td>
              <td className="py-3">${b.total.toFixed(2)}</td>
              <td className="py-3">
                <BookingStatusSelect bookingId={b.id} status={b.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}