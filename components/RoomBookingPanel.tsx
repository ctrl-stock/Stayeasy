"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

export default function RoomBookingPanel({
  hotelId,
  roomId,
  pricePerNight,
  capacity,
}: {
  hotelId: string;
  roomId: string;
  pricePerNight: number;
  capacity: number;
}) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const total = nights * pricePerNight;

  function handleBookNow() {
    console.log("checkIn:", checkIn, "checkOut:", checkOut);
    setError("");

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates");
      return;
    }
    if (nights <= 0) {
      setError("Check-out must be after check-in");
      return;
    }
    if (guests > capacity) {
      setError(`This room fits up to ${capacity} guests`);
      return;
    }

    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
    });

    router.push(`/booking/${roomId}?${params.toString()}`);
  }

  return (
    <div className="border rounded-lg p-5 sticky top-6 dark:border-gray-700">
      <p className="text-2xl font-bold mb-1">${pricePerNight}<span className="text-sm font-normal text-gray-500">/night</span></p>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-500">Check-in</label>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border rounded px-3 py-2 w-full mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Check-out</label>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border rounded px-3 py-2 w-full mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Guests</label>
          <input
            type="number"
            min={1}
            max={capacity}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full mt-1"
          />
        </div>
      </div>

      {nights > 0 && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700 text-sm space-y-1">
          <div className="flex justify-between">
            <span>{nights} Nights × ${pricePerNight}</span>
            <span>${total}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-1">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleBookNow}
        className="bg-blue-600 text-white w-full py-2.5 rounded mt-5 font-medium"
      >
        Book Now
      </button>
    </div>
  );
}