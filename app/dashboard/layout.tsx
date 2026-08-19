import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <aside className="md:col-span-1">
        <nav className="border rounded-lg p-4 space-y-2 dark:border-gray-700">
          <Link href="/dashboard" className="block py-1.5">My Profile</Link>
          <Link href="/dashboard/bookings" className="block py-1.5">My Bookings</Link>
        </nav>
      </aside>
      <div className="md:col-span-3">{children}</div>
    </div>
  );
}