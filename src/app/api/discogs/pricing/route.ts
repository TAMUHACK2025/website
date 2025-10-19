import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const releaseId = searchParams.get('releaseId');
  
  if (!releaseId) {
    return NextResponse.json({ error: 'Release ID required' }, { status: 400 });
  }

  const token = process.env.DISCOGS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  const baseUrl = 'https://api.discogs.com';
  
  try {
    // Fetch marketplace listings for this release
    const url = `${baseUrl}/marketplace/search?release_id=${releaseId}&format=Vinyl,CD&sort=price,asc&per_page=100`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Discogs token=${token}`,
        'User-Agent': 'ResonateApp/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw marketplace data:', data);
    
    // Process listings by format
    const vinylListings = data.listings?.filter((item: any) => 
      item.condition.toLowerCase().includes('vinyl') || 
      item.sleeve_condition?.toLowerCase().includes('vinyl')
    ) || [];
    
    const cdListings = data.listings?.filter((item: any) => 
      item.condition.toLowerCase().includes('cd') || 
      item.sleeve_condition?.toLowerCase().includes('cd')
    ) || [];

    console.log('Filtered listings:', { vinyl: vinylListings.length, cd: cdListings.length });

    const formatPricing = (listings: any[]) => {
      if (listings.length === 0) return {
        lowestPrice: { price: '??.??', currency: 'USD' },
        medianPrice: 0,
        available: 0,
      };
      
      const prices = listings.map((l: any) => parseFloat(l.price.amount));
      prices.sort((a, b) => a - b);
      
      return {
        lowestPrice: {
          price: prices[0].toFixed(2),
          currency: listings[0].price.currency,
          condition: listings[0].condition
        },
        medianPrice: prices[Math.floor(prices.length / 2)].toFixed(2),
        available: listings.length,
      };
    };

    return NextResponse.json({
      pricing: {
        vinyl: formatPricing(vinylListings),
        cd: formatPricing(cdListings),
      }
    });

  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 });
  }
}