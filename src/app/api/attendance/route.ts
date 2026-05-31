import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const isAdmin = (session.user as any).role === 'admin';
    const userId = (session.user as any).id;

    // Parse query params for filtering
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    
    let query: any = isAdmin ? {} : { user: userId };
    
    if (dateStr) {
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      query.date = { $gte: date, $lt: nextDate };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('user', 'name email jobTitle')
      .sort({ date: -1 });

    return NextResponse.json(attendanceRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = (session.user as any).id;
    const body = await req.json();
    const { action } = body; // 'clock-in' or 'clock-out'

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecord = await Attendance.findOne({ user: userId, date: today });

    if (action === 'clock-in') {
      if (existingRecord) {
        return NextResponse.json({ error: 'Already clocked in today' }, { status: 400 });
      }

      // Logic for 'late' status (e.g. after 9:30 AM)
      const now = new Date();
      const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);

      const newRecord = new Attendance({
        user: userId,
        date: today,
        clockIn: now,
        status: isLate ? 'late' : 'present',
      });

      await newRecord.save();
      return NextResponse.json(newRecord, { status: 201 });
    } else if (action === 'clock-out') {
      if (!existingRecord) {
        return NextResponse.json({ error: 'Not clocked in today' }, { status: 400 });
      }
      if (existingRecord.clockOut) {
        return NextResponse.json({ error: 'Already clocked out today' }, { status: 400 });
      }

      existingRecord.clockOut = new Date();
      await existingRecord.save();
      
      return NextResponse.json(existingRecord);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process attendance' }, { status: 500 });
  }
}
