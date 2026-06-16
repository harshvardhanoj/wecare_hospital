/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  image: string;
  specialties: string[];
  qualification: string;
  experience: number; // in years
  rating: number;
  availability: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  bio: string;
  email: string;
  consultFee: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string; // lucide icon name
  headOfDept: string; // Doctor's name
  location: string; // Wing or building info
  bedsCount: number;
  features: string[];
}

export interface Appointment {
  id: string;
  userId?: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientType: 'new' | 'returning';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "10:30 AM"
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  createdAt: string;
}

export interface VitalsReading {
  date: string; // YYYY-MM-DD
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  weight: number;
  oxygenLevel: number;
}

export interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface LabResult {
  id: string;
  date: string;
  testName: string;
  category: string;
  result: string;
  range: string;
  status: 'Normal' | 'High' | 'Low';
  doctorName: string;
  notes: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  type: 'Visit' | 'Lab' | 'Prescription' | 'Immunization';
  title: string;
  description: string;
  doctorName: string;
  attachment?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  bloodType: string;
  allergies: string[];
  gender: 'Male' | 'Female' | 'Other';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  height: number; // in cm
  weight: number; // in kg
}
