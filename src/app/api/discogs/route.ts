import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '20';
  const format = searchParams.get('format');
  
  const token = "stHaLWMkoEpmIqybaoOEhYWXXuQVacRYnnheIyTS";

  if (!token) {
    return NextResponse.json({ error: 'Discogs token not configured' }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({
      type: 'release',
      page: page,
      per_page: perPage,
    });

    // Add query if provided, otherwise get random vinyl
    if (query) {
      params.append('q', query);
    } else {
      // For random vinyl, search for popular terms or get recent additions
      const randomTerms = ['rock', 'jazz', 'electronic', 'classical', 'hip+hop', 'pop'];
      const randomTerm = randomTerms[Math.floor(Math.random() * randomTerms.length)];
      params.append('q', randomTerm);
    }

    // Add format filter if provided
    if (format) {
      params.append('format', format);
    }

    console.log('🌐 Calling Discogs with params:', params.toString());

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