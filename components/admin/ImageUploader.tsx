"use client";
import { useState } from "react";
import Image from "next/image";

export default function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");

    try {
      const sigRes = await fetch("/api/admin/upload", { method: "POST" });
      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", folder);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      }

      onChange([...images, ...uploadedUrls]);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    onChange(images.filter((i) => i !== url));
  }

  return (
    <div>
      <label className="text-sm text-gray-500">Images</label>

      <div className="flex flex-wrap gap-3 mt-2 mb-3">
        {images.map((url) => (
          <div key={url} className="relative w-24 h-24 rounded overflow-hidden border dark:border-gray-700">
            <Image src={url} alt="uploaded" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-0 right-0 bg-black/60 text-white text-xs w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
        className="text-sm"
      />
      {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}