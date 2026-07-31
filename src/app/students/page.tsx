'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Layout/Navbar';
import Sidebar from '@/components/Layout/Sidebar';
import StudentList from '@/components/Students/StudentList';
import SearchBar from '@/components/Students/SearchBar';
import api from '@/services/api';
import { Student } from '@/types';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Users, UserPlus, Sparkles } from 'lucide-react';

export default function StudentsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await api.get<Student[]>('/students');
      setStudents(data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      try {
        const data = await api.get<Student[]>(`/students/search?term=${term}`);
        setStudents(data);
      } catch (error) {
        toast.error('Search failed');
      }
    } else {
      fetchStudents();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted successfully');
      await fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const handleEdit = (student: Student) => {
    router.push(`/students/edit/${student.id}`);
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
        
        {/* Navbar with mobile toggle handlers passed */}
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        {/* Responsive Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 sm:ml-64 mt-20 sm:mt-16 transition-all duration-300 flex-1">
          
          {/* Header Banner Section */}
          <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-blue-200 text-sm font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Institute Management
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
                <Users className="w-8 h-8" /> Student Directory
              </h1>
              <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-xl">
                Easily view, search, update, or register new students into your system database.
              </p>
            </div>
            <button
              onClick={() => router.push('/students/add')}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base"
            >
              <UserPlus className="w-5 h-5" /> Add Student
            </button>
          </div>

          {/* Search Bar & Content Box */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20">
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} />
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <StudentList
                  students={students}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}