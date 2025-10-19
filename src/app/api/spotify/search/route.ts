import { NextRequest, NextResponse } from 'next/server';
import { spotifyClient } from '@/lib/api/spotify.client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  try {
    const { results } = await spotifyClient.search(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Spotify search error:', error);
    const status = error instanceof Error ? 500 : 500;
    return NextResponse.json(
      { error: 'Failed to fetch from Spotify' },
      { status }
    );
  }
}