"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HotelForm({ hotel }: { hotel?: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: hotel?.name || "",
    description: hotel?.description || "",
    city: hotel?.city || "",
    location: hotel?.location || "",
    rating: hotel?.rating || "",
    amenities: hotel?.amenities?.join(", ") || "",
    images: hotel?.images?.join(", ") || "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      rating: Number(form.rating) || 0,
      amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
      images: form.images.split(",").map((i) => i.trim()).filter(Boolean),
    };

    const url = hotel ? `/api/admin/hotels/${hotel.id}` : "/api/admin/hotels";
    const method = hotel ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (res.ok) router.push("/admin/hotels");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <input
        placeholder="Hotel Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
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
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="border rounded px-3 py-2"
          required
        />
        <input
          placeholder="Rating (0-5)"
          type="number"
          step="0.1"
          min="0"
          max="5"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
          className="border rounded px-3 py-2"
        />
      </div>
      <input
        placeholder="Location / Address"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        className="border rounded px-3 py-2 w-full"
        required
      />
      <input
        placeholder="Amenities (comma separated)"
        value={form.amenities}
        onChange={(e) => setForm({ ...form, amenities: e.target.value })}
        className="border rounded px-3 py-2 w-full"
      />
      <input
        placeholder="Image URLs (comma separated)"
        value={form.images}
        onChange={(e) => setForm({ ...form, images: e.target.value })}
        className="border rounded px-3 py-2 w-full"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2.5 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : hotel ? "Update Hotel" : "Create Hotel"}
      </button>
    </form>
  );
}