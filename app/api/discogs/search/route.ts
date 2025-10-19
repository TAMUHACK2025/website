import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 })
  }

  const token = process.env.DISCOGS_TOKEN
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.discogs.com'
  
  const url = `${baseUrl}/database/search?q=${encodeURIComponent(query)}&type=release`
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Discogs token=${token}`,
      'User-Agent': 'MyDiscogsApp/1.0',
    },
  })

  const data = await response.json()
  return NextResponse.json(data)
}