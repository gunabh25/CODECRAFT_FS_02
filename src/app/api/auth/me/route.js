export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      console.warn('❌ No auth-token cookie found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET missing in env');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const decoded = jwt.verify(token, jwtSecret);
    console.log('🔓 Token decoded:', decoded);

    await connectToDatabase();

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.warn('❌ No user found with decoded ID');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('❌ Token validation failed:', error.message);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
