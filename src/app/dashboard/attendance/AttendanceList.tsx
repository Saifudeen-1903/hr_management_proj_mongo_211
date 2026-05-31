'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Clock, CheckCircle } from 'lucide-react';

type AttendanceRecord = {
  _id: string;
  user: { name: string; email: string; jobTitle: string };
  date: string;
  clockIn: string;
  clockOut?: string;
  status: string;
};

export default function AttendanceList() {
  const { data: session } = useSession();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClocking, setIsClocking] = useState(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  const isAdmin = session?.user?.role === 'admin';

  const fetchAttendance = async () => {
    try {
      const res = await fetch('/api/attendance');
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
        
        // Find today's record for current user if employee
        if (!isAdmin) {
          const today = new Date().toDateString();
          const record = data.find((r: AttendanceRecord) => new Date(r.date).toDateString() === today);
          setTodayRecord(record || null);
        }
      }
    } catch (error) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [isAdmin]);

  const handleClock = async (action: 'clock-in' | 'clock-out') => {
    setIsClocking(true);
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        toast.success(`Successfully ${action === 'clock-in' ? 'clocked in' : 'clocked out'}`);
        fetchAttendance();
      } else {
        const data = await res.json();
        toast.error(data.error || `Failed to ${action}`);
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsClocking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">
            {isAdmin ? 'View attendance logs for all employees.' : 'Track your daily attendance.'}
          </p>
        </div>

        {!isAdmin && (
          <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-500">Today's Status</span>
              <span className="font-bold capitalize text-slate-900">
                {todayRecord ? todayRecord.status : 'Not Clocked In'}
              </span>
            </div>
            
            {!todayRecord ? (
              <Button onClick={() => handleClock('clock-in')} disabled={isClocking} className="bg-green-600 hover:bg-green-700">
                <Clock className="mr-2 h-4 w-4" /> Clock In
              </Button>
            ) : !todayRecord.clockOut ? (
              <Button onClick={() => handleClock('clock-out')} disabled={isClocking} variant="destructive">
                <CheckCircle className="mr-2 h-4 w-4" /> Clock Out
              </Button>
            ) : (
              <Button disabled variant="outline" className="border-green-200 bg-green-50 text-green-700">
                <CheckCircle className="mr-2 h-4 w-4" /> Completed
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
            <TableRow className="hover:bg-transparent">
              {isAdmin && <TableHead className="font-semibold text-slate-600">Employee</TableHead>}
              <TableHead className="font-semibold text-slate-600">Date</TableHead>
              <TableHead className="font-semibold text-slate-600">Clock In</TableHead>
              <TableHead className="font-semibold text-slate-600">Clock Out</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 5 : 4} className="h-32 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading attendance records...
                  </div>
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 5 : 4} className="h-48 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                       <Clock className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-900">No attendance records found</p>
                    <p className="text-sm mt-1">Clock in today to start tracking your time.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record._id} className="group hover:bg-slate-50/50 transition-colors">
                  {isAdmin && (
                    <TableCell>
                      <div className="font-medium text-slate-900">{record.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{record.user?.email}</div>
                    </TableCell>
                  )}
                  <TableCell className="text-slate-700 font-medium">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                  <TableCell className="text-slate-600">
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-sm">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(record.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {record.clockOut ? (
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-sm">
                        <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(record.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">--:--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        record.status === 'present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : record.status === 'late'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {record.status === 'present' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                      {record.status === 'late' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>}
                      {record.status === 'absent' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>}
                      <span className="capitalize">{record.status}</span>
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
