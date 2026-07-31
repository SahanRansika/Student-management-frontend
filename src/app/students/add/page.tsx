'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Layout/Navbar';
import Sidebar from '@/components/Layout/Sidebar';
import StudentForm from '@/components/Students/StudentForm';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { UserPlus, Sparkles } from 'lucide-react';

export default function AddStudentPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle state

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (data: any) => {
    try {
      await api.post('/students', data);
      toast.success('Student added successfully!');
      router.push('/students');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add student');
      throw error;
    }
  };

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
        
        {/* Navbar with mobile toggle handlers passed */}
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        {/* Responsive Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 sm:ml-64 mt-20 sm:mt-16 transition-all duration-300 flex-1">
          
          {/* Header Banner Section */}
          <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl text-white">
            <div className="flex items-center gap-2 mb-2 text-blue-200 text-sm font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Student Management System
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <UserPlus className="w-8 h-8" /> Add New Student
            </h1>
            <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-xl">
              Fill out the required details below to register a new student into the institute database.
            </p>
          </div>

          {/* Form Container Box */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20 max-w-3xl">
            <StudentForm onSubmit={handleSubmit} submitLabel="Add Student" />
          </div>
        </main>
      </div>
    </div>
  );
}