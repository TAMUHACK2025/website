const PORT = 8080;

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.discogs.com',
  TIMEOUT: 10000,
}

export const SPOTIFY_CONFIG = {
  baseURL: 'https://api.spotify.com/v1',
  authURL: 'https://accounts.spotify.com/authorize',
  tokenURL: 'https://accounts.spotify.com/api/token',
  redirectURI: process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}/api/auth/callback`
    : `http://localhost:${PORT}/api/auth/callback`,
}