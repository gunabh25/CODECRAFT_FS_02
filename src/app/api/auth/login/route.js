import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Import your database connection/models here
// import User from '@/models/User';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in database
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Invalid credentials' },
    //     { status: 401 }
    //   );
    // }

    // Verify password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return NextResponse.json(
    //     { error: 'Invalid credentials' },
    //     { status: 401 }
    //   );
    // }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: 'user.id', // Replace with actual user.id
        email: email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return success response
    return NextResponse.json(
      { 
        message: 'Login successful',
        token,
        user: {
          id: 'user.id', // Replace with actual user data
          email: email,
          name: 'User Name' // Replace with actual user name
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests (e.g., for checking auth status)
export async function GET(request) {
  return NextResponse.json(
    { message: 'Login endpoint - use POST to authenticate' },
    { status: 200 }
  );
}