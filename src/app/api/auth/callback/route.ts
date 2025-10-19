import { NextRequest, NextResponse } from 'next/server';
import { spotifyAuthClient } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect('/?error=missing_code');
  }

  try {
    const data = await spotifyAuthClient.getAccessToken(code);
    
    // Set cookies for authentication state
    const response = NextResponse.redirect('/');
    response.cookies.set('spotify_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7200 // 2 hours
    });
    
    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect('/?auth_error=true');
  }
}