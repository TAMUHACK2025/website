import { NextRequest } from "next/server";

const BASE = "https://api.discogs.com";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const format = req.nextUrl.searchParams.get("format") || ""; // e.g., "Vinyl" or "CD"
  if (!q) return new Response(JSON.stringify({ error: "Missing q" }), { status: 400 });

  const params = new URLSearchParams({
    q,
    type: "release",          // release, master, artist, label
    per_page: "12",
    page: "1",
  });
  if (format) params.set("format", format);

  const res = await fetch(`${BASE}/database/search?${params.toString()}`, {
    headers: {
      // Both headers below are important:
      "User-Agent": process.env.DISCOGS_APP_ID || "HackathonMusicFinder/1.0",
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
    },
    // no-store so dev results stay fresh
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: `Discogs error ${res.status}: ${text}` }), { status: 500 });
  }

  const data = await res.json();
  // normalize a bit for the UI
  const items = (data.results || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    year: r.year,
    country: r.country,
    cover: r.cover_image,
    format: r.format?.join(", "),
    catno: r.catno,
    style: r.style,
    genre: r.genre,
    // links we can build easily:
    discogsWebUrl: r.uri ? `https://www.discogs.com${r.uri}` : undefined,
    buyDiscogsSearch: `https://www.discogs.com/search/?q=${encodeURIComponent(r.title)}&type=release&format=${encodeURIComponent(format || "Vinyl,CD")}`,
    buyEbay: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(r.title + " " + (format || ""))}`,
    buyAmazon: `https://www.amazon.com/s?k=${encodeURIComponent(r.title + " " + (format || ""))}`,
  }));

  return Response.json({ items });
}