import { z } from 'zod';

export const studentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  course: z.string().optional(),
  age: z.number().min(0, 'Age must be positive').max(100, 'Age must be less than 100').optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type StudentFormData = z.infer<typeof studentSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;