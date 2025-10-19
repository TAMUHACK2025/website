import { SPOTIFY_CONFIG } from '../config/api.config';
import { ApiError } from '../types/api.types';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    name: string;
  }>;
  album: {
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
}

export interface FormattedTrackResult {
  id: string;
  title: string;
  type: 'track';
  thumb: string;
  cover_image: string;
  year: string;
  artist: string;
}

class SpotifyClient {
  private accessToken: string | null = null;

  private async getAccessToken(): Promise<string> {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new ApiError('Spotify credentials not configured', 500);
    }

    if (this.accessToken) {
      return this.accessToken;
    }

    console.log('Requesting Spotify access token...');
    
    try {
      const authString = Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64');

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials'
        }).toString()
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Failed to get Spotify token:', {
          status: response.status,
          statusText: response.statusText,
          error: error
        });
        throw new ApiError(`Failed to get token: ${response.status} ${error}`, response.status);
      }

      const data = await response.json() as SpotifyTokenResponse;
      this.accessToken = data.access_token;
      console.log('Successfully got Spotify token');
      return data.access_token;
    } catch (error) {
      console.error('Token request failed:', error);
      throw new ApiError('Failed to authenticate with Spotify', 500);
    }
  }

  async fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    const response = await fetch(`${SPOTIFY_CONFIG.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    // If token expired, retry once with new token
    if (response.status === 401) {
      this.accessToken = null;
      await this.getAccessToken();
      return this.fetch(endpoint, options);
    }

    return response;
  }

  async search(query: string): Promise<{ results: FormattedTrackResult[] }> {
    if (!query) {
      throw new ApiError('Search query is required', 400);
    }
    
    try {
      const searchResponse = await this.fetch(
        `/search?${new URLSearchParams({
          q: query,
          type: 'track',
          limit: '10'
        })}`, 
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!searchResponse.ok) {
        const error = await searchResponse.json() as SpotifyError;
        throw new ApiError(`Spotify API error: ${error.error.message}`, searchResponse.status);
      }

      const data = await searchResponse.json() as SpotifySearchResponse;
      
      // Format the response to match the expected structure
      const formattedResults = data.tracks.items.map(track => ({
        id: track.id,
        title: track.name,
        type: 'track' as const,
        thumb: track.album.images[2]?.url || '', // smallest image
        cover_image: track.album.images[0]?.url || '', // largest image
        year: new Date().getFullYear().toString(), // Spotify doesn't provide year in search
        artist: track.artists.map(a => a.name).join(', ')
      }));

      return { results: formattedResults };
    } catch (error) {
      console.error('Spotify search error:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Failed to search Spotify', 500);
    }
  }
}

// Create and export singleton instance
export const spotifyClient = new SpotifyClient();