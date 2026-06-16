/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import DepartmentsView from './components/DepartmentsView';
import DoctorsView from './components/DoctorsView';
import BookingView from './components/BookingView';
import PatientPortalView from './components/PatientPortalView';
import AdminPortalView from './components/AdminPortalView';

// Types, Data, and Firebase Config
import { Appointment, PatientProfile } from './types';
import { DEFAULT_APPOINTMENTS, DEFAULT_PATIENT } from './data';
import { motion } from 'motion/react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { FIRESTORE_RULES_TEMPLATE } from './rulesTemplate';
import { ShieldAlert, Copy, Check, X, ExternalLink } from 'lucide-react';

export default function App() {
  // Navigation tab: 'home' | 'about' | 'departments' | 'doctors' | 'booking' | 'portal'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Patient Portal Login session state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInProfile, setLoggedInProfile] = useState<PatientProfile | null>(null);

  // App-wide appointments state, sourced directly from Firestore when logged in
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);

  // Actionable diagnostic error states if Firestore security rules reject reading/writing
  const [permissionError, setPermissionError] = useState<{ path: string; operation: string } | null>(null);
  const [copiedRules, setCopiedRules] = useState<boolean>(false);

  // Keep track of Firebase Auth session dynamically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase patient authenticated:", firebaseUser.uid);
        
        // Short-circuit to Admin mode if logged in with administrator security keys
        if (firebaseUser.email === 'harsharya622004@gmail.com') {
          const adminProfile: PatientProfile = {
            id: firebaseUser.uid,
            name: 'System Administrator',
            email: firebaseUser.email || 'harsharya622004@gmail.com',
            phone: '+1 (555) 888-8888',
            age: 0,
            bloodType: 'N/A',
            allergies: [],
            gender: 'Other',
            emergencyContact: {
              name: 'N/A',
              relationship: 'N/A',
              phone: 'N/A'
            },
            height: 0,
            weight: 0
          };
          setIsLoggedIn(true);
          setLoggedInProfile(adminProfile);
          setPatientAppointments([]);
          return;
        }

        // Fetch matching Patient Profile from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          let profile: PatientProfile;
          if (userDocSnap.exists()) {
            profile = userDocSnap.data() as PatientProfile;
          } else {
            // Document hasn't been created yet (e.g. Google Sign-In newly authorized user keys)
            profile = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Patient Profile',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '+1 (555) 123-4567',
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
            await setDoc(userDocRef, profile);
          }

          // Fetch all appointments linked to this UID from Firestore
          const q = query(collection(db, 'appointments'), where('userId', '==', firebaseUser.uid));
          const querySnap = await getDocs(q);
          const appointmentsList: Appointment[] = [];
          querySnap.forEach((doc) => {
             appointmentsList.push(doc.data() as Appointment);
          });
          // sort descending by date/time
          appointmentsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setIsLoggedIn(true);
          setLoggedInProfile(profile);
          setPatientAppointments(appointmentsList);
        } catch (err: any) {
          console.error("Error setting up authenticated user state:", err);
          handleFirestoreError(err, OperationType.GET, 'users/' + firebaseUser.uid);
        }
      } else {
        // Logged out
        setIsLoggedIn(false);
        setLoggedInProfile(null);
        setPatientAppointments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Set up event listener on mount to catch custom database permission alerts
  useEffect(() => {
    const handleDenied = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setPermissionError({
          path: customEvent.detail.path || 'unknown',
          operation: customEvent.detail.operationType || 'read/write'
        });
      }
    };
    window.addEventListener('firestore-permission-denied', handleDenied);
    return () => {
      window.removeEventListener('firestore-permission-denied', handleDenied);
    };
  }, []);

  const handleCopyRules = () => {
    navigator.clipboard.writeText(FIRESTORE_RULES_TEMPLATE);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2500);
  };

  // Redirectional booking filters triggers (from departemnt clinical list or doctor profile)
  const [selectedDeptIdForBooking, setSelectedDeptIdForBooking] = useState<string | null>(null);
  const [selectedDoctorIdForBooking, setSelectedDoctorIdForBooking] = useState<string | null>(null);

  // Portal callbacks
  const handleLoginSuccess = (profile: PatientProfile, initialAppointments: Appointment[]) => {
    setIsLoggedIn(true);
    setLoggedInProfile(profile);
    setPatientAppointments(initialAppointments);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setLoggedInProfile(null);
      setPatientAppointments([]);
      setCurrentTab('home');
    } catch (err) {
      console.error("Logout Error: ", err);
    }
  };

  // Booking handlers
  const handleAddAppointment = async (newApt: Appointment) => {
    if (!loggedInProfile) return;

    // Save to Firestore under appointments collection
    const aptDocPath = `appointments/${newApt.id}`;
    const mappedApt = {
      ...newApt,
      userId: loggedInProfile.id
    };

    try {
      await setDoc(doc(db, 'appointments', newApt.id), mappedApt);
      
      // Update local state instantly so user receives feedback
      setPatientAppointments(updated => [mappedApt, ...updated]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, aptDocPath);
    }
  };

  // Appointment canceler (marks as cancelled)
  const handleCancelAppointment = async (id: string) => {
    const aptDocPath = `appointments/${id}`;
    try {
      await updateDoc(doc(db, 'appointments', id), { status: 'cancelled' });
      
      // Update local state
      setPatientAppointments(prev => prev.map((apt) => {
        if (apt.id === id) {
          return { ...apt, status: 'cancelled' as const };
        }
        return apt;
      }));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, aptDocPath);
    }
  };

  const handleClearBookingSelections = () => {
    setSelectedDeptIdForBooking(null);
    setSelectedDoctorIdForBooking(null);
  };

  // Scroll to top on navigation shifts
  const handleTabTransition = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc] selection:bg-blue-100 selection:text-blue-700" id="wecare-app-root">
      {/* Sticky Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleTabTransition}
        isLoggedIn={isLoggedIn}
        patientName={loggedInProfile?.name || ''}
        onLogout={handleLogout}
      />

      {/* Main Interactive Workspaces */}
      <main className="flex-1">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="focus:outline-none"
          tabIndex={-1}
        >
          {currentTab === 'home' && (
            <HomeView setCurrentTab={handleTabTransition} />
          )}

          {currentTab === 'about' && (
            <AboutView />
          )}

          {currentTab === 'departments' && (
            <DepartmentsView
              setCurrentTab={handleTabTransition}
              setSelectedDeptIdForBooking={setSelectedDeptIdForBooking}
              setSelectedDoctorIdForBooking={setSelectedDoctorIdForBooking}
            />
          )}

          {currentTab === 'doctors' && (
            <DoctorsView
              setCurrentTab={handleTabTransition}
              setSelectedDeptIdForBooking={setSelectedDeptIdForBooking}
              setSelectedDoctorIdForBooking={setSelectedDoctorIdForBooking}
            />
          )}

          {currentTab === 'booking' && (
            <BookingView
              onAddAppointment={handleAddAppointment}
              selectedDeptId={selectedDeptIdForBooking}
              selectedDoctorId={selectedDoctorIdForBooking}
              onClearBookingSelections={handleClearBookingSelections}
              isLoggedIn={isLoggedIn}
              patientProfile={isLoggedIn && loggedInProfile ? {
                name: loggedInProfile.name,
                email: loggedInProfile.email,
                phone: loggedInProfile.phone
              } : null}
            />
          )}

          {currentTab === 'portal' && (
            <PatientPortalView
              onLoginSuccess={handleLoginSuccess}
              onLogout={handleLogout}
              isLoggedIn={isLoggedIn}
              loggedInProfile={loggedInProfile}
              patientAppointments={patientAppointments}
              onCancelAppointment={handleCancelAppointment}
            />
          )}

          {currentTab === 'admin' && (
            <AdminPortalView />
          )}
        </motion.div>
      </main>

      {/* Site Footer */}
      <Footer setCurrentTab={handleTabTransition} />

      {/* Floating Actionable Diagnostic Guide for "Missing or insufficient permissions" */}
      {permissionError && (
        <div className="fixed bottom-6 right-6 max-w-sm w-[calc(100vw-3rem)] bg-white border border-red-200 shadow-2xl rounded-3xl p-5 z-55 animate-in slide-in-from-bottom-5 duration-300" id="firestore-permission-warning">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide leading-none">Firestore Setup Required</h4>
                <button 
                  onClick={() => setPermissionError(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your database blocked a <span className="font-bold text-red-600 uppercase text-[10px] bg-red-50 px-1 rounded">{permissionError.operation}</span> request on <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono text-slate-800">{permissionError.path}</code> due to <span className="font-semibold text-slate-800">Missing or insufficient permissions</span>.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                To enable all live clinical interactions, please copy our security ruleset and publish them in your console:
              </p>
              
              <div className="pt-1.5 flex items-center gap-2">
                <button
                  onClick={handleCopyRules}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  {copiedRules ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-450" />
                      <span>Copied Rules!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Rules</span>
                    </>
                  )}
                </button>
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Firebase Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
