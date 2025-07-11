// app/api/employees/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongoose';
import Employee from '@/models/Employee';

function verifyToken(request) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) throw new Error('No token provided');
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
}

export async function GET(request) {
  try {
    verifyToken(request);
    await connectToDatabase();
    const employees = await Employee.find();
    return NextResponse.json(employees);
  } catch (error) {
    console.error('❌ GET /employees error:', error.message);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    verifyToken(request);
    await connectToDatabase();
    const body = await request.json();
    const newEmployee = new Employee(body);
    await newEmployee.save();
    return NextResponse.json(newEmployee);
  } catch (error) {
    console.error('❌ POST /employees error:', error.message);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
