const DISCOGS_BASE_URL = '/api/discogs'; // No /search

export interface DiscogsRelease {
  id: number;
  title: string;
  artist: string;
  year: number;
  cover_image: string;
  format: string[];
  genre: string[];
  style: string[];
}

export interface DiscogsSearchResponse {
  results: DiscogsRelease[];
  pagination: {
    items: number;
    page: number;
    pages: number;
  };
}

export async function searchDiscogs(query: string, page: number = 1, perPage: number = 20): Promise<DiscogsSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    per_page: perPage.toString(),
  });

  // Call /api/discogs (NOT /api/discogs/search)
  const response = await fetch(`${DISCOGS_BASE_URL}?${params}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to search Discogs');
  }

  return response.json();
}