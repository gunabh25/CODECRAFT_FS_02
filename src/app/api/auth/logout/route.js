import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.headers.set('Set-Cookie', serialize('auth-token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  }));
  return response;
}