"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HotelActions({ hotelId, isActive }: { hotelId: string; isActive: boolean }) {
  const router = useRouter();

  async function toggleActive() {
    await fetch(`/api/admin/hotels/${hotelId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-3">
      <Link href={`/admin/hotels/${hotelId}`} className="text-blue-600">Edit</Link>
      <button onClick={toggleActive} className="text-red-500">
        {isActive ? "Hide" : "Show"}
      </button>
    </div>
  );
}