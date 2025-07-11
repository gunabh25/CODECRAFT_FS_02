export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log('📥 Login attempt:', { email });

    await connectToDatabase();
    console.log('✅ DB connected');

    const user = await User.findOne({ email });
    console.log('🔍 User found:', !!user);

    if (!user) {
      console.log('❌ Email not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log('🔐 Password match:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET not set');
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

    const cookie = serialize('auth-token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax', // Use 'none' if using cross-origin requests
      secure: process.env.NODE_ENV === 'production', // Required for cross-site cookies
    });

    console.log('✅ Cookie created');

    return new NextResponse(
      JSON.stringify({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }),
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('🔥 Login error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
