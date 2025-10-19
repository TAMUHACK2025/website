import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = process.env.DISCOGS_TOKEN
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.discogs.com'
  
  // Get popular releases by sorting by community stats and limiting to vinyl format
  const url = `${baseUrl}/database/search?sort=hot&sort_order=desc&format=vinyl&per_page=12`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Discogs token=${token}`,
      'User-Agent': 'MyDiscogsApp/1.0',
    },
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch featured albums' }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}