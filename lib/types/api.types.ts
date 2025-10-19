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