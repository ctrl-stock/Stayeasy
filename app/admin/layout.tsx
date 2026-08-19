import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  console.log("SESSION IN ADMIN LAYOUT:", JSON.stringify(session, null, 2));    
  if (session?.user?.role !== "ADMIN") redirect("/");

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
      <aside className="md:col-span-1">
        <nav className="border rounded-lg p-4 space-y-2 dark:border-gray-700">
          <Link href="/admin" className="block py-1.5">Overview</Link>
          <Link href="/admin/hotels" className="block py-1.5">Hotels</Link>
          <Link href="/admin/rooms" className="block py-1.5">Rooms</Link>
          <Link href="/admin/bookings" className="block py-1.5">Bookings</Link>
        </nav>
      </aside>
      <div className="md:col-span-4">{children}</div>
    </div>
  );
}