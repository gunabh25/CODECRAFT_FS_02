import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Employee from '@/models/Employee';
import jwt from 'jsonwebtoken';

function verifyToken(request) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token');
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
}

// GET one employee
export async function GET(request, { params }) {
  try {
    verifyToken(request);
    await connectToDatabase();
    const employee = await Employee.findById(params.id);
    return NextResponse.json(employee);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

// PUT update employee
export async function PUT(request, { params }) {
  try {
    verifyToken(request);
    await connectToDatabase();
    const body = await request.json();
    const updated = await Employee.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE employee
export async function DELETE(request, { params }) {
  try {
    verifyToken(request);
    await connectToDatabase();
    await Employee.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
