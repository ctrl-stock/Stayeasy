"use client";
import { useRouter } from "next/navigation";

export default function BookingStatusSelect({ bookingId, status }: { bookingId: string; status: string }) {
  const router = useRouter();

  async function updateStatus(newStatus: string) {
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={(e) => updateStatus(e.target.value)}
      className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700"
    >
      <option value="PENDING">Pending</option>
      <option value="CONFIRMED">Confirmed</option>
      <option value="CANCELLED">Cancelled</option>
      <option value="COMPLETED">Completed</option>
    </select>
  );
}