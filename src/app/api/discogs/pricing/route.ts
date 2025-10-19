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
<<<<<<< HEAD
    // Fetch marketplace listings for this release
    const url = `${baseUrl}/marketplace/search?release_id=${releaseId}&format=Vinyl,CD&sort=price,asc&per_page=100`;
=======
    // First get the master release info to handle both release_id and master_id
    const masterUrl = `${baseUrl}/masters/${releaseId}`;
    const masterResponse = await fetch(masterUrl, {
      headers: {
        'Authorization': `Discogs token=${token}`,
        'User-Agent': 'ResonateApp/1.0',
      },
    });

    if (!masterResponse.ok) {
      console.error('Failed to fetch master:', masterResponse.status);
      // If master lookup fails, try direct marketplace search
      const url = `${baseUrl}/marketplace/listings/${releaseId}`;
      const listingsResponse = await fetch(url, {
        headers: {
          'Authorization': `Discogs token=${token}`,
          'User-Agent': 'ResonateApp/1.0',
        },
      });

      if (!listingsResponse.ok) {
        throw new Error(`Failed to fetch listings: ${listingsResponse.status}`);
      }

      const data = await listingsResponse.json();
      return processListings(data.listings || []);
    }

    // If master lookup succeeds, get marketplace data for master release
    const masterData = await masterResponse.json();
    const url = `${baseUrl}/marketplace/search?master_id=${masterData.id}&format=Vinyl,CD&sort=price,asc&per_page=100`;
>>>>>>> roni
    
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
<<<<<<< HEAD
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
=======
    return processListings(data.results || []);
>>>>>>> roni

  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 });
  }
<<<<<<< HEAD
=======
}

function processListings(listings: any[]) {
  // Process listings by format
  const vinylListings = listings.filter(item => 
    item.format?.some((f: string) => f.toLowerCase().includes('vinyl')) ||
    item.format?.some((f: string) => f.toLowerCase().includes('lp'))
  );
  
  const cdListings = listings.filter(item => 
    item.format?.some((f: string) => f.toLowerCase().includes('cd'))
  );

  console.log('Filtered listings:', { vinyl: vinylListings.length, cd: cdListings.length });

  const formatPricing = (items: any[]) => {
    if (items.length === 0) return {
      lowestPrice: { price: '??.??', currency: 'USD' },
      medianPrice: 0,
      available: 0,
    };
    
    const prices = items
      .map(i => parseFloat(i.price?.value || i.price))
      .filter(p => !isNaN(p));
    
    if (prices.length === 0) return {
      lowestPrice: { price: '??.??', currency: 'USD' },
      medianPrice: 0,
      available: 0,
    };

    prices.sort((a, b) => a - b);
    
    return {
      lowestPrice: {
        price: prices[0].toFixed(2),
        currency: items[0].currency || 'USD',
        condition: items[0].condition || 'Unknown'
      },
      medianPrice: prices[Math.floor(prices.length / 2)].toFixed(2),
      available: items.length,
    };
  };

  return NextResponse.json({
    pricing: {
      vinyl: formatPricing(vinylListings),
      cd: formatPricing(cdListings),
    }
  });
>>>>>>> roni
}