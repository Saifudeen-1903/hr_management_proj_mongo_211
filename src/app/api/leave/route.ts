import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Leave from '@/models/Leave';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const isAdmin = (session.user as any).role === 'admin';
    const userId = (session.user as any).id;

    const query = isAdmin ? {} : { user: userId };
    
    const leaves = await Leave.find(query)
      .populate('user', 'name email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(leaves);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leave requests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, startDate, endDate, reason } = body;
    const userId = (session.user as any).id;

    if (!type || !startDate || !endDate || !reason) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await dbConnect();

    const newLeave = new Leave({
      user: userId,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'pending',
    });

    await newLeave.save();

    return NextResponse.json(newLeave, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit leave request' }, { status: 500 });
  }
}
