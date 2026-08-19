"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    minPrice ? params.set("minPrice", minPrice) : params.delete("minPrice");
    maxPrice ? params.set("maxPrice", maxPrice) : params.delete("maxPrice");
    minRating ? params.set("minRating", minRating) : params.delete("minRating");
    sort ? params.set("sort", sort) : params.delete("sort");
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="border rounded-lg p-4 space-y-4 dark:border-gray-700">
      <h3 className="font-semibold">Filters</h3>

      <div>
        <label className="text-sm text-gray-500">Price range</label>
        <div className="flex gap-2 mt-1">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-500">Min Rating</label>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="border rounded px-2 py-1 w-full mt-1"
        >
          <option value="">Any</option>
          <option value="3">3+ ⭐</option>
          <option value="4">4+ ⭐</option>
          <option value="4.5">4.5+ ⭐</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-500">Sort by</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-2 py-1 w-full mt-1"
        >
          <option value="">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <button onClick={applyFilters} className="bg-blue-600 text-white w-full py-2 rounded">
        Apply Filters
      </button>
    </div>
  );
}