"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords don't match");
      return;
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/login");
    else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 flex flex-col gap-3">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input placeholder="Name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded px-3 py-2" required />
      <input type="email" placeholder="Email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} className="border rounded px-3 py-2" required />
      <input type="password" placeholder="Password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} className="border rounded px-3 py-2" required />
      <input type="password" placeholder="Confirm Password" value={form.confirm}
        onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="border rounded px-3 py-2" required />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">Register</button>
    </form>
  );
}