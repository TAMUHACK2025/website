"use client";
import { useState } from "react";

type Item = {
  id: number;
  title: string;
  year?: number;
  country?: string;
  cover?: string;
  format?: string;
  discogsWebUrl?: string;
  buyDiscogsSearch: string;
  buyEbay: string;
  buyAmazon: string;
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [format, setFormat] = useState<"Vinyl" | "CD" | "">("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState("");

  async function doSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true); setErr(""); setItems([]);
    try {
      const url = `/api/discogs/search?q=${encodeURIComponent(q)}${format ? `&format=${format}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Search failed");
      setItems(data.items || []);
    } catch (e: any) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Find Physical Copies (Discogs)</h1>
      <form onSubmit={doSearch} className="flex flex-wrap gap-2">
        <input
          className="border rounded-lg px-4 py-2 flex-1 min-w-[260px]"
          placeholder="Search song, album, or artist"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="border rounded-lg px-3 py-2"
          value={format}
          onChange={(e) => setFormat(e.target.value as any)}
        >
          <option value="">Any format</option>
          <option value="Vinyl">Vinyl</option>
          <option value="CD">CD</option>
        </select>
        <button className="bg-black text-white px-4 py-2 rounded-lg" type="submit">
          Search
        </button>
      </form>

      {loading && <p>Loading…</p>}
      {err && <p className="text-red-600">{err}</p>}

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <article key={it.id} className="border rounded-xl p-4 bg-white">
            {it.cover && <img src={it.cover} alt={it.title} className="rounded-lg mb-3 w-full" />}
            <h2 className="font-semibold">{it.title}</h2>
            <p className="text-sm text-gray-600">
              {[it.year, it.country, it.format].filter(Boolean).join(" • ")}
            </p>
            <div className="mt-3 grid gap-2">
              {it.discogsWebUrl && (
                <a href={it.discogsWebUrl} target="_blank" className="text-blue-600 underline">
                  View on Discogs
                </a>
              )}
              <a href={it.buyDiscogsSearch} target="_blank" className="text-blue-600 underline">
                Buy on Discogs (search)
              </a>
              <a href={it.buyEbay} target="_blank" className="text-blue-600 underline">
                Buy on eBay
              </a>
              <a href={it.buyAmazon} target="_blank" className="text-blue-600 underline">
                Buy on Amazon
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

