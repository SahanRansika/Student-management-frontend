'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Layout/Navbar';
import Sidebar from '@/components/Layout/Sidebar';
import StudentForm from '@/components/Students/StudentForm';
import api from '@/services/api';
import { Student } from '@/types';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function EditStudentPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    fetchStudent();
  }, [params.id]);

  const fetchStudent = async () => {
    try {
      const data = await api.get<Student>(`/students/${params.id}`);
      setStudent(data);
    } catch (error) {
      toast.error('Student not found');
      router.push('/students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await api.put(`/students/${params.id}`, data);
      toast.success('Student updated successfully!');
      router.push('/students');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update student');
      throw error;
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="p-4 sm:ml-64 mt-16">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Student</h1>
          <div className="max-w-3xl">
            {student && (
              <StudentForm
                initialData={student}
                onSubmit={handleSubmit}
                submitLabel="Update Student"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}