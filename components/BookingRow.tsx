"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-gray-100 text-gray-800",
};

export default function BookingRow({ booking }: { booking: any }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    const res = await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 dark:border-gray-700">
      <div>
        <p className="font-semibold">{booking.hotel.name}</p>
        <p className="text-sm text-gray-500">
          {booking.room.type} · {new Date(booking.checkIn).toLocaleDateString()} –{" "}
          {new Date(booking.checkOut).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-medium">${booking.total.toFixed(2)}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[booking.status]}`}>
          {booking.status}
        </span>

        {booking.status === "CONFIRMED" || booking.status === "PENDING" ? (
          confirming ? (
            <div className="flex items-center gap-2 text-sm">
              <span>Cancel this booking?</span>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="text-red-600 font-medium"
              >
                {loading ? "..." : "Yes"}
              </button>
              <button onClick={() => setConfirming(false)} className="text-gray-500">
                No
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} className="text-red-500 text-sm">
              Cancel
            </button>
          )
        ) : null}
      </div>
    </div>
  );
}