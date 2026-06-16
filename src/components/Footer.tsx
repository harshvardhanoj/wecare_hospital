/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Phone, Mail, MapPin, Award, CheckCircle, Shield, Clock } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800" id="app-footer">
      {/* Top Value Bar / Badges */}
      <div className="border-b border-slate-800 py-8 px-4 bg-slate-950/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 px-4">
            <Award className="w-10 h-10 text-amber-500 shrink-0" />
            <div>
              <h4 className="text-white font-bold tracking-tight">JCI Gold Seal Accreditation</h4>
              <p className="text-xs text-slate-500 mt-0.5">Recognized globally for representing the highest standards of safety and clinical excellence.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 px-4">
            <Shield className="w-10 h-10 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-white font-bold tracking-tight">HIPAA Certified Vaulting</h4>
              <p className="text-xs text-slate-500 mt-0.5">All medical history, vitals charts, and booking records are encrypted and protected securely.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 px-4">
            <CheckCircle className="w-10 h-10 text-teal-400 shrink-0" />
            <div>
              <h4 className="text-white font-bold tracking-tight">Standard Clinical Boards</h4>
              <p className="text-xs text-slate-500 mt-0.5">100% of our physicians and surgeons are board-certified, maintaining state-regulated clinical credits.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Bio info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Vision Column */}
          <div className="space-y-4 col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white/10" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-display">
                WeCare<span className="text-blue-500">Hospitals</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              WeCare Hospitals has been delivering world-class, clinical medical excellence for over 45 years, pairing scientific technology with genuine compassionate caring.
            </p>
            <div className="space-y-2 mt-4 text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>+1 (555) WE-CARE-01</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>contact@wecarehospitals.org</span>
              </div>
            </div>
          </div>

          {/* Quick Access Menu */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Website Portal</h4>
            <ul className="space-y-2">
              {['home', 'about', 'departments', 'doctors', 'booking', 'portal'].map((tab) => {
                const label = tab === 'portal' ? 'Patient Portal' : tab === 'booking' ? 'Book Appointment' : tab === 'about' ? 'About Us' : tab.charAt(0).toUpperCase() + tab.slice(1);
                return (
                  <li key={tab}>
                    <button
                      onClick={() => handleNavClick(tab)}
                      className="hover:text-blue-400 transition-colors cursor-pointer text-left focus:outline-none"
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Core Specializations */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs font-display">Specialty Divisions</h4>
            <ul className="space-y-2">
              {[
                { name: 'Cardiology Center', tab: 'departments' },
                { name: 'Neurology Department', tab: 'departments' },
                { name: 'Pediatrics Clinic', tab: 'departments' },
                { name: 'Orthopedic & Joint Care', tab: 'departments' },
                { name: 'Oncology Center', tab: 'departments' },
                { name: 'Dermatological Skin Care', tab: 'departments' }
              ].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNavClick(item.tab)}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Find Us */}
          <div className="space-y-4" id="directions">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Primary campus</h4>
            <div className="flex gap-2 text-xs leading-relaxed">
              <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <p className="text-slate-300 font-semibold">WeCare Premier Campus</p>
                <p className="text-slate-400">750 Medical Plaza Boulevard,<br />Metropolis, NY 10021</p>
              </div>
            </div>
            
            <div className="flex gap-2 text-xs leading-relaxed">
              <Clock className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <p className="text-slate-300 font-semibold">Outpatient Labs & Clinic Hours</p>
                <p className="text-slate-500">Mon - Fri: 8:00 AM - 5:00 PM<br />Sat - Sun: Emergency Only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copywrite bottom */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 WeCare Healthcare Systems. All rights registered globally.</p>
          <div className="flex gap-4">
            <a href="#terms" className="hover:text-slate-400 transition-colors">Emergency Protocol policies</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Patient Privacy Statement (HIPAA)</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-400 transition-colors">General Disclaimers</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
