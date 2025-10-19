import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('spotify_auth');
  
  if (!authCookie) {
    return new NextResponse(null, { status: 401 });
  }
  
  return new NextResponse(null, { status: 200 });
}