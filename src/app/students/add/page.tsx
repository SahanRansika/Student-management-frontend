'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Layout/Navbar';
import Sidebar from '@/components/Layout/Sidebar';
import StudentForm from '@/components/Students/StudentForm';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function AddStudentPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (data: any) => {
    try {
      console.log('📤 Sending student data:', data);
      const response = await api.post('/students', data);
      console.log('✅ Student created:', response);
      toast.success('Student added successfully! 🎉');
      router.push('/students');
    } catch (error: any) {
      console.error('❌ Error adding student:', error);
      const errorMessage = error.response?.data?.error || 'Failed to add student';
      toast.error(errorMessage);
      throw error;
    }
  };

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64 mt-16">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Student ID will be auto-generated
            </div>
          </div>
          <div className="max-w-3xl">
            <StudentForm onSubmit={handleSubmit} submitLabel="Add Student" />
          </div>
        </div>
      </div>
    </div>
  );
}