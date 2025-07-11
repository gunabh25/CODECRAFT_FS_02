// app/api/employees/[id]/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongoose';
import Employee from '@/models/Employee';

function verifyToken(request) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token provided');
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
}

export async function GET(request, { params }) {
  try {
    verifyToken(request);
    await connectToDatabase();
    const employee = await Employee.findById(params.id);
    return NextResponse.json(employee);
  } catch (error) {
    console.error('❌ GET /employees/[id] error:', error.message);
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    verifyToken(request);
    await connectToDatabase();
    const body = await request.json();
    const updated = await Employee.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('❌ PUT /employees/[id] error:', error.message);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    verifyToken(request);
    await connectToDatabase();
    await Employee.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('❌ DELETE /employees/[id] error:', error.message);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
