"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

export default function RoomForm({
  room,
  hotels,
}: {
  room?: any;
  hotels: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    hotelId: room?.hotelId || hotels[0]?.id || "",
    type: room?.type || "",
    description: room?.description || "",
    pricePerNight: room?.pricePerNight || "",
    capacity: room?.capacity || 2,
    bedType: room?.bedType || "",
    sizeSqm: room?.sizeSqm || "",
    amenities: room?.amenities?.join(", ") || "",
    totalRooms: room?.totalRooms || 1,
  });
  const [images, setImages] = useState<string[]>(room?.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      pricePerNight: Number(form.pricePerNight),
      capacity: Number(form.capacity),
      sizeSqm: form.sizeSqm ? Number(form.sizeSqm) : null,
      totalRooms: Number(form.totalRooms),
      amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
      images,
    };

    const url = room ? `/api/admin/rooms/${room.id}` : "/api/admin/rooms";
    const method = room ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (res.ok) {
      router.push("/admin/rooms");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="text-sm text-gray-500">Hotel</label>
        <select
          value={form.hotelId}
          onChange={(e) => setForm({ ...form, hotelId: e.target.value })}
          className="border rounded px-3 py-2 w-full mt-1"
          required
        >
          {hotels.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      <input
        placeholder="Room Type (e.g. Deluxe Double Room)"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        className="border rounded px-3 py-2 w-full"
        required
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border rounded px-3 py-2 w-full"
        rows={3}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500">Price / Night ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.pricePerNight}
            onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })}
            className="border rounded px-3 py-2 w-full mt-1"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Capacity (guests)</label>
          <input
            type="number"
            min="1"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            className="border rounded px-3 py-2 w-full mt-1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500">Bed Type</label>
          <input
            placeholder="e.g. 1 King Bed"
            value={form.bedType}
            onChange={(e) => setForm({ ...form, bedType: e.target.value })}
            className="border rounded px-3 py-2 w-full mt-1"
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Size (m²) — optional</label>
          <input
            type="number"
            min="0"
            value={form.sizeSqm}
            onChange={(e) => setForm({ ...form, sizeSqm: e.target.value })}
            className="border rounded px-3 py-2 w-full mt-1"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-500">Total Rooms Available (inventory)</label>
        <input
          type="number"
          min="1"
          value={form.totalRooms}
          onChange={(e) => setForm({ ...form, totalRooms: e.target.value })}
          className="border rounded px-3 py-2 w-full mt-1"
          required
        />
      </div>

      <input
        placeholder="Amenities (comma separated, e.g. Wi-Fi, Breakfast included, Minibar)"
        value={form.amenities}
        onChange={(e) => setForm({ ...form, amenities: e.target.value })}
        className="border rounded px-3 py-2 w-full"
      />

      <ImageUploader images={images} onChange={setImages} />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2.5 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : room ? "Update Room" : "Create Room"}
      </button>
    </form>
  );
}