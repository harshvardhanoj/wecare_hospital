/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Department, Doctor } from '../types';
import { Heart, Brain, Baby, Activity, ShieldAlert, Sparkles, MapPin, Bed, Star, ChevronRight, Check } from 'lucide-react';

interface DepartmentsViewProps {
  setCurrentTab: (tab: string) => void;
  setSelectedDeptIdForBooking: (id: string | null) => void;
  setSelectedDoctorIdForBooking: (id: string | null) => void;
}

export default function DepartmentsView({ setCurrentTab, setSelectedDeptIdForBooking, setSelectedDoctorIdForBooking }: DepartmentsViewProps) {
  const [activeDeptId, setActiveDeptId] = useState<string>(DEPARTMENTS[0].id);

  // Map icon name to Lucide Icon
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Brain': return <Brain className="w-5 h-5" />;
      case 'Baby': return <Baby className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const selectedDept = DEPARTMENTS.find(d => d.id === activeDeptId) || DEPARTMENTS[0];
  const deptDoctors = DOCTORS.filter(doc => doc.departmentId === selectedDept.id);

  const handleBookingRedirect = (deptId: string, doctorId: string | null = null) => {
    setSelectedDeptIdForBooking(deptId);
    setSelectedDoctorIdForBooking(doctorId);
    setCurrentTab('booking');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="departments-view-container">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
          Clinics & Academics
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">Specialized Clinical Departments</h1>
        <p className="text-sm text-slate-500 mt-2">
          Select an interactive department below to inspect head specialists, diagnostic coordinates, bedside capability, and available doctors roster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Side Selector */}
        <div className="md:col-span-4 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-xs space-y-1" id="dept-menu">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Select Speciality
          </label>
          {DEPARTMENTS.map((dept) => {
            const isActive = dept.id === activeDeptId;
            return (
              <button
                key={dept.id}
                onClick={() => setActiveDeptId(dept.id)}
                className={`w-full text-left px-4 py-3.5 rounded-xl transition-all font-semibold text-sm flex items-center justify-between group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                    : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                }`}
                id={`dept-tab-${dept.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
                  }`}>
                    {renderIcon(dept.icon)}
                  </div>
                  <span>{dept.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-0.5' : 'text-slate-400 group-hover:translate-x-1'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Side Detail Pane */}
        <div className="md:col-span-8 bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8" id="dept-detail-pane">
          {/* Dept Banner Info */}
          <div className="border-b border-slate-100 pb-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                {renderIcon(selectedDept.icon)}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 font-display">{selectedDept.name} Department</h2>
                <div className="flex flex-wrap gap-4 mt-1 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    {selectedDept.location}
                  </span>
                  <span className="flex items-center gap-1 border-l border-slate-200 pl-4">
                    <Bed className="w-3.5 h-3.5 text-blue-500" />
                    {selectedDept.bedsCount} Active Patient Beds
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              {selectedDept.longDescription}
            </p>
          </div>

          {/* Core Facilities & Features */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Department Capabilities & Facilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedDept.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-xs">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Head specialty */}
          <div className="p-4 bg-blue-50/20 border border-blue-100/50 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Clinical Chief of Staff
              </span>
              <h4 className="font-bold text-slate-800 text-sm mt-1">{selectedDept.headOfDept}</h4>
              <p className="text-xs text-slate-500">Supervising Director of medical protocols inside {selectedDept.name}</p>
            </div>
            <button
              onClick={() => handleBookingRedirect(selectedDept.id)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Consult Lab Head
            </button>
          </div>

          {/* Assigned Doctors */}
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-100/40 p-3 rounded-xl">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                Doctors Assigned to {selectedDept.name}
              </h3>
              <span className="text-[10px] bg-slate-200/50 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {deptDoctors.length} Specialists
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deptDoctors.map((doc) => (
                <div key={doc.id} className="border border-slate-150 rounded-2xl p-4 flex gap-4 hover:border-blue-400 hover:shadow-xs transition-all group">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-600">{doc.name}</h4>
                      <div className="flex items-center text-amber-500 text-xs shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                        <span className="font-semibold">{doc.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{doc.title}</p>
                    <p className="text-[10px] font-medium text-slate-400 capitalize">Exp: {doc.experience} Years • Fee: ${doc.consultFee}</p>
                    
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => handleBookingRedirect(selectedDept.id, doc.id)}
                        className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[10px] font-bold text-center transition-colors cursor-pointer"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
