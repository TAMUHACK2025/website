import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = process.env.DISCOGS_TOKEN;
    if (!token) {
      console.error('No Discogs token found in environment variables');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }
    
    const baseUrl = 'https://api.discogs.com';
    
    // Using a simpler query to ensure we get results
    const url = `${baseUrl}/database/search?format=Vinyl&sort=want&per_page=12`;
    
    console.log('Fetching featured albums from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Discogs token=${token}`,
        'User-Agent': 'ResonateApp/1.0 +http://yourdomain.com',
        'Accept': 'application/json'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch featured albums' }, { status: response.status })
  }

    if (!response.ok) {
      console.error('Discogs API error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch featured albums' }, { status: response.status });
    }

    const data = await response.json();
    console.log('Raw Discogs response:', JSON.stringify(data, null, 2));

    if (!data.results || !Array.isArray(data.results)) {
      console.error('Invalid data structure received:', data);
      return NextResponse.json({ error: 'Invalid data received' }, { status: 500 });
    }

    // Normalize the data to match our Album interface
    const albums = data.results.map((item: any) => ({
      id: item.id,
      title: item.title,
      year: item.year?.toString() || 'N/A',
      type: Array.isArray(item.format) ? item.format.join(", ") : item.format || "Unknown",
      cover_image: item.cover_image || item.thumb,
      thumb: item.thumb || item.cover_image
    }));

    console.log('Normalized albums:', JSON.stringify(albums, null, 2));
    
    return NextResponse.json({ results: albums });
  } catch (error) {
    console.error('Error fetching featured albums:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}