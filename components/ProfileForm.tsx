"use client";
import { useState } from "react";

export default function ProfileForm({
  name,
  email,
  phone,
}: {
  name: string;
  email: string;
  phone: string;
}) {
  const [form, setForm] = useState({ name, phone });
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSave() {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("Saved");
      setEditing(false);
    } else {
      setStatus("Failed to save");
    }
  }

  return (
    <div className="border rounded-lg p-6 dark:border-gray-700 space-y-4 max-w-md">
      {status && <p className="text-sm text-green-600">{status}</p>}

      <div>
        <label className="text-sm text-gray-500">Name</label>
        <input
          value={form.name}
          disabled={!editing}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-3 py-2 w-full mt-1 disabled:bg-gray-100 dark:disabled:bg-gray-800"
        />
      </div>
      <div>
        <label className="text-sm text-gray-500">Email</label>
        <input value={email} disabled className="border rounded px-3 py-2 w-full mt-1 bg-gray-100 dark:bg-gray-800" />
      </div>
      <div>
        <label className="text-sm text-gray-500">Phone</label>
        <input
          value={form.phone}
          disabled={!editing}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border rounded px-3 py-2 w-full mt-1 disabled:bg-gray-100 dark:disabled:bg-gray-800"
        />
      </div>

      {editing ? (
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      ) : (
        <button onClick={() => setEditing(true)} className="border px-4 py-2 rounded dark:border-gray-700">
          Edit Profile
        </button>
      )}
    </div>
  );
}