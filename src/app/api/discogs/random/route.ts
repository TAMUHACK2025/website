import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = process.env.DISCOGS_USER_TOKEN;

  if (!token) {
    // Return mock data if no token
    return getMockRandomData();
  }

  try {
    // Get random vinyl from Discogs
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const params = new URLSearchParams({
      type: 'release',
      format: 'vinyl',
      per_page: '8',
      page: randomPage.toString(),
    });

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
    return getMockRandomData();
  }
}

function getMockRandomData() {
  const mockResults = [
    {
      id: 1,
      title: "Random Access Memories - Daft Punk",
      artist: "Daft Punk",
      year: 2013,
      cover_image: "https://images.unsplash.com/photo-1653383454515-0b42b711ed7c?w=400&h=400&fit=crop",
      format: ["Vinyl"]
    },
    {
      id: 2,
      title: "Abbey Road - The Beatles",
      artist: "The Beatles",
      year: 1969,
      cover_image: "https://images.unsplash.com/photo-1618034100983-e1d78be0dc80?w=400&h=400&fit=crop",
      format: ["Vinyl"]
    },
    // Add more mock items...
  ];

  return NextResponse.json({
    results: mockResults,
    pagination: { items: mockResults.length, page: 1, pages: 1 }
  });
}