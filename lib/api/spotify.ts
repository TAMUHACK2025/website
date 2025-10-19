import { SPOTIFY_CONFIG } from '../config/api.config';

class SpotifyClient {
  private accessToken: string | null = null;

  private async getAccessToken() {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new Error('Spotify credentials not configured');
    }

    const response = await fetch(SPOTIFY_CONFIG.tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get Spotify access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    return this.accessToken;
  }

  async fetch(endpoint: string, options: RequestInit = {}) {
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
}

export const spotifyClient = new SpotifyClient();