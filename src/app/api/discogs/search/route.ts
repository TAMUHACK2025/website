import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'release';
  const format = searchParams.get('format');
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '12';

  // TEMPORARY HARDCODE
  const token = "stHaLWMkoEpmIqybaoOEhYWXXuQVacRYnnheIyTS";

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      q: query,
      type: type,
      page: page,
      per_page: perPage,
    });

    if (format) {
      params.append('format', format);
    }

    const response = await fetch(`https://api.discogs.com/database/search?${params}`, {
      headers: {
        'Authorization': `Discogs token=${token}`,
        'User-Agent': 'ResonateApp/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Discogs API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Discogs API failed:', error);
    return NextResponse.json({ error: 'Failed to search Discogs' }, { status: 500 });
  }
}