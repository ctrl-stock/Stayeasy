"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RoomActions({ roomId, isActive }: { roomId: string; isActive: boolean }) {
  const router = useRouter();

  async function toggleActive() {
    await fetch(`/api/admin/rooms/${roomId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-3">
      <Link href={`/admin/rooms/${roomId}`} className="text-blue-600">Edit</Link>
      <button onClick={toggleActive} className="text-red-500">
        {isActive ? "Hide" : "Show"}
      </button>
    </div>
  );
}