"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BookingForm({
  roomId,
  checkIn,
  checkOut,
  guests,
}: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    phone: "",
    specialRequests: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, roomId, checkIn, checkOut, guests }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push(`/booking/confirmation/${data.id}`);
    } else {
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
      </div>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border rounded px-3 py-2 w-full"
        required
      />
      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="border rounded px-3 py-2 w-full"
        required
      />
      <textarea
        placeholder="Special Requests (optional)"
        value={form.specialRequests}
        onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
        className="border rounded px-3 py-2 w-full"
        rows={3}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium disabled:opacity-50"
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}