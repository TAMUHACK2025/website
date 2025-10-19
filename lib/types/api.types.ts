export class ApiError extends Error {
  constructor(message: string, public status: number = 500) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface DiscogsSearchResult {
  id: number
  title: string
  type: string
  thumb: string
  cover_image: string
  year?: string
}

export interface DiscogsSearchResponse {
  results: DiscogsSearchResult[]
  pagination: {
    page: number
    pages: number
    items: number
  }
}