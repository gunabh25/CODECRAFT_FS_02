export const runtime = 'nodejs'; 

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(request) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET missing');
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    const decoded = jwt.verify(token, jwtSecret);
    await connectToDatabase();
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user }); 
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
