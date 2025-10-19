import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 })
  }

  const token = process.env.DISCOGS_TOKEN
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.discogs.com'
  
  // Add sort=want to get most popular releases first, and format=album to focus on main releases
  // Simple search with artist name
  const url = `${baseUrl}/database/search?artist=${encodeURIComponent(query)}&format=album&type=master&sort=want&per_page=12`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Discogs token=${token}`,
      'User-Agent': 'MyDiscogsApp/1.0',
    },
  })

  if (!response.ok) {
    console.error('Discogs API error:', response.status);
    return NextResponse.json({ error: 'Failed to fetch from Discogs' }, { status: response.status });
  }

  const data = await response.json();
  console.log('Discogs search response:', JSON.stringify(data, null, 2));
  
  if (!data.results || data.results.length === 0) {
    console.log('No results found for query:', query);
    return NextResponse.json({ results: [] });
  }

  // Normalize the data and filter out results that don't match the artist
  const albums = data.results
    .filter((item: any) => {
      const itemTitle = item.title.toLowerCase();
      const searchQuery = query.toLowerCase();
      return itemTitle.includes(searchQuery) || (item.artist && item.artist.toLowerCase().includes(searchQuery));
    })
    .map((item: any) => ({
      id: item.id,
      title: item.title,
      year: item.year?.toString() || 'N/A',
      type: Array.isArray(item.format) ? item.format.join(", ") : item.format || "Album",
      cover_image: item.cover_image || item.thumb,
      thumb: item.thumb || item.cover_image,
      formats: item.format ? [{ name: item.format }] : undefined
    }));

  console.log('Processed albums:', albums);
  return NextResponse.json({ results: albums });
}