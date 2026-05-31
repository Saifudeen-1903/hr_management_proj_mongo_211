import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, CalendarCheck, Clock, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Leave from '@/models/Leave';
import Attendance from '@/models/Attendance';
import { AdminChart, EmployeeChart } from './DashboardCharts';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return null;
  }

  await dbConnect();
  
  // Dashboard statistics based on role
  const isAdmin = (session.user as any).role === 'admin';
  
  // Admin stats
  const totalEmployees = isAdmin ? await User.countDocuments({ role: 'employee', status: 'active' }) : 0;
  const pendingLeaves = isAdmin ? await Leave.countDocuments({ status: 'pending' }) : 0;
  
  // Today's date for queries
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Admin: Total present today
  const presentToday = isAdmin ? await Attendance.countDocuments({ date: today, status: { $in: ['present', 'half-day', 'late'] } }) : 0;
  
  // Employee stats
  const myPendingLeaves = !isAdmin ? await Leave.countDocuments({ user: (session.user as any).id, status: 'pending' }) : 0;
  const myAttendanceToday = !isAdmin ? await Attendance.findOne({ user: (session.user as any).id, date: today }) : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {session.user.name}</h2>
        <p className="text-slate-500 mt-1">Here's a summary of what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isAdmin ? (
          <>
            <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-slate-500">Total Employees</CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-slate-900">{totalEmployees}</div>
                <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +2 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-slate-500">Present Today</CardTitle>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <CalendarCheck className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-slate-900">{presentToday}</div>
                <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
                  {totalEmployees > 0 ? Math.round((presentToday/totalEmployees)*100) : 0}% attendance rate
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-slate-500">Pending Leaves</CardTitle>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-slate-900">{pendingLeaves}</div>
                <p className="text-xs text-slate-500 mt-1">Requires your attention</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-slate-500">Today's Status</CardTitle>
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Clock className="h-5 w-5 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-slate-900 capitalize">
                  {myAttendanceToday ? myAttendanceToday.status : 'Not Clocked In'}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {myAttendanceToday?.clockIn ? `Clocked in at ${new Date(myAttendanceToday.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Please clock in from Attendance'}
                </p>
              </CardContent>
            </Card>
            <Card className="hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-slate-500">My Pending Leaves</CardTitle>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-slate-900">{myPendingLeaves}</div>
                <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-md">
          <CardHeader>
            <CardTitle>{isAdmin ? 'Attendance Trend' : 'Leave Balance'}</CardTitle>
            <CardDescription>{isAdmin ? 'Overview of attendance over the last 7 days' : 'Your current leave usage vs total allocation'}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isAdmin ? <AdminChart /> : <EmployeeChart />}
          </CardContent>
        </Card>
        <Card className="col-span-3 border-none shadow-md flex flex-col">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Clock className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-600">No recent activity</p>
              <p className="text-xs text-slate-400">Activity logs will appear here soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
