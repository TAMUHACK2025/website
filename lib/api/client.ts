import { API_CONFIG } from '../config/api.config';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // If the endpoint starts with /api, it's an internal API call
  const url = endpoint.startsWith('/api') 
    ? endpoint 
    : `${API_CONFIG.BASE_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}