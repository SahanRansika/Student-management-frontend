'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Layout/Navbar';
import Sidebar from '@/components/Layout/Sidebar';
import StatsCard from '@/components/Dashboard/StatsCard';
import api from '@/services/api';
import { Student } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Users, ArrowRight, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [totalStudents, setTotalStudents] = useState(0);
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Shared mobile sidebar state

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [count, students] = await Promise.all([
        api.get<number>('/students/count'),
        api.get<Student[]>('/students')
      ]);
      setTotalStudents(count);
      setRecentStudents(students.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
      {/* Background Image with Transparent White Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
      </div>

      {/* Main Layout Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navbar with mobile toggle handler passed */}
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        {/* Sidebar with state props */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content Area (Responsive margins and padding for mobile/tablet/desktop) */}
        <main className="p-4 sm:p-6 lg:p-8 sm:ml-64 mt-20 sm:mt-16 transition-all duration-300 flex-1">
          
          {/* Welcome Banner Card */}
          <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-blue-200 text-sm font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Welcome Back Dashboard
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Manage Your Institute Effortlessly
              </h1>
              <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-xl">
                Here is a quick overview of your students, active courses, and system activities today.
              </p>
            </div>
            <button 
              onClick={() => router.push('/students')} 
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base"
            >
              View All Students <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Cards Grid - Responsive: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all hover:shadow-xl">
              <StatsCard
                title="Total Students"
                value={loading ? '...' : totalStudents}
                icon="👨‍🎓"
                color="blue"
              />
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all hover:shadow-xl">
              <StatsCard
                title="Recent Additions"
                value={loading ? '...' : recentStudents.length}
                icon="🆕"
                color="green"
              />
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 transition-all hover:shadow-xl sm:col-span-2 lg:col-span-1">
              <StatsCard
                title="Courses"
                value={loading ? '...' : '5+'}
                icon="📚"
                color="purple"
              />
            </div>
          </div>

          {/* Recent Students Section */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" /> Recently Added Students
              </h2>
              <span className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                Live Data Feed
              </span>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : recentStudents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-base">No students added yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <ul className="divide-y divide-gray-100">
                  {recentStudents.map((student) => (
                    <li key={student.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50/50 px-4 rounded-xl transition-colors gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          {student.fullName ? student.fullName.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{student.fullName}</p>
                          <p className="text-xs text-gray-500 sm:hidden">{student.email}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 hidden sm:block">{student.email}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}