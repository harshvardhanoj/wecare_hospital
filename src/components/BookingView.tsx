/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DEPARTMENTS, DOCTORS, TIME_SLOTS } from '../data';
import { Appointment, Doctor, Department } from '../types';
import { Calendar, Stethoscope, Clock, User, CheckCircle, ArrowRight, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';

interface BookingViewProps {
  onAddAppointment: (appointment: Appointment) => void;
  selectedDeptId: string | null;
  selectedDoctorId: string | null;
  onClearBookingSelections: () => void;
  isLoggedIn: boolean;
  patientProfile?: { name: string; email: string; phone: string } | null;
}

export default function BookingView({
  onAddAppointment,
  selectedDeptId,
  selectedDoctorId,
  onClearBookingSelections,
  isLoggedIn,
  patientProfile
}: BookingViewProps) {
  // Current date for min restriction
  const todayDateString = '2026-06-16'; // Derived from system date

  // Form State
  const [deptId, setDeptId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientType, setPatientType] = useState<'new' | 'returning'>('new');
  const [reason, setReason] = useState<string>('');

  // Status and receipt
  const [error, setError] = useState<string>('');
  const [successReceipt, setSuccessReceipt] = useState<Appointment | null>(null);

  // Inline Auth states inside Booking tab
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const handleInlineDemoLogin = async () => {
    setAuthError('');
    setIsAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, 'jane.doe@gmail.com', 'janedoe123#');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, 'jane.doe@gmail.com', 'janedoe123#');
          const uid = userCredential.user.uid;
          await setDoc(doc(db, 'users', uid), {
            id: uid,
            name: 'Jane Doe',
            email: 'jane.doe@gmail.com',
            phone: '+1 (555) 732-9011',
            age: 34,
            bloodType: 'A-Positive (A+)',
            allergies: ['Penicillin'],
            gender: 'Female',
            emergencyContact: { name: 'John Doe', relationship: 'Spouse', phone: '+1 (555) 732-9012' },
            height: 168,
            weight: 62.4
          });
          // Seed initial mock items
          const initialMock = [
            {
              id: 'apt-demo-1',
              userId: uid,
              doctorId: 'doc-jenkins',
              doctorName: 'Dr. Sarah Jenkins',
              departmentId: 'cardiology',
              departmentName: 'Cardiology',
              date: '2026-06-21',
              timeSlot: '10:00 AM',
              patientName: 'Jane Doe',
              patientEmail: 'jane.doe@gmail.com',
              patientPhone: '+1 (555) 732-9011',
              patientType: 'returning' as const,
              reason: 'Routine quarterly checkup after mitral valve replacement.',
              createdAt: '2026-06-16T10:00:00.000Z',
              status: 'scheduled' as const
            },
            {
              id: 'apt-demo-2',
              userId: uid,
              doctorId: 'doc-chang',
              doctorName: 'Dr. Michael Chang',
              departmentId: 'neurology',
              departmentName: 'Neurology',
              date: '2026-05-14',
              timeSlot: '02:30 PM',
              patientName: 'Jane Doe',
              patientEmail: 'jane.doe@gmail.com',
              patientPhone: '+1 (555) 732-9011',
              patientType: 'returning' as const,
              reason: 'Persistent migraine consultation and MRI review.',
              createdAt: '2025-05-12T09:15:30.000Z',
              status: 'completed' as const
            }
          ];
          for (const apt of initialMock) {
            await setDoc(doc(db, 'appointments', apt.id), apt);
          }
        } catch (seedErr: any) {
          setAuthError(`Demo seeding failed: ${seedErr.message}`);
        }
      } else {
        setAuthError(`Demo sign in failed: ${err.message}`);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleInlineGoogleLogin = async () => {
    setAuthError('');
    setIsAuthLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.toLowerCase().includes('unauthorized-domain'))) {
        const currentDomain = window.location.hostname;
        setAuthError(`Firebase Security requires authorizing your current domain to allow Single Sign-In with Google.\n\nTo resolve this:\n1. Open your Firebase Console (for "wecare-hospitals-b73dd")\n2. Navigate to Authentication > Settings > Authorized Domains\n3. Click "Add domain" and add exactly: "${currentDomain}"\n4. Once saved, refresh this page and authenticate successfully!`);
      } else {
        setAuthError(err.message || 'Google Auth Error occurred.');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleInlineAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    if (!authEmail.trim() || !authPassword || authPassword.length < 6) {
      setIsAuthLoading(false);
      return setAuthError('Please enter a valid email and a password of at least 6 characters.');
    }

    try {
      if (isRegisterMode) {
        if (!authName.trim()) {
          setIsAuthLoading(false);
          return setAuthError('Full legal name is required to register.');
        }
        const credentials = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const uid = credentials.user.uid;
        await setDoc(doc(db, 'users', uid), {
          id: uid,
          name: authName,
          email: authEmail,
          phone: authPhone || '+1 (555) 123-4567',
          age: 30,
          bloodType: 'Universal (O+)',
          allergies: [],
          gender: 'Other',
          emergencyContact: {
            name: 'Primary Contact',
            relationship: 'Guardian',
            phone: '+1 (555) 999-0000'
          },
          height: 175,
          weight: 70.0
        });
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
    } catch (err: any) {
      let msg = err.message;
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.toLowerCase().includes('unauthorized-domain'))) {
        const currentDomain = window.location.hostname;
        msg = `Firebase Security requires authorizing your current domain to allow Patient authentication.\n\nTo resolve this:\n1. Open your Firebase Console\n2. Navigate to Authentication > Settings > Authorized Domains\n3. Click "Add domain" and add exactly: "${currentDomain}"\n4. Once saved, refresh this page and log in!`;
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password combination.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Email address already registered.';
      }
      setAuthError(msg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Sync inputs with incoming parent props (redirect cases)
  useEffect(() => {
    if (selectedDeptId) {
      setDeptId(selectedDeptId);
    }
    if (selectedDoctorId) {
      setDoctorId(selectedDoctorId);
    }
  }, [selectedDeptId, selectedDoctorId]);

  // Autofill if logged into patient portal
  useEffect(() => {
    if (patientProfile) {
      setPatientName(patientProfile.name);
      setPatientEmail(patientProfile.email);
      setPatientPhone(patientProfile.phone);
      setPatientType('returning');
    }
  }, [patientProfile]);

  // Derive doctors available for chosen department
  const filteredDoctors = DOCTORS.filter((doc) => {
    return !deptId || doc.departmentId === deptId;
  });

  // Ensure chosen doctor is still part of filtered list. If not, reset doctorId.
  useEffect(() => {
    if (deptId && doctorId) {
      const isValid = filteredDoctors.some(doc => doc.id === doctorId);
      if (!isValid) {
        setDoctorId('');
      }
    }
  }, [deptId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!deptId) return setError('Please select a specializing clinical department.');
    if (!doctorId) return setError('Please choose a preferred consultant specialist.');
    if (!date) return setError('Please select a valid consultation date.');
    if (!timeSlot) return setError('Please select an available appointment time slot.');
    if (!patientName.trim()) return setError('Please enter patient’s full legal name.');
    if (!patientEmail.trim()) return setError('Please enter a corresponding contact email.');
    if (!patientPhone.trim()) return setError('Please enter a corresponding mobile contact phone.');
    if (!reason.trim()) return setError('Please explain the reason or symptoms for this visit.');

    // Generate simulated confirmation
    const selectedDoctor = DOCTORS.find(doc => doc.id === doctorId);
    const selectedDept = DEPARTMENTS.find(d => d.id === deptId);

    const generatedId = `WCH-${Math.floor(10000 + Math.random() * 90000)}`;

    const newAppointment: Appointment = {
      id: generatedId,
      doctorId: doctorId,
      doctorName: selectedDoctor?.name || 'Assigned Consultant',
      departmentId: deptId,
      departmentName: selectedDept?.name || 'General Clinic',
      patientName: patientName,
      patientEmail: patientEmail,
      patientPhone: patientPhone,
      patientType: patientType,
      date: date,
      timeSlot: timeSlot,
      status: 'scheduled',
      reason: reason,
      createdAt: new Date().toISOString()
    };

    onAddAppointment(newAppointment);
    setSuccessReceipt(newAppointment);
    onClearBookingSelections();
  };

  const handleBookAnother = () => {
    setSuccessReceipt(null);
    setDeptId('');
    setDoctorId('');
    setDate('');
    setTimeSlot('');
    setReason('');
    
    if (!patientProfile) {
      setPatientName('');
      setPatientEmail('');
      setPatientPhone('');
      setPatientType('new');
    }
  };

  // Selected doctor details for dynamic preview card
  const selectedDocInfo = DOCTORS.find(d => d.id === doctorId);

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="booking-container">
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in duration-300" id="booking-gate-wrapper">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-wider">
              Patient Authentication Required
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">Sign In to Schedule Appointment</h1>
            <p className="text-xs text-slate-500 leading-relaxed ml-2 mr-2">
              Secure your medical consultations with live Firebase protection. Creating an account logs your appointments instantly inside your private portal.
            </p>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="bg-blue-50 border border-blue-200/60 rounded-2xl p-4 text-center space-y-2.5">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide">💨 Express Evaluation Access</h4>
              <button
                onClick={handleInlineDemoLogin}
                disabled={isAuthLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-shadow cursor-pointer flex items-center justify-center gap-2"
              >
                {isAuthLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                Sign In with Demo Patient (Jane Doe)
              </button>
            </div>

            <div className="relative flex py-1 items-center text-slate-350">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-wider">Or Use Credentials</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-700 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="whitespace-pre-line leading-relaxed">{authError}</span>
              </div>
            )}

            <form onSubmit={handleInlineAuthSubmit} className="space-y-4">
              {isRegisterMode && (
                <>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Legal Name *</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Primary Contact Phone *</span>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 0199"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-xs"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email Address *</span>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane.doe@gmail.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Security Password *</span>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:bg-slate-350"
              >
                {isAuthLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isRegisterMode ? 'Register & Setup Profile' : 'Authenticate Security'}</span>
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthError(''); }}
              className="w-full text-center text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              {isRegisterMode ? 'Already have an account? Log In' : 'New Patient? Setup Secured Profile'}
            </button>

            <div className="relative flex py-1 items-center text-slate-300">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">or use single sign-on</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <button
              onClick={handleInlineGoogleLogin}
              disabled={isAuthLoading}
              className="w-full py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-55 text-slate-750 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Authenticate with Google Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="booking-container">
      {successReceipt ? (
        /* SUCCESS CONFIRMATION PANEL */
        <div className="bg-white border hover:border-blue-200 border-slate-150 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6 max-w-xl mx-auto animate-in fade-in-50 zoom-in-95 duration-200" id="booking-receipt-panel">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-md">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">Consultation Appointed Securely!</h1>
            <p className="text-xs text-slate-500">Your registration session was finalized under JCI Clinical Safety Standards.</p>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/50 rounded-2xl p-6 text-left space-y-4" id="receipt-details">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Confirmation Ticket</span>
              <strong className="text-blue-700 bg-blue-100 px-3 py-1 rounded-md tracking-wider font-mono">
                {successReceipt.id}
              </strong>
            </div>

            <div className="border-t border-slate-100/80 pt-3 text-sm space-y-2 text-slate-700">
              <p>📍 <strong>Department:</strong> {successReceipt.departmentName}</p>
              <p>🥼 <strong>Specialist:</strong> {successReceipt.doctorName}</p>
              <p>📅 <strong>Schedule Date:</strong> {successReceipt.date}</p>
              <p>⏰ <strong>Time Slot:</strong> {successReceipt.timeSlot}</p>
              <p>👤 <strong>Patient name:</strong> {successReceipt.patientName}</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-left text-xs text-amber-800 space-y-1">
            <p className="font-bold">⚠️ Preparing for Your Visit:</p>
            <ul className="list-disc pl-4 space-y-1 text-amber-700">
              <li>Arrive at the department wing 15 minutes before your time slot.</li>
              <li>Bring physical copies of past drug prescriptions and diagnostic labs.</li>
              <li>You can view status, track results or cancel bookings inside the <strong>Patient Portal</strong> dashboard anytime.</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBookAnother}
              className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Examine Another Booking
            </button>
            <button
              onClick={() => {
                // To get here, let parent map active tab to portal
                const element = document.getElementById('logo-block');
                if (element) {
                        const target = document.querySelector('[id*="cta-portal-loggedin"]') || document.querySelector('[id*="cta-portal-login"]');
                        if (target && target instanceof HTMLButtonElement) target.click();
                }
              }}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-shadow cursor-pointer"
            >
              Open Patient Portal
            </button>
          </div>
        </div>
      ) : (
        /* DYNAMIC APPOINTMENT FORM */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start" id="booking-interface">
          {/* Main Form Fields */}
          <div className="md:col-span-8 bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="mb-6 space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-900 font-display">Schedule Clinic Appointment</h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete the dynamic parameters below to immediately secure outpatient clinic slots. Booking fields will sync with relevant doctor clinics automatically.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-xs text-red-700 mb-6" id="booking-error-banner">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" id="appointment-form">
              {/* Category & Doctor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                    1. Specialty Department *
                  </label>
                  <select
                    value={deptId}
                    onChange={(e) => { setDeptId(e.target.value); }}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:border-blue-600 focus:outline-none"
                    id="book-dept-selector"
                  >
                    <option value="">-- Choose Department --</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    2. Consultant Doctor *
                  </label>
                  <select
                    value={doctorId}
                    disabled={!deptId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:border-blue-600 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    id="book-doctor-selector"
                  >
                    <option value="">
                      {!deptId ? '-- Select Department First --' : '-- Choose Specialist --'}
                    </option>
                    {filteredDoctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name} - Rating: {doc.rating}★</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Schedule Date & time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    3. Target Date *
                  </label>
                  <input
                    type="date"
                    min={todayDateString}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:border-blue-600 focus:outline-none"
                    id="book-date-picker"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    4. Available Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:border-blue-600 focus:outline-none"
                    id="book-time-selector"
                  >
                    <option value="">-- Choose Slot --</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Personal details info */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                  5. Patient Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">Patient Full Legal Name *</span>
                    <input
                      type="text"
                      placeholder="e.g. Jane Doe"
                      disabled={!!patientProfile}
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                      id="book-patient-name"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">Patient Billing Type *</span>
                    <div className="flex gap-4 pt-1">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <input
                          type="radio"
                          checked={patientType === 'new'}
                          disabled={!!patientProfile}
                          onChange={() => setPatientType('new')}
                          className="w-3.5 h-3.5 text-blue-600"
                        />
                        New Patient
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <input
                          type="radio"
                          checked={patientType === 'returning'}
                          disabled={!!patientProfile}
                          onChange={() => setPatientType('returning')}
                          className="w-3.5 h-3.5 text-blue-600"
                        />
                        Returning Patient
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">Primary Contact Email *</span>
                    <input
                      type="email"
                      placeholder="e.g. jane.doe@gmail.com"
                      disabled={!!patientProfile}
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                      id="book-patient-email"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">Mobile Phone Number *</span>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (555) 012-3456"
                      disabled={!!patientProfile}
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:outline-none disabled:bg-slate-50 disabled:text-slate-600"
                      id="book-patient-phone"
                    />
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  6. Reason for Medical Consultation *
                </label>
                <textarea
                  placeholder="Please specify high level symptoms, chronic complaints, or references regarding this therapeutic request..."
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:outline-none"
                  id="book-visit-reason"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-blue-500/20 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                id="booking-form-submit"
              >
                Confirm Booking & Generate Confirmation
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

          {/* Right Side Doctor Preview card */}
          <div className="md:col-span-4 space-y-6">
            {selectedDocInfo ? (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4" id="booking-doc-preview-card">
                <div className="text-center pb-4 border-b border-slate-100">
                  <img
                    src={selectedDocInfo.image}
                    alt={selectedDocInfo.name}
                    className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="font-bold text-slate-900 text-base leading-tight uppercase">{selectedDocInfo.name}</h3>
                  <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full mt-1.5 inline-block">
                    {DEPARTMENTS.find(d => d.id === selectedDocInfo.departmentId)?.name}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Academic Degree</span>
                    <span className="text-slate-700 font-bold mt-0.5 block">
                      🎓 {selectedDocInfo.qualification}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Consultant Tier Fee</span>
                    <span className="text-slate-800 font-extrabold text-sm block mt-0.5">
                      ${selectedDocInfo.consultFee} USD
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Accepts Insurance</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5 inline-block border border-emerald-100">
                      Standard PPO plans accepted
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-8 text-center text-slate-400 space-y-2 h-48 flex flex-col justify-center items-center" id="booking-doc-empty">
                <Stethoscope className="w-10 h-10 text-slate-300" />
                <p className="text-xs font-semibold pl-4 pr-4">Pick a specialty doctor to inspect qualifications and clinical insurance codes immediately.</p>
              </div>
            )}

            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4" id="booking-support-card">
              <h3 className="font-bold text-sm tracking-tight font-display">Need Custom Assistance?</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                If you are looking to book a same-day trauma intervention or have trouble accessing diagnostic dates online:
              </p>
              <div className="space-y-2 text-xs pt-1">
                <p className="flex items-center gap-2 font-bold text-red-300 font-mono">
                  🚨 Trauma Care: +1 (800) 555-0199
                </p>
                <p className="flex items-center gap-2 text-slate-300 font-mono">
                  📞 Help Desk: +1 (555) WE-CARE-01
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
