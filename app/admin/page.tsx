import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [totalHotels, totalRooms, totalBookings, totalUsers, revenueAgg] = await Promise.all([
    prisma.hotel.count(),
    prisma.room.count(),
    prisma.booking.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.booking.aggregate({
      where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
      _sum: { total: true },
    }),
  ]);

  const stats = [
    { label: "Total Hotels", value: totalHotels },
    { label: "Total Rooms", value: totalRooms },
    { label: "Total Bookings", value: totalBookings },
    { label: "Total Users", value: totalUsers },
    { label: "Revenue", value: `$${(revenueAgg._sum.total ?? 0).toFixed(2)}` },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border rounded-lg p-4 dark:border-gray-700">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}