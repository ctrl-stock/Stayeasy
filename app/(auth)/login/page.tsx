"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  const res = await signIn("credentials", { email, password, redirect: false });

  if (res?.error) {
    setError("Invalid email or password");
    return;
  }

  const callbackUrl = searchParams.get("callbackUrl");
  const redirectPath = callbackUrl ? new URL(callbackUrl).pathname : "/dashboard";
  router.push(redirectPath);
  router.refresh();
}
  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 flex flex-col gap-3">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} className="border rounded px-3 py-2" required />
      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} className="border rounded px-3 py-2" required />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">Login</button>
    </form>
  );
}