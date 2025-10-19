import { NextRequest, NextResponse } from 'next/server';
import { spotifyClient } from '@/lib/api/spotify';

// Type definitions
interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  release_date: string;
  images: Array<{ url: string }>;
  external_urls: { spotify: string };
}

interface DiscogsResult {
  id: number;
  type: string;
  title: string;
  master_url?: string;
  resource_url?: string;
  uri?: string;
}

interface AlbumResult {
  id: string;
  title: string;
  artist: string;
  albumTitle: string;
  year: string;
  type: string;
  cover_image: string;
  thumb: string;
  spotify_url: string;
  discogs_url: string | null;
  formats: Array<{ name: string }>;
}

// Helper function to find a matching album on Discogs
const findDiscogsMatch = async (
  artist: string, 
  albumTitle: string, 
  year: string
): Promise<DiscogsResult | null> => {
  const token = process.env.DISCOGS_TOKEN;
  if (!token) {
    console.warn('No Discogs token configured');
    return null;
  }

  const baseUrl = 'https://api.discogs.com';
  const query = `${artist} ${albumTitle}`.trim();
  
  try {
    const searchUrl = `${baseUrl}/database/search?q=${encodeURIComponent(query)}&type=master,release&format=album&year=${year}`;
    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Discogs token=${token}`,
        'User-Agent': 'MyDiscogsApp/1.0'
      }
    });

    if (!response.ok) {
      console.error('Discogs API error:', response.status);
      return null;
    }

    const data = await response.json();
    if (!data.results?.length) {
      return null;
    }

    // Try to find the best match - prefer master releases
    const masterMatch = data.results.find((item: DiscogsResult) => 
      item.type === 'master' && 
      item.title.toLowerCase().includes(artist.toLowerCase()) && 
      item.title.toLowerCase().includes(albumTitle.toLowerCase())
    );

    if (masterMatch) {
      return masterMatch;
    }

    // Fall back to any matching release
    return data.results.find((item: DiscogsResult) => {
      const itemTitle = item.title.toLowerCase();
      return itemTitle.includes(artist.toLowerCase()) && 
             itemTitle.includes(albumTitle.toLowerCase());
    }) || data.results[0];
  } catch (error) {
    console.error('Discogs match error:', error);
    return null;
  }
};

// API Route handler
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query required' }, 
      { status: 400 }
    );
  }

  try {
    console.log('Starting search for:', query);
    
    // Search with Spotify
    console.log('Getting Spotify token...');
    
    // Ensure we have a valid token
    const spotifyResponse = await spotifyClient.fetch(
      `/search?q=${encodeURIComponent(query)}&type=album&limit=12`
    );

    if (!spotifyResponse.ok) {
      console.error('Spotify API error:', spotifyResponse.status);
      const errorData = await spotifyResponse.json().catch(() => ({}));
      console.error('Spotify error details:', errorData);
      throw new Error(`Spotify API error: ${spotifyResponse.status}`);
    }

    const spotifyData = await spotifyResponse.json();
    console.log('Spotify search response:', spotifyData);
    if (!spotifyData.albums?.items) {
      console.log('No results from Spotify');
      return NextResponse.json({ results: [] });
    }

    console.log('Found', spotifyData.albums.items.length, 'albums on Spotify');

    // Process Spotify results and find Discogs matches
    const spotifyAlbums = spotifyData.albums.items as SpotifyAlbum[];
    const results = await Promise.all(
      spotifyAlbums.map(async (album): Promise<AlbumResult> => {
        const artist = album.artists[0]?.name || '';
        const year = new Date(album.release_date).getFullYear().toString();
        
        // Find matching album on Discogs
        console.log('Searching Discogs for:', artist, '-', album.name);
        const discogsMatch = await findDiscogsMatch(artist, album.name, year);

        return {
          id: album.id,
          title: `${artist} - ${album.name}`,
          artist,
          albumTitle: album.name,
          year,
          type: 'Album',
          cover_image: album.images[0]?.url || '',
          thumb: album.images[1]?.url || album.images[0]?.url || '',
          spotify_url: album.external_urls.spotify,
          discogs_url: discogsMatch ? 
            `https://www.discogs.com/${discogsMatch.type}/${discogsMatch.id}` : 
            null,
          formats: [{ name: 'Album' }]
        };
      })
    );

    console.log('Search complete:', results.length, 'results with Discogs matches');
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' }, 
      { status: 500 }
    );
  }
}