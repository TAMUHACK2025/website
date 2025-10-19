import { SPOTIFY_CONFIG } from '../config/api.config';

class SpotifyAuthClient {
  private static instance: SpotifyAuthClient;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {}

  static getInstance(): SpotifyAuthClient {
    if (!SpotifyAuthClient.instance) {
      SpotifyAuthClient.instance = new SpotifyAuthClient();
    }
    return SpotifyAuthClient.instance;
  }

  getLoginURL(): string {
    const scope = 'user-top-read user-library-read';
    return `${SPOTIFY_CONFIG.authURL}?` +
      new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        scope,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      }).toString();
  }

  async handleCallback(code: string) {
    const response = await fetch(SPOTIFY_CONFIG.tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
    };
  }

  async getAccessToken(code: string) {
    return this.handleCallback(code);
    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
    };
  }

  async getUserTopItems() {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${SPOTIFY_CONFIG.baseURL}/me/top/tracks?limit=5&time_range=medium_term`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }

    return response.json();
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const spotifyAuthClient = SpotifyAuthClient.getInstance();