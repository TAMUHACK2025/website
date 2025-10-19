import { NextRequest, NextResponse } from 'next/server';
import { spotifyClient } from '@/lib/api/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  try {
    const response = await spotifyClient.fetch(
      `/search?q=${encodeURIComponent(query)}&type=album&limit=12`
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Normalize the albums to match our interface
    const albums = data.albums.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      year: new Date(item.release_date).getFullYear().toString(),
      type: 'Album',
      cover_image: item.images[0]?.url,
      thumb: item.images[1]?.url || item.images[0]?.url,
      artist: item.artists[0]?.name,
      spotify_url: item.external_urls.spotify,
    }));

    return NextResponse.json({ results: albums });
  } catch (error) {
    console.error('Spotify search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Spotify' },
      { status: 500 }
    );
  }
}