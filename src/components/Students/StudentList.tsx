'use client';

import { Student } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Edit, Trash2 } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (student: Student) => void;
}

export default function StudentList({ students, onDelete, onEdit }: StudentListProps) {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await onDelete(id);
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error('Failed to delete student');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (students.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg font-medium">No students found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white/50 backdrop-blur-xs">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50/80 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 font-semibold">Student ID</th>
            <th className="px-6 py-4 font-semibold">Name</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold">Course</th>
            <th className="px-6 py-4 font-semibold">Age</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id} className="bg-white/70 hover:bg-blue-50/40 transition-colors">
              <td className="px-6 py-4 font-semibold text-gray-900">
                {student.studentId}
              </td>
              <td className="px-6 py-4 font-medium text-gray-800">{student.fullName}</td>
              <td className="px-6 py-4 text-gray-600">{student.email}</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  {student.course || 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4">{student.age || '-'}</td>
              <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                <Link
                  href={`/students/edit/${student.id}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(student.id!)}
                  disabled={deleteLoading === student.id}
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> {deleteLoading === student.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}