"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  function handleSearch() {
    const params = new URLSearchParams({ city, checkIn, checkOut, guests: String(guests) });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="bg-white text-gray-900 rounded-xl p-4 flex flex-wrap gap-3 shadow-lg">
      <input
        placeholder="Destination"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border rounded px-3 py-2 flex-1 min-w-[150px]"
      />
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        type="number"
        min={1}
        value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}
        className="border rounded px-3 py-2 w-20"
      />
      <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded font-medium">
        Search
      </button>
    </div>
  );
}