/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  PatientProfile, VitalsReading, Prescription, LabResult, MedicalRecord, Appointment 
} from '../types';
import { 
  DEFAULT_PATIENT, DEFAULT_VITALS, DEFAULT_PRESCRIPTIONS, 
  DEFAULT_LAB_RESULTS, DEFAULT_MEDICAL_RECORDS, DEFAULT_APPOINTMENTS 
} from '../data';
import { 
  LayoutDashboard, FileText, Pill, ShieldCheck, CalendarCheck, CalendarX, 
  Activity, User, Phone, MapPin, AlertCircle, TrendingUp, Check, RefreshCw, Eye, Edit, Save, Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

interface PatientPortalViewProps {
  onLoginSuccess: (profile: PatientProfile, appointments: Appointment[]) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  loggedInProfile: PatientProfile | null;
  patientAppointments: Appointment[];
  onCancelAppointment: (id: string) => void;
}

export default function PatientPortalView({
  onLoginSuccess,
  onLogout,
  isLoggedIn,
  loggedInProfile,
  patientAppointments,
  onCancelAppointment
}: PatientPortalViewProps) {
  // Login Panel inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Edit Profile Panel Inputs
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAge, setEditAge] = useState<number>(30);
  const [editBloodType, setEditBloodType] = useState('Universal (O+)');
  const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Other'>('Other');
  const [editHeight, setEditHeight] = useState<number>(170);
  const [editWeight, setEditWeight] = useState<number>(65);
  const [editEmergencyName, setEditEmergencyName] = useState('');
  const [editEmergencyRel, setEditEmergencyRel] = useState('');
  const [editEmergencyPhone, setEditEmergencyPhone] = useState('');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Dashboard Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'vitals' | 'prescriptions' | 'labs' | 'records' | 'appointments'>('overview');

  // Interactive refill and report parameters
  const [refillingRxIds, setRefillingRxIds] = useState<Record<string, 'loading' | 'done'>>({});
  const [viewingLabResult, setViewingLabResult] = useState<LabResult | null>(null);

  // Core local states for reports if mock registers
  const [localPrescriptions, setLocalPrescriptions] = useState<Prescription[]>(DEFAULT_PRESCRIPTIONS);
  const [localLabResults, setLocalLabResults] = useState<LabResult[]>(DEFAULT_LAB_RESULTS);
  const [localRecords, setLocalRecords] = useState<MedicalRecord[]>(DEFAULT_MEDICAL_RECORDS);

  // Initialize edit profile fields when user is loaded
  React.useEffect(() => {
    if (loggedInProfile) {
      setEditName(loggedInProfile.name || '');
      setEditPhone(loggedInProfile.phone || '');
      setEditAge(loggedInProfile.age || 30);
      setEditBloodType(loggedInProfile.bloodType || 'Universal (O+)');
      setEditGender(loggedInProfile.gender || 'Other');
      setEditHeight(loggedInProfile.height || 170);
      setEditWeight(loggedInProfile.weight || 65);
      setEditEmergencyName(loggedInProfile.emergencyContact?.name || '');
      setEditEmergencyRel(loggedInProfile.emergencyContact?.relationship || '');
      setEditEmergencyPhone(loggedInProfile.emergencyContact?.phone || '');
    }
  }, [loggedInProfile]);

  // Handle standard demo login (backed by real Firebase Auth to secure Firestore queries)
  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    const demoEmail = 'jane.doe@gmail.com';
    const demoPassword = 'janedoe123#';

    try {
      // Attempt login
      const credentials = await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      console.log("Demo logged in successfully via Firebase auth:", credentials.user.uid);
      setActiveSubTab('overview');
    } catch (err: any) {
      // If user does not exist or credentials incorrect, seed Jane Doe first!
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          console.log("Seeding demo patient Jane Doe with Firebase credentials...");
          const userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
          const uid = userCredential.user.uid;

          // Seed user profile Card in Firestore
          const profileDocPath = `users/${uid}`;
          try {
            await setDoc(doc(db, 'users', uid), {
              id: uid,
              name: 'Jane Doe',
              email: demoEmail,
              phone: '+1 (555) 732-9011',
              age: 34,
              bloodType: 'A-Positive (A+)',
              allergies: ['Penicillin', 'Peanuts', 'Pollen'],
              gender: 'Female',
              emergencyContact: {
                name: 'John Doe',
                relationship: 'Spouse',
                phone: '+1 (555) 732-9012'
              },
              height: 168,
              weight: 62.4
            });
          } catch (profileErr) {
            handleFirestoreError(profileErr, OperationType.CREATE, profileDocPath);
          }

          // Seed initial mock appointments in Firestore for Jane Doe
          for (const apt of DEFAULT_APPOINTMENTS) {
            const aptDocPath = `appointments/${apt.id}`;
            try {
              await setDoc(doc(db, 'appointments', apt.id), {
                ...apt,
                userId: uid
              });
            } catch (aptErr) {
              handleFirestoreError(aptErr, OperationType.CREATE, aptDocPath);
            }
          }

          console.log("Demo Jane Doe seeded in Firestore successfully!");
          setActiveSubTab('overview');
        } catch (seedErr: any) {
          setError(`Could not seed demo patient: ${seedErr.message}`);
        }
      } else {
        setError(`Demo Sign In failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google Provider login
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setActiveSubTab('overview');
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.toLowerCase().includes('unauthorized-domain'))) {
        const currentDomain = window.location.hostname;
        setError(`Firebase Security requires authorizing your current domain to allow Single Sign-In with Google.\n\nTo resolve this:\n1. Open your Firebase Console (for "wecare-hospitals-b73dd")\n2. Navigate to Authentication > Settings > Authorized Domains\n3. Click "Add domain" and add exactly: "${currentDomain}"\n4. Once saved, refresh this page and authenticate successfully!`);
      } else {
        setError(err.message || 'Google Auth Error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle custom email/password registration or logging in using the real SDK
  const handleLocalAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!authEmail.trim()) {
      setIsLoading(false);
      return setError('Please provide a valid email address.');
    }
    if (!authPassword || authPassword.length < 6) {
      setIsLoading(false);
      return setError('Password must be at least 6 characters long.');
    }

    try {
      if (isRegisterMode) {
        if (!authName.trim()) {
          setIsLoading(false);
          return setError('Please provide your legal name to register.');
        }

        // Create Firebase account
        const credentials = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const uid = credentials.user.uid;

        // Initialize corresponding Patient Profile document in Firestore
        const profileDocPath = `users/${uid}`;
        const newProfile: PatientProfile = {
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
        };

        try {
          await setDoc(doc(db, 'users', uid), newProfile);
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.CREATE, profileDocPath);
        }

        // Clean arrays
        setLocalPrescriptions([]);
        setLocalLabResults([]);
        setLocalRecords([]);
      } else {
        // Log in of existing Firebase account
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
      setActiveSubTab('overview');
    } catch (err: any) {
      let friendlyMessage = err.message;
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.toLowerCase().includes('unauthorized-domain'))) {
        const currentDomain = window.location.hostname;
        friendlyMessage = `Firebase Security requires authorizing your current domain to allow Patient authentication.\n\nTo resolve this:\n1. Open your Firebase Console\n2. Navigate to Authentication > Settings > Authorized Domains\n3. Click "Add domain" and add exactly: "${currentDomain}"\n4. Once saved, refresh this page and log in!`;
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password combination.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email is already registered and in use.';
      } else if (err.code === 'auth/user-not-found') {
        friendlyMessage = 'No account associated with this email address found.';
      }
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Profile saver to Firestore
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInProfile) return;
    setError('');
    setProfileSaveSuccess(false);

    const profileDocPath = `users/${loggedInProfile.id}`;
    const updatedProfile: Partial<PatientProfile> = {
      name: editName,
      phone: editPhone,
      age: Number(editAge),
      bloodType: editBloodType,
      gender: editGender,
      height: Number(editHeight),
      weight: Number(editWeight),
      emergencyContact: {
        name: editEmergencyName,
        relationship: editEmergencyRel,
        phone: editEmergencyPhone
      }
    };

    try {
      await updateDoc(doc(db, 'users', loggedInProfile.id), updatedProfile);
      setProfileSaveSuccess(true);
      setIsEditingProfile(false);
      // Wait for Auth snapshot list to refresh the profile parent state, or trigger refresh
      onLoginSuccess({
        ...loggedInProfile,
        ...updatedProfile
      } as PatientProfile, patientAppointments);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, profileDocPath);
    }
  };

  const handleRefillRequest = (rxId: string) => {
    setRefillingRxIds(prev => ({ ...prev, [rxId]: 'loading' }));
    setTimeout(() => {
      setRefillingRxIds(prev => ({ ...prev, [rxId]: 'done' }));
    }, 1500);
  };


  // Render SVG interactive charts for Blood Pressure/Heart rate
  const renderVitalsChart = () => {
    // We are graphingDEFAULT_VITALS over time.
    // Systolic values range from ~110 to ~130.
    // Diastolic values range from ~70 to ~90.
    // Date coordinates
    const pointsCount = DEFAULT_VITALS.length;
    const width = 500;
    const height = 180;
    const padding = 30;

    // Map functions
    const getX = (index: number) => padding + (index * (width - 2 * padding) / (pointsCount - 1));
    // map values from 60 - 130 to pixels
    const getY = (val: number) => {
      const minVal = 60;
      const maxVal = 135;
      return height - padding - ((val - minVal) * (height - 2 * padding) / (maxVal - minVal));
    };

    const systolicPoints = DEFAULT_VITALS.map((vit, idx) => `${getX(idx)},${getY(vit.bloodPressureSystolic)}`).join(' ');
    const diastolicPoints = DEFAULT_VITALS.map((vit, idx) => `${getX(idx)},${getY(vit.bloodPressureDiastolic)}`).join(' ');
    const heartRatePoints = DEFAULT_VITALS.map((vit, idx) => `${getX(idx)},${getY(vit.heartRate)}`).join(' ');

    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xs" id="vitals-chart-block">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5 font-display">
              <TrendingUp className="w-5 h-5 text-blue-600 animate-pulse" />
              Interactive Health Trends (Jane Doe)
            </h3>
            <p className="text-slate-500 text-xs">A historic tracking of diagnostic outpatient vital consultations over time.</p>
          </div>

          {/* Color Indicators Legend */}
          <div className="flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Systolic BP</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Diastolic BP</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Heart Rate</span>
          </div>
        </div>

        <div className="relative w-full overflow-x-auto min-w-[320px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-slate-300">
            {/* Grid Lines */}
            <line x1={padding} y1={getY(120)} x2={width - padding} y2={getY(120)} stroke="#e2e8f0" strokeDasharray="3" />
            <line x1={padding} y1={getY(80)} x2={width - padding} y2={getY(80)} stroke="#e2e8f0" strokeDasharray="3" strokeWidth="0.5" />
            <line x1={padding} y1={getY(60)} x2={width - padding} y2={getY(60)} stroke="#e2e8f0" strokeWidth="0.5" />

            {/* X Axis Labels */}
            {DEFAULT_VITALS.map((vit, idx) => (
              <text key={idx} x={getX(idx)} y={height - 5} textAnchor="middle" className="text-[9px] fill-slate-400 font-bold font-mono">
                {vit.date.split('-').slice(1).join('/')}
              </text>
            ))}

            {/* Y Axis Reference Labels */}
            <text x={10} y={getY(120) + 4} className="text-[8px] fill-slate-400 font-bold font-mono">120 mmHg</text>
            <text x={10} y={getY(80) + 4} className="text-[8px] fill-slate-400 font-bold font-mono">80 mmHg</text>
            <text x={10} y={getY(60) + 4} className="text-[8px] fill-slate-400 font-bold font-mono">60 bpm</text>

            {/* Lines */}
            <polyline fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={systolicPoints} />
            <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={diastolicPoints} />
            <polyline fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeDasharray="1.5" strokeLinejoin="round" points={heartRatePoints} />

            {/* Systolic Dots */}
            {DEFAULT_VITALS.map((vit, idx) => (
              <circle key={`sys-${idx}`} cx={getX(idx)} cy={getY(vit.bloodPressureSystolic)} r="4" className="fill-white stroke-red-500 stroke-2 hover:r-5 transition-all cursor-pointer" />
            ))}

            {/* Diastolic Dots */}
            {DEFAULT_VITALS.map((vit, idx) => (
              <circle key={`dia-${idx}`} cx={getX(idx)} cy={getY(vit.bloodPressureDiastolic)} r="4" className="fill-white stroke-blue-500 stroke-2 hover:r-5 transition-all cursor-pointer" />
            ))}

            {/* Heart Rate Dots */}
            {DEFAULT_VITALS.map((vit, idx) => (
              <circle key={`hr-${idx}`} cx={getX(idx)} cy={getY(vit.heartRate)} r="3" className="fill-teal-600 hover:r-4 transition-all cursor-pointer" />
            ))}
          </svg>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4 text-xs text-slate-500 justify-center">
          <p>⚠️ BP Baseline: <strong className="text-slate-700">116/75 mmHg</strong> (Optimal Normal Range)</p>
          <span>•</span>
          <p>❤️ Resting Pulse: <strong className="text-slate-700">68 bpm</strong> (Athletic Baseline)</p>
        </div>
      </div>
    );
  };

  const getBmi = (w: number, h: number) => {
    const heightInMeters = h / 100;
    return (w / (heightInMeters * heightInMeters)).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="portal-view-container">
      {!isLoggedIn || !loggedInProfile ? (
        /* PORTAL AUTHENTICATION FRONT GATE */
        <div className="max-w-md mx-auto space-y-6" id="portal-auth-center">
          {/* Landing Brand Banner */}
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-wider">
              Secure WeCare Ingress
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">Access WeCare Patient Portal</h1>
            <p className="text-xs text-slate-500 leading-relaxed ml-2 mr-2">
              Log in to view blood panels, active prescriptions, manage clinic bookings, and track physiological health trends.
            </p>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* DEMO ACCESS CTA BAR (ULTRA CONVENIENT TO SHOW OFF BEAUTIFUL MOCK HISTORIES) */}
            <div className="bg-blue-50 border border-blue-200/60 rounded-2xl p-4 text-center space-y-2.5" id="demo-badge-panel">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide">
                💨 Fast Evaluation Option
              </h4>
              <p className="text-[11px] text-blue-600 leading-relaxed">
                Click this button to immediately load our pre-configured demo patient profile. This provides instant access to prefilled charts, prescription refills, and medical laboratory papers.
              </p>
              <button
                onClick={handleDemoLogin}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-shadow cursor-pointer"
                id="portal-btn-demologin"
              >
                Log In with Demo Profile (Jane Doe)
              </button>
            </div>

            <div className="relative flex py-2 items-center text-slate-350" id="auth-divider">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-wider">Or credentials</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-700 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-650" />
                <span className="whitespace-pre-line leading-relaxed">{error}</span>
              </div>
            )}

            {/* Standard Login/Register FORM */}
            <form onSubmit={handleLocalAuthSubmit} className="space-y-4" id="portal-manual-auth">
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
                      id="portal-auth-name"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Contact Phone Number *</span>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 732-9011"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-xs"
                      id="portal-auth-phone"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Registered Email Address *</span>
                <input
                  type="email"
                  required
                  placeholder="e.g. jane.doe@gmail.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-xs"
                  id="portal-auth-email"
                />
              </div>

              <div className="space-y-1 animate-in fade-induration-150">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Security Password *</span>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-none text-xs"
                  id="portal-auth-password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-slate-900 border border-transparent hover:bg-slate-850 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-300"
                id="portal-auth-submit"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    {isRegisterMode ? 'Register & Spin Up Profile' : 'Proceed Securely'}
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }}
              className="w-full text-center text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              id="portal-tab-switch"
            >
              {isRegisterMode ? 'Already have a record? Log In' : 'New to WeCare? Initialize Profile'}
            </button>

            <div className="relative flex py-1 items-center text-slate-300" id="google-auth-divider">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">or use single sign-on</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              id="portal-auth-google"
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
      ) : (
        /* REGISTERED USER PORTAL PANEL */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="portal-dashboard">
          {/* Main profile dashboard sidebar */}
          <div className="lg:col-span-3 bg-white border border-slate-200/65 rounded-3xl p-5 shadow-xs space-y-6" id="portal-sidebar-nav">
            {/* Quick mini profile header */}
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-base font-extrabold text-blue-700 mx-auto border-2 border-blue-200 shadow-inner">
                {loggedInProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="font-bold text-slate-800 text-base mt-2.5 tracking-tight font-display">{loggedInProfile.name}</h3>
              <span className="text-[10.5px] bg-slate-100 text-slate-500 font-semibold px-2.5 py-0.5 rounded-full mt-1.5 inline-block font-mono">
                ID: {loggedInProfile.id.substring(0, 10)}
              </span>
            </div>

            {/* Sidebar navigation links */}
            <div className="space-y-1">
              {[
                { label: 'Portal Overview', key: 'overview', icon: LayoutDashboard },
                { label: 'Physiology Vitals', key: 'vitals', icon: Activity },
                { label: 'My Prescriptions', key: 'prescriptions', icon: Pill },
                { label: 'Laboratory Diagnostics', key: 'labs', icon: FileText },
                { label: 'My Medical Records', key: 'records', icon: ShieldCheck },
                { label: 'Clinic Appointments', key: 'appointments', icon: CalendarCheck }
              ].map((item) => {
                const NavIcon = item.icon;
                const active = activeSubTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveSubTab(item.key as any)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all font-semibold text-xs flex items-center gap-2.5 ${
                      active
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100/50'
                        : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                    }`}
                    id={`sub-nav-${item.key}`}
                  >
                    <NavIcon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mini Contact Cards */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-[11px] text-slate-500">
              <div className="flex gap-2 leading-relaxed">
                <User className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-700 block text-[10.5px]">Representative Guard</span>
                  <p>{loggedInProfile.emergencyContact.name} ({loggedInProfile.emergencyContact.relationship}) • {loggedInProfile.emergencyContact.phone}</p>
                </div>
              </div>

              {loggedInProfile.allergies.length > 0 && (
                <div className="border-t border-slate-100 pt-2.5">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Critical Allergies alerts</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {loggedInProfile.allergies.map(alg => (
                      <span key={alg} className="bg-red-50 text-red-650 border border-red-100 px-2 py-0.5 rounded-md text-[9px] font-bold">
                        {alg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="w-full py-2 bg-red-50 text-red-600 font-semibold rounded-xl text-xs hover:bg-red-100 transition-colors cursor-pointer text-center"
              id="portal-sidebar-logout"
            >
              Sign out from Portal
            </button>
          </div>

          {/* Main Active content viewer */}
          <div className="lg:col-span-9 space-y-6">
            {/* TAB OVERVIEW */}
            {activeSubTab === 'overview' && (
              <div className="space-y-6" id="portal-segment-overview">
                {/* Greeting Jumbotron with Edit Profile Trigger */}
                <div className="bg-gradient-to-br from-indigo-900 to-blue-950 p-6 sm:p-8 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  {/* Backdrop */}
                  <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>

                  <div className="space-y-2.5 z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-indigo-300 bg-white/10 px-2.5 py-0.5 rounded-md">
                        Digital Patient Dashboard
                      </span>
                      <button 
                        onClick={() => {
                          setIsEditingProfile(!isEditingProfile);
                          setProfileSaveSuccess(false);
                        }}
                        className="text-[10.5px] uppercase font-bold text-white hover:text-blue-200 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {isEditingProfile ? 'Cancel Edits' : 'Edit Health Records'}
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold font-display leading-tight">Welcome Back, {loggedInProfile.name}!</h2>
                    <p className="text-slate-350 text-xs">All outpatient metrics, diagnostic lab sheets, and therapeutic prescriptions are safe.</p>
                  </div>

                  <div className="flex gap-4 shrink-0 font-display z-10">
                    <div className="bg-white/10 px-4 py-3 border border-white/5 rounded-xl text-center min-w-[70px]">
                      <span className="text-[10px] text-slate-350 font-bold block uppercase tracking-wider">Blood Type</span>
                      <strong className="text-base text-white">{loggedInProfile.bloodType.split(' ')[0]}</strong>
                    </div>
                    <div className="bg-white/10 px-4 py-3 border border-white/5 rounded-xl text-center min-w-[70px]">
                      <span className="text-[10px] text-slate-350 font-bold block uppercase tracking-wider">Age</span>
                      <strong className="text-base text-white">{loggedInProfile.age} Yrs</strong>
                    </div>
                  </div>
                </div>

                {/* Patient Profile Editing Form */}
                {isEditingProfile && (
                  <form onSubmit={handleSaveProfile} className="bg-white border-2 border-blue-100 rounded-3xl p-6 shadow-md space-y-6 animate-in slide-in-from-top-4 duration-250" id="portal-edit-profile-form">
                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base font-display">Update Personal Health Specs</h3>
                        <p className="text-xs text-slate-500">Edit biometric baselines, contacts info, and standard files identifiers.</p>
                      </div>
                      <span className="text-[9.5px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                        Active Cloud Synchronization
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500">Full Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500">Contact Phone *</label>
                        <input
                          type="text"
                          required
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500">Age (Years) *</label>
                        <input
                          type="number"
                          required
                          min={0}
                          max={130}
                          value={editAge}
                          onChange={(e) => setEditAge(Number(e.target.value))}
                          className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500">Blood Type Group *</label>
                        <select
                          value={editBloodType}
                          onChange={(e) => setEditBloodType(e.target.value)}
                          className="w-full py-2 px-2.5 rounded-xl border border-slate-200 text-xs focus:border-blue-600 focus:outline-none bg-white"
                        >
                          <option value="A-Positive (A+)">A-Positive (A+)</option>
                          <option value="A-Negative (A-)">A-Negative (A-)</option>
                          <option value="B-Positive (B+)">B-Positive (B+)</option>
                          <option value="B-Negative (B-)">B-Negative (B-)</option>
                          <option value="O-Positive (O+)">O-Positive (O+)</option>
                          <option value="O-Negative (O-)">O-Negative (O-)</option>
                          <option value="AB-Positive (AB+)">AB-Positive (AB+)</option>
                          <option value="AB-Negative (AB-)">AB-Negative (AB-)</option>
                          <option value="Universal (O+)">Universal (O+)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500">Gender *</label>
                        <select
                          value={editGender}
                          onChange={(e) => setEditGender(e.target.value as any)}
                          className="w-full py-2 px-2.5 rounded-xl border border-slate-200 text-xs focus:border-blue-600 focus:outline-none bg-white"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500">Height (cm) *</label>
                        <input
                          type="number"
                          required
                          value={editHeight}
                          onChange={(e) => setEditHeight(Number(e.target.value))}
                          className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500">Weight (kg) *</label>
                        <input
                          type="number"
                          required
                          step="0.1"
                          value={editWeight}
                          onChange={(e) => setEditWeight(Number(e.target.value))}
                          className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4">
                      <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Emergency Contact Representative</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-450 uppercase">Legal Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Marie Doe"
                            value={editEmergencyName}
                            onChange={(e) => setEditEmergencyName(e.target.value)}
                            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none bg-white font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-455 uppercase">Relationship</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sibling, Spouse"
                            value={editEmergencyRel}
                            onChange={(e) => setEditEmergencyRel(e.target.value)}
                            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none bg-white font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-455 uppercase">Contact Mobile</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. +1 (555) 0180"
                            value={editEmergencyPhone}
                            onChange={(e) => setEditEmergencyPhone(e.target.value)}
                            className="w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none bg-white font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                      >
                        Cancel Edits
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-500/10"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Commit to Cloud Firestore
                      </button>
                    </div>
                  </form>
                )}

                {profileSaveSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 text-xs text-emerald-700 font-semibold rounded-xl flex items-center gap-1.5 animate-in fade-in duration-200">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Personal biometrics saved and replicated inside Firestore successfully!</span>
                  </div>
                )}

                {/* Patient Biometrics metrics widgets */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="metric-grid">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Height coordinate</span>
                    <strong className="text-slate-800 text-base sm:text-lg block mt-0.5">{loggedInProfile.height} cm</strong>
                    <span className="text-[9.5px] text-slate-400">5 ft 6 inches equivalent</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Scale Weight</span>
                    <strong className="text-slate-800 text-base sm:text-lg block mt-0.5">{loggedInProfile.weight} kg</strong>
                    <span className="text-[9.5px] text-slate-400">137.5 lbs equivalent</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Derived BMI index</span>
                    <strong className="text-slate-800 text-base sm:text-lg block mt-0.5">
                      {getBmi(loggedInProfile.weight, loggedInProfile.height)} mg/m²
                    </strong>
                    <span className="text-[9.5px] text-slate-400 font-semibold text-emerald-600">Optimal Healthy Tier</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Oxygen saturation</span>
                    <strong className="text-slate-800 text-base sm:text-lg block mt-0.5">
                      {loggedInProfile.name === 'Jane Doe' ? '99 %' : '98 %'}
                    </strong>
                    <span className="text-[9.5px] text-emerald-600 font-bold">SpO2 Normal</span>
                  </div>
                </div>

                {/* Embedded Vitals Graph Chart */}
                {loggedInProfile.name === 'Jane Doe' ? renderVitalsChart() : (
                  <div className="p-6 bg-white border border-slate-150 rounded-2xl text-center text-slate-400 text-xs">
                    No historic vitals logged. Create active clinic bookings to generate medical records.
                  </div>
                )}

                {/* Dual Grid: appointments preview & prescriptions shortcut */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Appointments card */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h4 className="font-bold text-slate-900 text-sm font-display flex items-center gap-1.5 pb-0.5">
                        <CalendarCheck className="w-4 h-4 text-blue-500" /> Current Clinic Appointments
                      </h4>
                      <span className="text-[10px] bg-blue-55 text-blue-600 font-bold px-2 py-0.5 rounded-full">
                        {patientAppointments.length} Booked
                      </span>
                    </div>

                    <div className="space-y-3">
                      {patientAppointments.length > 0 ? (
                        patientAppointments.filter(apt => apt.status === 'scheduled').slice(0, 2).map((apt) => (
                          <div key={apt.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-2 text-xs hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <strong className="text-slate-800 font-bold block">{apt.doctorName}</strong>
                                <span className="text-[10.5px] text-slate-400">{apt.departmentName}</span>
                              </div>
                              <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md font-mono">
                                {apt.timeSlot}
                              </span>
                            </div>
                            <div className="pt-2 border-t border-slate-200/50 flex justify-between text-[10.5px] text-slate-500">
                              <span>📅 Date: <strong>{apt.date}</strong></span>
                              <button 
                                onClick={() => setActiveSubTab('appointments')}
                                className="text-blue-600 hover:underline font-bold"
                              >
                                Manage appointment
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-slate-400 text-xs">
                          No active scheduled appointments recorded.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active RX cards */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h4 className="font-bold text-slate-900 text-sm font-display flex items-center gap-1.5 pb-0.5">
                        <Pill className="w-4 h-4 text-blue-500" /> Active Medications
                      </h4>
                      <span className="text-[10px] bg-teal-55 text-teal-600 font-bold px-2 py-0.5 rounded-full">
                        {loggedInProfile.name === 'Jane Doe' ? localPrescriptions.length : 0} Logged
                      </span>
                    </div>

                    <div className="space-y-3">
                      {loggedInProfile.name === 'Jane Doe' && localPrescriptions.length > 0 ? (
                        localPrescriptions.map(rx => (
                          <div key={rx.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1 text-xs">
                            <div className="flex justify-between items-center">
                              <strong className="text-slate-800 font-bold">{rx.medication}</strong>
                              <span className="text-[10px] text-slate-400">{rx.dosage}</span>
                            </div>
                            <p className="text-[10.5px] text-slate-500">Directions: {rx.frequency} • {rx.instructions}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-slate-400 text-xs">
                          No outpatient pharmacy drug scripts prescribed currently.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB PHYSIOLOGY VITALS */}
            {activeSubTab === 'vitals' && (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="portal-segment-vitals">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 font-display">Physiological Vitals History</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    A secure clinical history of biometric measurements compiled by WeCare diagnostic technicians.
                  </p>
                </div>

                {loggedInProfile.name === 'Jane Doe' ? (
                  <>
                    {/* Graph render */}
                    {renderVitalsChart()}

                    {/* Vitals Table list */}
                    <div className="border border-slate-150 rounded-2xl overflow-hidden mt-6">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50/80 text-slate-400 border-b border-slate-150 uppercase tracking-wider font-semibold">
                            <th className="p-3.5 pl-4">Consult Date</th>
                            <th className="p-3.5">Blood Pressure</th>
                            <th className="p-3.5">Heart Rate (bpm)</th>
                            <th className="p-3.5">Weight (kg)</th>
                            <th className="p-3.5">Oxygen Level</th>
                            <th className="p-3.5 pr-4">Evaluation Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {DEFAULT_VITALS.map((vit, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-3.5 pl-4 font-mono font-bold text-slate-800">{vit.date}</td>
                              <td className="p-3.5">{vit.bloodPressureSystolic}/{vit.bloodPressureDiastolic} mmHg</td>
                              <td className="p-3.5">{vit.heartRate} bpm</td>
                              <td className="p-3.5">{vit.weight} kg</td>
                              <td className="p-3.5">{vit.oxygenLevel}% SpO2</td>
                              <td className="p-3.5 pr-4">
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                                  Healthy Optimal
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-slate-405 text-xs">
                    No historic biometric vitals logged under this user credential.
                  </div>
                )}
              </div>
            )}

            {/* TAB MY PRESCRIPTIONS */}
            {activeSubTab === 'prescriptions' && (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="portal-segment-prescriptions">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 font-display">My Drug Prescriptions (Outpatient Care)</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Authentic pharmacy drug prescriptions issued directly by our supervising ward clinicians.
                  </p>
                </div>

                {loggedInProfile.name === 'Jane Doe' && localPrescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {localPrescriptions.map((rx) => {
                      const refillState = refillingRxIds[rx.id];
                      return (
                        <div key={rx.id} className="border border-slate-150 rounded-2xl p-5 hover:border-blue-400/60 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-100 flex items-center justify-center p-3 text-blue-600 font-mono text-[9px] font-extrabold">
                                Rx
                              </span>
                              <h3 className="font-extrabold text-slate-900 text-sm">{rx.medication}</h3>
                              <span className="text-[10px] font-bold text-slate-400 font-mono">({rx.dosage})</span>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed font-sans">{rx.instructions}</p>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-slate-400 font-medium">
                              <span>📅 Prescribed: <strong>{rx.date}</strong></span>
                              <span>•</span>
                              <span>✍️ Physician: <strong>{rx.doctorName}</strong></span>
                              <span>•</span>
                              <span>⏳ Duration: <strong>{rx.duration}</strong></span>
                            </div>
                          </div>

                          {/* Refill Button widget with responsive simulation states */}
                          <div className="shrink-0 w-full sm:w-auto">
                            {refillState === 'loading' ? (
                              <button disabled className="w-full sm:w-auto px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Submission Loading...
                              </button>
                            ) : refillState === 'done' ? (
                              <span className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-100">
                                <Check className="w-3.5 h-3.5" /> Refill Requested!
                              </span>
                            ) : (
                              <button
                                onClick={() => handleRefillRequest(rx.id)}
                                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
                              >
                                Request Pharmacy Refill
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs border border-dashed border-slate-205 rounded-2xl">
                    No active prescriptions recorded. Consult a clinician to draft medication regimens.
                  </div>
                )}
              </div>
            )}

            {/* TAB LABORATORY DIAGNOSTICS */}
            {activeSubTab === 'labs' && (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="portal-segment-labs">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 font-display">Diagnostic Lab Panels</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Chemical and physiological laboratory calculations mapped alongside regulatory clinical ranges.
                  </p>
                </div>

                {loggedInProfile.name === 'Jane Doe' && localLabResults.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {localLabResults.map((result) => (
                        <div 
                          key={result.id} 
                          onClick={() => setViewingLabResult(result)}
                          className="border border-slate-150 hover:border-blue-400 hover:shadow-xs p-4 rounded-2xl cursor-pointer transition-all space-y-3 bg-slate-50/30 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-bold text-slate-400 font-mono">#{result.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                                result.status === 'Normal' 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : result.status === 'High' 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                                  : 'bg-red-50 text-red-700 border border-red-100'
                              }`}>
                                {result.status}
                              </span>
                            </div>
                            <h3 className="font-extrabold text-slate-800 text-xs mt-2 truncate">{result.testName}</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">{result.category}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
                            <div>
                              <span className="text-slate-400 block text-[9.5px]">Value / Baseline</span>
                              <strong className="text-slate-800 font-mono text-[11.5px]">{result.result}</strong>
                            </div>
                            <span className="text-blue-600 font-bold flex items-center gap-0.5">
                              Review <Eye className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Report detail expand overlay/sheet */}
                    {viewingLabResult && (
                      <div className="bg-blue-50/30 border border-blue-200/50 p-5 rounded-2xl space-y-3 relative overflow-hidden animate-in fade-in-50 duration-200" id="lab-commentary-sheet">
                        <button 
                          onClick={() => setViewingLabResult(null)} 
                          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 font-bold text-xs"
                        >
                          ✕ Hide
                        </button>
                        <span className="text-[9.5px] uppercase font-bold text-blue-600 bg-blue-105/50 px-2.5 py-0.5 rounded-md inline-block">
                          Physician Commentary Details
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{viewingLabResult.testName} Report Summary</h4>
                        <div className="grid grid-cols-2 gap-4 text-xs max-w-sm font-sans pt-1">
                          <p>🩺 <strong>Review Doctor:</strong> {viewingLabResult.doctorName}</p>
                          <p>📊 <strong>Observed Value:</strong> <span className={viewingLabResult.status !== 'Normal' ? 'text-amber-700 font-bold' : ''}>{viewingLabResult.result}</span></p>
                          <p>⚖️ <strong>Normal baseline range:</strong> {viewingLabResult.range}</p>
                          <p>📆 <strong>Panel date:</strong> {viewingLabResult.date}</p>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-200/50 font-sans italic">
                          " {viewingLabResult.notes} "
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No diagnostic blood panels compiled yet for this account.
                  </div>
                )}
              </div>
            )}

            {/* TAB MY MEDICAL RECORDS */}
            {activeSubTab === 'records' && (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="portal-segment-records">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 font-display">Patient Outpatient History</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    A comprehensive electronic medical record (EMR) detailing clinics consultation visits and immunization logs.
                  </p>
                </div>

                {loggedInProfile.name === 'Jane Doe' && localRecords.length > 0 ? (
                  <div className="relative border-l border-slate-200 pl-4 space-y-8 py-2 font-sans">
                    {localRecords.map((rec) => (
                      <div key={rec.id} className="relative group text-xs text-slate-600">
                        {/* Dot indicator */}
                        <span className="absolute -left-[20.5px] top-1.5 w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full"></span>

                        <span className="text-[10px] text-slate-400 font-mono block mb-1">{rec.date} • Reference ID: #{rec.id}</span>
                        <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                            rec.type === 'Visit' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-teal-50 text-teal-700 border border-teal-100'
                          }`}>
                            {rec.type}
                          </span>
                          {rec.title}
                        </h3>

                        <p className="text-slate-500 mt-2 leading-relaxed">{rec.description}</p>
                        <p className="text-slate-400 font-medium mt-1">✍️ Attending Consultant: <strong>{rec.doctorName}</strong></p>

                        {rec.attachment && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-[10.5px] text-blue-600 bg-blue-50/30 border border-blue-100/40 p-2 rounded-lg max-w-xs cursor-pointer hover:bg-blue-50">
                            <span>📁 Attachment: <strong className="hover:underline">{rec.attachment}</strong></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No historic outpatient records logged.
                  </div>
                )}
              </div>
            )}

            {/* TAB CLINIC APPOINTMENTS */}
            {activeSubTab === 'appointments' && (
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="portal-segment-appointments">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 font-display">My Scheduled Consultations</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage outpatient sessions, reschedule timings, or cancel pending consultations securely.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('logo-block');
                      if (element) {
                        const target = document.querySelector('[id*="cta-booking"]');
                        if (target && target instanceof HTMLButtonElement) target.click();
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    + Book New Appointment
                  </button>
                </div>

                {patientAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {patientAppointments.map((apt) => (
                      <div key={apt.id} className="border border-slate-150 rounded-2xl p-5 hover:border-slate-300 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] bg-slate-100 text-slate-500 rounded-md px-2 py-0.5 font-bold font-mono">
                              Ticket: {apt.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                              apt.status === 'scheduled' 
                                ? 'bg-blue-50 text-blue-700' 
                                : apt.status === 'completed' 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : 'bg-red-50 text-red-700 cross-line'
                            }`}>
                              {apt.status}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-slate-800 text-sm uppercase">{apt.doctorName}</h3>
                          <p className="text-slate-400 text-xs">{apt.departmentName}</p>
                          <p className="text-[11px] text-slate-505 italic">Reason for visit: "{apt.reason}"</p>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-slate-400 font-semibold pt-1 border-t border-slate-100/50">
                            <span>📅 Date: <strong>{apt.date}</strong></span>
                            <span>•</span>
                            <span>⏰ Timing: <strong>{apt.timeSlot}</strong></span>
                          </div>
                        </div>

                        {apt.status === 'scheduled' && (
                          <button
                            onClick={() => onCancelAppointment(apt.id)}
                            className="w-full sm:w-auto px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CalendarX className="w-4 h-4" /> Cancel Appointment
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs border border-slate-155 border-dashed rounded-2xl">
                    No active clinic sessions scheduled. Click the booking shortcut to assign slots.
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
