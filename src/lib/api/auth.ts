// Simple Spotify auth client
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID ?? '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET ?? '';
const SPOTIFY_REDIRECT_URI = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/auth/callback'
  : 'https://your-production-domain.com/api/auth/callback';

class SpotifyAuthClient {
  private generateRandomString(length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  getAuthUrl() {
    const state = this.generateRandomString(16);
    const scope = 'user-read-private user-read-email user-top-read user-library-read';

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: state
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async getAccessToken(code: string) {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    return response.json();
  }
}

export const spotifyAuthClient = new SpotifyAuthClient();

export const handleCallback = async (code: string) => {
  return await spotifyAuthClient.getAccessToken(code);
};