/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DOCTORS, DEPARTMENTS } from '../data';
import { Doctor } from '../types';
import { Star, Search, Filter, Calendar, Award, Mail, Sparkles, X, ChevronRight } from 'lucide-react';

interface DoctorsViewProps {
  setCurrentTab: (tab: string) => void;
  setSelectedDeptIdForBooking: (id: string | null) => void;
  setSelectedDoctorIdForBooking: (id: string | null) => void;
}

export default function DoctorsView({ setCurrentTab, setSelectedDeptIdForBooking, setSelectedDoctorIdForBooking }: DoctorsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [selectedDocForBio, setSelectedDocForBio] = useState<Doctor | null>(null);

  // Filtered doctors list
  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      const matchSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchDept = selectedDeptId === 'all' || doc.departmentId === selectedDeptId;

      return matchSearch && matchDept;
    });
  }, [searchQuery, selectedDeptId]);

  const handleBookConsultation = (doc: Doctor) => {
    setSelectedDeptIdForBooking(doc.departmentId);
    setSelectedDoctorIdForBooking(doc.id);
    setCurrentTab('booking');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const getDeptName = (deptId: string) => {
    return DEPARTMENTS.find(d => d.id === deptId)?.name || 'General';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="doctors-view-container">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
          Our Team
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2 font-display">Meet Our Medical Specialists</h1>
        <p className="text-sm text-slate-500 mt-2">
          WeCare houses board-certified physicians, researchers, and fellowship surgeons holding prestigious university degrees. Apply filters to narrow down your search.
        </p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-xs mb-10 flex flex-col md:flex-row gap-4 justify-between items-center" id="doctors-filter-hub">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Search doctors by name, skill, specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:outline-none"
            id="doctor-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown & Stats */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4.5 h-4.5 text-slate-500" />
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="py-2.5 pl-3 pr-8 rounded-xl border border-slate-200 text-sm bg-white font-medium text-slate-700 focus:border-blue-600 focus:outline-none"
              id="doctor-dept-filter"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <span className="text-xs font-bold text-slate-500">
            {filteredDoctors.length} Doctors Matching
          </span>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="doctors-listing-grid">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group h-full">
              {/* Image & Header */}
              <div>
                <div className="h-60 bg-slate-100 relative overflow-hidden">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Department Badge */}
                  <span className="absolute top-4 left-4 inline-block px-2.5 py-1 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm">
                    {getDeptName(doc.departmentId)}
                  </span>
                </div>

                {/* Info Fields */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase font-display">{doc.name}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{doc.title}</p>
                    </div>
                    {/* Rating */}
                    <div className="flex items-center text-amber-500 text-xs font-bold shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                      <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                      {doc.rating}
                    </div>
                  </div>

                  {/* Badges/Credentials */}
                  <div className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
                    <p className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate" title={doc.qualification}>{doc.qualification}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      🛡️ {doc.experience} Years of Active Experience • Fee: <strong>${doc.consultFee}</strong>
                    </p>
                  </div>

                  {/* Specialties */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Focus</p>
                    <div className="flex flex-wrap gap-1">
                      {doc.specialties.map((spec, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-medium border border-slate-150/40">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 border-t border-slate-50 bg-slate-50/20 flex gap-2">
                <button
                  onClick={() => setSelectedDocForBio(doc)}
                  className="px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold select-none cursor-pointer"
                  id={`doc-bio-btn-${doc.id}`}
                >
                  View Bio
                </button>
                <button
                  onClick={() => handleBookConsultation(doc)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
                  id={`doc-book-btn-${doc.id}`}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border rounded-2xl max-w-lg mx-auto" id="no-doctors-found">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-800 text-lg">No Matching Doctors Found</h3>
          <p className="text-xs text-slate-500 mt-1 pl-4 pr-4">We couldn't locate any specialists matching your filters. Try adjusting search terms or choosing 'All Departments'.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedDeptId('all'); }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Doctor Bio Modal overlay */}
      {selectedDocForBio && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all" id="doc-bio-modal">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-150 overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Cover and header banner */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white relative">
              <button
                onClick={() => setSelectedDocForBio(null)}
                className="absolute right-4 top-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-bold text-blue-150 uppercase tracking-widest bg-white/10 px-2.5 py-0.5 rounded-md">
                Physician Portfolio Overview
              </span>
              <div className="flex gap-4 items-center mt-4">
                <img
                  src={selectedDocForBio.image}
                  alt={selectedDocForBio.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-xl font-extrabold font-display leading-tight">{selectedDocForBio.name}</h3>
                  <p className="text-blue-105 text-xs font-medium">{selectedDocForBio.title}</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Detailed bio */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Biography</h4>
                <p className="text-slate-600 text-sm leading-relaxed font-sans">{selectedDocForBio.bio}</p>
              </div>

              {/* Specifications and details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-sm">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Academic Qualification</span>
                    <span className="text-slate-700 font-semibold text-xs flex items-center gap-1">
                      🎓 {selectedDocForBio.qualification}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Base Consult Fee</span>
                    <span className="text-slate-800 font-bold text-sm">
                      ${selectedDocForBio.consultFee} USD <span className="text-[10px] text-slate-400 font-medium">(Insurance Accepted)</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Clinic Coordinates</span>
                    <span className="text-slate-700 font-semibold text-xs flex items-center gap-1">
                      🏨 {getDeptName(selectedDocForBio.departmentId)} Division Suite
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Weekly Availability</span>
                    <div className="flex gap-1.5 flex-wrap pt-0.5">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => {
                        const isAvailable = selectedDocForBio.availability.includes(day);
                        return (
                          <span
                            key={day}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-300 border border-slate-100Line line-through'
                            }`}
                          >
                            {day}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedDocForBio(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close Profile
                </button>
                <button
                  onClick={() => {
                    handleBookConsultation(selectedDocForBio);
                    setSelectedDocForBio(null);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
