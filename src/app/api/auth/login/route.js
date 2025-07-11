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
    console.log('📥 Incoming Login Request:', { email, password });

    await connectToDatabase();
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email });
    console.log('🧠 Fetched user from DB:', user);

    if (!user) {
      console.log('❌ User not found with email:', email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('🔐 Comparing passwords...');
    console.log('🔒 Password from request:', password);
    console.log('🔒 Hashed password in DB:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('✅ bcrypt.compare result:', isMatch);

    if (!isMatch) {
      console.log('❌ Password does not match');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET not found in environment variables');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

    const cookie = serialize('auth-token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    console.log('✅ Login successful, setting cookie');

    return new NextResponse(
      JSON.stringify({
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }),
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('🔥 Login error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
