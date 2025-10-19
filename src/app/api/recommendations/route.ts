import { NextRequest, NextResponse } from 'next/server';
import { spotifyAuthClient } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';

export async function GET(request: NextRequest) {
  if (!spotifyAuthClient.isAuthenticated()) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Get user's top tracks from Spotify
    const topTracks = await spotifyAuthClient.getUserTopItems();
    
    // Use the top tracks to search for similar items on Discogs
    const recommendations = await Promise.all(
      topTracks.items.slice(0, 5).map(async (track: any) => {
        const query = `${track.artists[0].name} ${track.name}`;
        const searchUrl = `/database/search?${new URLSearchParams({
            q: query,
            type: 'release',
            format: 'album',
          }).toString()}`;
          
        const response = await apiClient<any>(searchUrl);

        if (!response || !response.results) {
          throw new Error('Invalid response from Discogs API');
        }
        return response.results[0]; // Get the most relevant match
      })
    );

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}