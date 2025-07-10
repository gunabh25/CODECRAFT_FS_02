import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongoose';
import Employee from '@/models/Employee';

function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) throw new Error('No token');

  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
}

// GET all employees
export async function GET(request) {
  try {
    verifyToken(request);
    await connectToDatabase();
    const employees = await Employee.find();
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or error fetching' }, { status: 401 });
  }
}

// POST new employee
export async function POST(request) {
  try {
    verifyToken(request);
    await connectToDatabase();
    const body = await request.json();
    const newEmployee = new Employee(body);
    await newEmployee.save();
    return NextResponse.json(newEmployee);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
