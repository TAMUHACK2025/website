import { NextResponse } from 'next/server';
import { spotifyAuthClient } from '@/lib/api/auth';

export async function GET() {
  const authUrl = spotifyAuthClient.getLoginURL();
  return NextResponse.redirect(authUrl);
}