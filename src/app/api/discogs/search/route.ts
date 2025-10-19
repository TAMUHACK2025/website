import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/discogs/search?q=...
 * Accepts optional params: type, format, page, per_page
 */
export async function GET(request: NextRequest) {
  // support both request.nextUrl.searchParams and URL fallback
  const searchParams = request.nextUrl?.searchParams ?? new URL(request.url).searchParams
  const query = searchParams.get('q')
  const type = searchParams.get('type') || 'release'
  const format = searchParams.get('format')
  const page = searchParams.get('page') || '1'
  const per_page = searchParams.get('per_page') || '12'

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 })
  }

  const token = process.env.DISCOGS_TOKEN ?? 'stHaLWMkoEpmIqybaoOEhYWXXuQVacRYnnheIyTS'
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.discogs.com'

  const params = new URLSearchParams({
    q: query,
    type,
    page,
    per_page,
  })

  if (format) params.append('format', format)

  const url = `${baseUrl}/database/search?${params.toString()}`

  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Discogs token=${token}`,
        'User-Agent': 'ResonateApp/1.0',
      },
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error('Discogs API error:', res.status, body)
      return NextResponse.json({ error: 'Failed to fetch from Discogs' }, { status: res.status })
    }

    const data = await res.json()

    const albums = (data.results ?? []).map((item: any) => ({
      id: item.id,
      title: item.title,
      year: item.year?.toString() || 'N/A',
      type: Array.isArray(item.format) ? item.format.join(', ') : item.format || 'Album',
      cover_image: item.cover_image || item.thumb,
      thumb: item.thumb || item.cover_image,
      formats: item.format ? [{ name: item.format }] : undefined,
    }))

    return NextResponse.json({ results: albums })
  } catch (err) {
    console.error('Discogs API failed:', err)
    return NextResponse.json({ error: 'Failed to search Discogs' }, { status: 500 })
  }
}