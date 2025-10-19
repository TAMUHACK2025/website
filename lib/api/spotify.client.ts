import { SpotifyClient } from './spotify';

// Export singleton instance
const spotifyClientInstance = new SpotifyClient();
export const spotifyClient = spotifyClientInstance;