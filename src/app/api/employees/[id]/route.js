import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Employee from '@/models/Employee';
import jwt from 'jsonwebtoken';

function verifyToken(request) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token provided');
  return jwt.verify(token, process.env.JWT_SECRET);
}

// GET /api/employees/:id
export async function GET(request, { params }) {
  try {
    verifyToken(request);
    await connectToDatabase();
    const employee = await Employee.findById(params.id);
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json(employee);
  } catch (error) {
    console.error('❌ GET employee by ID error:', error.message);
    return NextResponse.json({ error: 'Unauthorized or error fetching employee' }, { status: 401 });
  }
}

// PUT /api/employees/:id
export async function PUT(request, { params }) {
  try {
    verifyToken(request);
    await connectToDatabase();
    const body = await request.json();
    const updated = await Employee.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('❌ PUT employee error:', error.message);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

// DELETE /api/employees/:id
export async function DELETE(request, { params }) {
  try {
    verifyToken(request);
    await connectToDatabase();
    const deleted = await Employee.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('❌ DELETE employee error:', error.message);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
