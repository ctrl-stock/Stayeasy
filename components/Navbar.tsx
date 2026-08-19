"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-white dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">🏨 StayEasy</Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              {session.user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
              <button onClick={() => signOut()} className="text-sm text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}