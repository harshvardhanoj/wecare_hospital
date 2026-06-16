/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, User, ShieldAlert, Heart, Clock, ArrowRight, Star, Stethoscope, ChevronRight, Activity, Users, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
}

export default function HomeView({ setCurrentTab }: HomeViewProps) {
  const stats = [
    { value: '45+', label: 'Years of Care', icon: Award, color: 'text-amber-500 bg-amber-50' },
    { value: '150+', label: 'Specialist Doctors', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { value: '25+', label: 'Clinical Departments', icon: Stethoscope, color: 'text-sky-600 bg-sky-50' },
    { value: '99.8%', label: 'Patient Satisfaction', icon: Heart, color: 'text-red-500 bg-red-50' },
  ];

  const coreServices = [
    {
      title: 'Emergency Trauma Care',
      desc: 'Level-1 Emergency department staffed 24/7. Accelerated rapid triage for cardiac, stroke, and critical orthopedic trauma cases.',
      icon: ShieldAlert,
      tag: 'Immediate Response',
      color: 'border-red-100 bg-red-50/20 text-red-700'
    },
    {
      title: 'Advanced Robotic Surgery',
      desc: 'Executing minimally-invasive, highly-precise joint replacements and thoracic surgeries with computer-assisted precision.',
      icon: Activity,
      tag: 'Precision Tech',
      color: 'border-blue-100 bg-blue-50/20 text-blue-700'
    },
    {
      title: 'Digital Patient Portal',
      desc: 'Seamlessly schedule consultations, request prescription refills, review diagnostic laboratory panels, and trace historic health charts.',
      icon: User,
      tag: 'Patient Control',
      color: 'border-teal-100 bg-teal-50/20 text-teal-700'
    }
  ];

  const departmentPreviews = [
    { name: 'Cardiology', desc: 'Custom diagnostic loops & heart valve repairs.', id: 'cardiology' },
    { name: 'Neurology', desc: 'Deep brain maps and high precision stroke care.', id: 'neurology' },
    { name: 'Pediatrics', desc: 'Gentle immunizations and neonate monitoring.', id: 'pediatrics' },
    { name: 'Orthopedics', desc: 'Mako robotic joint rebuilds and physical therapy.', id: 'orthopedics' }
  ];

  return (
    <div className="space-y-16 pb-16" id="home-view-container">
      {/* Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden min-h-[550px] flex items-center" id="hero-section">
        {/* Decorative backdrop blobs */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 via-transparent to-transparent hidden lg:block pointer-events-none"></div>
        <div className="absolute -top-40 right-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        {/* Diagonal Unsplash Background Layer */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-5/12 bg-cover bg-center opacity-15 lg:opacity-90 clip-path-hero hidden md:block"
             style={{ backgroundImage: `url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200')` }}>
          {/* Accent light overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/45 to-transparent lg:from-slate-900 lg:via-transparent lg:to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
          <div className="max-w-2xl lg:max-w-xl">
            {/* Tagline Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              JCI Gold Certified Healthcare
            </span>

            {/* Display Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-display">
              Healthcare Led by <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">Science & Compassion</span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
              Welcome to <strong>WeCare Hospitals</strong>, where clinical research meets patient-focused empathy. We combine robotic diagnostics and world-leading physicians to foster outstanding health outcomes.
            </p>

            {/* Responsive Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentTab('booking')}
                className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 group cursor-pointer"
                id="hero-book-btn"
              >
                <Calendar className="w-5 h-5 shrink-0" />
                Schedule Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentTab('portal')}
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="hero-portal-btn"
              >
                <User className="w-5 h-5 text-blue-400" />
                Access Patient Portal
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-400">
              <div>
                <strong className="block text-white text-base">20+ Min</strong> Emergency Triage
              </div>
              <div className="border-l border-slate-800 pl-4">
                <strong className="block text-white text-base">Direct</strong> Portal Refills
              </div>
              <div className="border-l border-slate-800 pl-4">
                <strong className="block text-white text-base">100%</strong> Board Certified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="quick-services">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            A Higher Standard of Hospital Care
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Our medical ecosystem is optimized to secure prompt, accurate diagnosable treatments while optimizing administrative ease for our patients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreServices.map((service, idx) => {
            const IconComp = service.icon;
            return (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4 border ${service.color}`}>
                    {service.tag}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">{service.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50/80">
                  <button 
                    onClick={() => setCurrentTab(idx === 2 ? 'portal' : idx === 1 ? 'departments' : 'booking')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Explore Service <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section with elegant cards */}
      <section className="bg-slate-50 py-12 border-y border-slate-100" id="statistics-ticker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-xs flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <StatIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight font-display">
                      {stat.value}
                    </span>
                    <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                      {stat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Department Previews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="department-selection-promo">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

          <div className="max-w-lg lg:max-w-md space-y-6">
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 font-bold rounded-lg text-xs uppercase tracking-widest">
              Comprehensive Care Divisions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Clinical Specialities Designed Around Recovery
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              From critical cardiac bypass procedures to gentle neonate intensive wellness (NICU Level IV), WeCare hosts optimized divisions mapped with board-certified physicians.
            </p>
            <button
              onClick={() => setCurrentTab('departments')}
              className="px-5 py-3 bg-white text-blue-900 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              Browse All Departments
              <ArrowRight className="w-4 h-4 text-blue-900" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:max-w-xl">
            {departmentPreviews.map((dept, idx) => (
              <div 
                key={idx} 
                className="bg-white/10 hover:bg-white/15 border border-white/10 p-5 rounded-2xl transition-all cursor-pointer group"
                onClick={() => setCurrentTab('departments')}
              >
                <h4 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors">{dept.name}</h4>
                <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">{dept.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity">
                  Learn department <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness & Advisory Blog Column */}
      <section className="bg-slate-50 py-16 border-y border-slate-100" id="wellness-corner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                WeCare Healthy Community Corner
              </h2>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed max-w-xl">
                Read actionable, medically-validated advice curated directly by our leading specialty doctors to support your daily wellness journey.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('doctors')}
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white rounded-xl text-slate-700 hover:text-slate-900 font-semibold text-xs transition-colors cursor-pointer"
            >
              Consult Clinical Specialists Directly
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Health Blog Card 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden flex flex-col justify-between shadow-xs">
              <div>
                <div className="h-44 bg-slate-100 relative bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400')` }}>
                  <span className="absolute top-3 left-3 px-2 py-1 bg-red-600 font-bold text-xs text-white rounded-md uppercase tracking-wider">
                    Cardio Health
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-xs text-slate-400 font-medium">Published June 12, 2026 • By Dr. Sarah Jenkins</span>
                  <h3 className="font-bold text-slate-900 text-lg hover:text-blue-600 cursor-pointer">
                    5 Daily Habits to Substantially Lower Artery Strain
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Simple shifts in sodium moderation, potassium absorption, and structured 15-minute intervals of aerobic walking significantly reduce long-term cardiovascular calcification...
                  </p>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs text-slate-400">4 min read</span>
                <button 
                  onClick={() => setCurrentTab('doctors')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                >
                  View Dr. Jenkins <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Health Blog Card 2 */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden flex flex-col justify-between shadow-xs">
              <div>
                <div className="h-44 bg-slate-100 relative bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=400')` }}>
                  <span className="absolute top-3 left-3 px-2 py-1 bg-yellow-600 font-bold text-xs text-white rounded-md uppercase tracking-wider">
                    Pediatric Support
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-xs text-slate-400 font-medium">Published May 28, 2026 • By Dr. Emily Taylor</span>
                  <h3 className="font-bold text-slate-900 text-lg hover:text-blue-600 cursor-pointer">
                    Navigating Childhood Vaccine Schedules Safely
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Immunizations shield expanding immunological systems from severe historically risky pathogens. Here we summarize timing guidelines and how to manage mild post-shot low fevers at home...
                  </p>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs text-slate-400">6 min read</span>
                <button 
                  onClick={() => setCurrentTab('doctors')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                >
                  View Dr. Taylor <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Health Blog Card 3 */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden flex flex-col justify-between shadow-xs">
              <div>
                <div className="h-44 bg-slate-100 relative bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400')` }}>
                  <span className="absolute top-3 left-3 px-2 py-1 bg-teal-600 font-bold text-xs text-white rounded-md uppercase tracking-wider">
                    Dermatology Care
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-xs text-slate-400 font-medium">Published April 11, 2026 • By Dr. Sophia Carter</span>
                  <h3 className="font-bold text-slate-900 text-lg hover:text-blue-600 cursor-pointer">
                    Deciphering Eczema Triggers & Cold-Season Repairs
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Severe temperature oscillations dry surface lipid barriers. Learn why ceramide-dense creams and lukewarm bathing cycles are highly critical during sudden flare ups...
                  </p>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs text-slate-400">5 min read</span>
                <button 
                  onClick={() => setCurrentTab('doctors')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                >
                  View Dr. Carter <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
