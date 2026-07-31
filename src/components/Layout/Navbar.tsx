'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (isOpen: boolean) => void;
}

export default function Navbar({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 fixed w-full z-50 top-0 shadow-sm">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Menu Toggle Button */}
            {setIsSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none sm:hidden cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
            
            {/* Brand Title: Shows 'SM' on mobile screens and '📚 Student Management' on small screens and above */}
            <span className="self-center font-bold text-blue-600 tracking-tight whitespace-text">
              <span className="sm:hidden text-lg">📚 SM</span>
              <span className="hidden sm:inline-block sm:text-xl lg:text-2xl">📚 Student Management</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden md:inline-block">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-xl text-sm px-4 py-2 transition-colors shadow-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}