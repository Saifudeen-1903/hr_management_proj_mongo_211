'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Layers } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('Logged in successfully');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Left Pane - Dynamic Abstract Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 mix-blend-overlay" 
             style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 85% 30%, rgba(100, 200, 255, 0.2) 0%, transparent 50%)' }}>
        </div>
        
        {/* Animated decorative blobs */}
        <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-[30%] right-[20%] w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[20%] left-[40%] w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white w-full h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
              <Layers className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">HR Portal Next</h1>
          </div>
          <h2 className="text-5xl font-bold leading-tight mb-6">
            Empower your workforce<br/>with seamless management.
          </h2>
          <p className="text-lg text-blue-200/80 max-w-xl">
            Streamline employee onboarding, attendance tracking, and leave management in one powerful, unified platform.
          </p>
        </div>
      </div>

      {/* Right Pane - Login Form with Glassmorphism on Mobile, Clean on Desktop */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:bg-white relative">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-900">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/10 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none p-8 rounded-3xl border border-white/20 lg:border-none shadow-2xl lg:shadow-none">
            <div className="mb-10 text-center lg:text-left">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                 <Layers className="w-8 h-8 text-blue-400" />
                 <h1 className="text-2xl font-bold text-white">HR Portal</h1>
              </div>
              <h3 className="text-3xl font-bold text-white lg:text-slate-900 tracking-tight mb-2">Welcome back</h3>
              <p className="text-slate-300 lg:text-slate-500">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200 lg:text-slate-700 font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-slate-300/30 lg:border-slate-200 bg-white/5 lg:bg-white text-white lg:text-slate-900 placeholder:text-slate-400 lg:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-200 lg:text-slate-700 font-medium">Password</Label>
                  <a href="#" className="text-sm font-medium text-blue-400 lg:text-blue-600 hover:text-blue-300 lg:hover:text-blue-700 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border-slate-300/30 lg:border-slate-200 bg-white/5 lg:bg-white text-white lg:text-slate-900 placeholder:text-slate-400 lg:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
