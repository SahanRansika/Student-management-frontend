'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Students', href: '/students', icon: '👨‍🎓' },
  { name: 'Add Student', href: '/students/add', icon: '➕' },
];

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen && setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 sm:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 w-64 h-screen pt-20 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
      }`}>
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen && setIsOpen(false)} // Close sidebar on mobile when link is clicked
                  className={`flex items-center p-3 text-gray-900 rounded-xl hover:bg-gray-100 group transition-colors ${
                    pathname === item.href ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs' : ''
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}