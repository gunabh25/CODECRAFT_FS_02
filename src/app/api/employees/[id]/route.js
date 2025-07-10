import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connect';
import Employee from '@/models/Employee';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const employee = await Employee.findById(params.id);
    if (!employee) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    return NextResponse.json(employee, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const data = await req.json();
    const employee = await Employee.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(employee, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await Employee.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
