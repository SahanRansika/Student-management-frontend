export interface Student {
  id?: string;
  studentId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  course: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  registrationDate?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}