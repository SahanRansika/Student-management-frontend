'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful! 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!fullName || fullName.trim().length < 2) {
      toast.error('Please enter your full name');
      return;
    }

    setLoading(true);
    
    try {
      console.log('📝 Register attempt:', { email, fullName });
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password.trim(), 
          fullName: fullName.trim(),
          role: 'ADMIN'
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        toast.error('Server error. Please try again.');
        setLoading(false);
        return;
      }

      console.log('Registration response:', { status: response.status, data });

      if (response.ok) {
        toast.success('Account created successfully! 🎉');
        toast.success('Please login with your credentials');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setEmail('');
      } else {
        const errorMessage = data?.error || data?.message || 'Registration failed';
        toast.error(errorMessage);
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
        toast.error('Server is taking too long. Please try again.');
      } else if (error.message?.includes('Failed to fetch')) {
        toast.error('Cannot connect to server. Is the backend running?');
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 py-4 px-3 sm:px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6 items-center">
        
        {/* Left Side - Branding & Illustration */}
        <div className="lg:col-span-3 hidden lg:flex flex-col items-center justify-center">
          <div className="w-full max-w-md text-center">
            <div className="mb-6">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop" 
                alt="Students collaborating" 
                className="rounded-2xl shadow-[0_20px_40px_-10px_rgba(110,63,215,0.25)] w-full h-auto object-cover max-h-[240px]"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
              Student Management, <span className="text-primary-600">Simplified</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-600 max-w-sm mx-auto">
              Manage records, track progress, and empower academic success.
            </p>
          </div>
        </div>

        {/* Right Side - Login/Register Form */}
        <div className="lg:col-span-2 w-full max-w-xs mx-auto lg:mx-0">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-[0_10px_30px_-8px_rgba(0,0,0,0.06)] p-4 sm:p-5 md:p-6 border border-gray-100">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white ring-4 ring-primary-100">
                <span className="text-2xl md:text-3xl">🎓</span>
              </div>
            </div>

            <div className="text-center mb-4 md:mb-5">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-[10px] md:text-xs text-gray-500 mt-1.5">
                {isLogin 
                  ? 'Log in to continue your journey.' 
                  : 'Join us and manage students effortlessly.'}
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex bg-gray-100/70 backdrop-blur-sm rounded-lg p-0.5 mb-4 md:mb-5 border border-gray-200">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-semibold transition-all duration-300 ease-out ${
                  isLogin 
                    ? 'bg-primary-600 text-white shadow-sm scale-[1.02]' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-semibold transition-all duration-300 ease-out ${
                  !isLogin 
                    ? 'bg-primary-600 text-white shadow-sm scale-[1.02]' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-3 md:space-y-3.5">
                <div>
                  <label className="block text-[10px] md:text-xs font-semibold text-gray-800 mb-1 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors text-xs">📧</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 md:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all text-xs md:text-sm text-gray-900 placeholder:text-gray-400"
                      placeholder="you@example.com"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-semibold text-gray-800 mb-1 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors text-xs">🔒</span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 md:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all text-xs md:text-sm text-gray-900 placeholder:text-gray-400"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-3.5 h-3.5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 accent-primary-600" />
                    <span className="ml-1.5 text-[10px] md:text-xs text-gray-600 font-medium">Remember</span>
                  </label>
                  <button type="button" className="text-[10px] md:text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 md:py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-bold text-xs md:text-sm hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 focus:ring-offset-white transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            ) : (
              // Register Form
              <form onSubmit={handleRegister} className="space-y-3 md:space-y-3.5">
                <div>
                  <label className="block text-[10px] md:text-xs font-semibold text-gray-800 mb-1 ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors text-xs">👤</span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 md:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all text-xs md:text-sm text-gray-900 placeholder:text-gray-400"
                      placeholder="John Doe"
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-semibold text-gray-800 mb-1 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors text-xs">📧</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 md:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all text-xs md:text-sm text-gray-900 placeholder:text-gray-400"
                      placeholder="you@example.com"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-semibold text-gray-800 mb-1 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors text-xs">🔒</span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 md:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all text-xs md:text-sm text-gray-900 placeholder:text-gray-400"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                  <p className="mt-0.5 text-[9px] md:text-[10px] text-gray-500 ml-1 font-medium">Min 6 characters</p>
                </div>

                <div>
                  <label className="block text-[10px] md:text-xs font-semibold text-gray-800 mb-1 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors text-xs">✅</span>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 md:py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all text-xs md:text-sm text-gray-900 placeholder:text-gray-400"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 md:py-2.5 bg-gradient-to-r from-purple-600 to-primary-600 text-white rounded-lg font-bold text-xs md:text-sm hover:from-purple-700 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:ring-offset-2 focus:ring-offset-white transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="relative my-3 md:my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-[9px] md:text-[10px] text-gray-500 font-medium">Already have an account?</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="w-full py-1.5 text-primary-600 font-bold text-xs hover:text-primary-700 transition-colors"
                >
                  Sign In Instead
                </button>
              </form>
            )}

            <div className="mt-4 text-center border-t border-gray-100 pt-3">
              <p className="text-[8px] md:text-[10px] text-gray-400">
                By continuing, you agree to our{' '}
                <Link href="#" className="text-primary-600 font-semibold hover:underline">Terms</Link>
                {' '}&{' '}
                <Link href="#" className="text-primary-600 font-semibold hover:underline">Privacy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}