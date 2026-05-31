'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  LogOut,
  Menu,
  Layers,
  Bell
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Employees', href: '/dashboard/employees', icon: Users, role: 'admin' },
  { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarCheck },
  { name: 'Leave', href: '/dashboard/leave', icon: CalendarDays },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = session?.user?.role || 'employee';

  const filteredNav = navItems.filter((item) => !item.role || item.role === role);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Dark Premium Theme */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-950 text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl lg:shadow-none flex flex-col`}
      >
        <div className="flex h-20 shrink-0 items-center px-8 border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg">
                <Layers className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-xl font-bold text-white tracking-tight">HR Portal</h1>
          </div>
        </div>
        <nav className="flex flex-1 flex-col overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/dashboard');
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-400'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* User Profile Area */}
        <div className="border-t border-white/10 p-4 bg-slate-950/50">
          <div className="flex items-center gap-x-3 px-2 py-3 mb-2 rounded-xl bg-white/5 border border-white/5">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-inner">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold text-white truncate">{session?.user?.name}</span>
              <span className="text-xs text-blue-300/80 capitalize">{role}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all rounded-lg h-10"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="mr-3 h-4 w-4 text-red-400" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        {/* Top Header */}
        <header className="flex h-20 shrink-0 items-center gap-x-4 bg-white/80 backdrop-blur-md px-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:gap-x-6 sm:px-6 lg:px-8 border-b border-slate-200 z-10 sticky top-0">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-700 lg:hidden hover:bg-slate-100 rounded-md transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              {/* Could add a search bar or breadcrumbs here */}
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />
              
              <div className="hidden lg:flex lg:items-center lg:gap-x-4">
                <span className="text-sm font-semibold leading-6 text-slate-900" aria-hidden="true">
                  {session?.user?.name}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
