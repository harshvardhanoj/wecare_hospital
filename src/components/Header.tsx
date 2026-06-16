/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Menu, X, User, Phone, MapPin, Calendar, Clock } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isLoggedIn: boolean;
  patientName: string;
  onLogout: () => void;
}

export default function Header({ currentTab, setCurrentTab, isLoggedIn, patientName, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', tab: 'home' },
    { name: 'About Us', tab: 'about' },
    { name: 'Departments', tab: 'departments' },
    { name: 'Our Doctors', tab: 'doctors' },
    { name: 'Admin Portal', tab: 'admin' },
  ];

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-xs" id="app-header">
      {/* Top emergency bar */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium text-red-100">
              <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              24/7 ER Trauma Hotlines: <strong className="text-white">+1 (800) 555-0199</strong>
            </span>
            <span className="text-slate-200">|</span>
            <span className="flex items-center gap-1 text-slate-100">
              <Clock className="w-3.5 h-3.5" /> Outpatient Clinics: Mon - Fri, 8:00 AM - 5:00 PM
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-100">
              <Phone className="w-3.5 h-3.5" /> General Inquiries: +1 (555) WE-CARE-01
            </span>
            <span className="text-slate-200">|</span>
            <a href="#directions" onClick={() => handleNavClick('about')} className="hover:text-amber-300 transition-colors flex items-center gap-1 text-slate-100">
              <MapPin className="w-3.5 h-3.5" /> Campus Directions
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavClick('home')} id="logo-block">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-100 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white/15 scroll-smooth animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                WeCare<span className="text-blue-600">Hospitals</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Science • Compassion • Access</p>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3" id="desktop-nav">
            {navigation.map((item) => {
              const active = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-all relative ${
                    active 
                      ? 'text-blue-600 bg-blue-50/50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  id={`nav-${item.tab}`}
                >
                  {item.name}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Core Action CTAs */}
          <div className="hidden md:flex items-center gap-3" id="header-ctas">
            {/* Appointment Booking */}
            <button
              onClick={() => handleNavClick('booking')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 shadow-xs ${
                currentTab === 'booking'
                  ? 'bg-blue-700 text-white shadow-inner'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
              }`}
              id="cta-booking"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>

            {/* Patient Portal Access */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleNavClick('portal')}
                  className={`pl-3 pr-4 py-2.5 rounded-xl border font-semibold text-sm transition-all flex items-center gap-2 hover:bg-slate-50 ${
                    currentTab === 'portal'
                      ? 'border-blue-600 bg-blue-50/20 text-blue-700 font-bold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                  id="cta-portal-loggedin"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 border border-blue-200">
                    {patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="max-w-[80px] truncate">{patientName}</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-50 transition-colors"
                  title="Logout"
                  id="header-logout"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('portal')}
                className={`px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all flex items-center gap-2 ${
                  currentTab === 'portal'
                    ? 'border-blue-600 bg-blue-50/20 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
                id="cta-portal-login"
              >
                <User className="w-4 h-4 text-blue-500" />
                Patient Portal
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => handleNavClick('booking')}
              className="p-2 rounded-lg bg-blue-600 text-white"
              id="mobile-quick-book"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100"
              id="mobile-drawer-trigger"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3 shadow-lg" id="mobile-drawer">
          <div className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold text-base flex justify-between items-center ${
                  currentTab === item.tab
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.name}
                <span className="text-slate-400">→</span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('booking')}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </button>

            {isLoggedIn ? (
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                    {patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{patientName}</h4>
                    <p className="text-xs text-slate-500">Logged In Patient</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1 border-t border-slate-200/50">
                  <button
                    onClick={() => handleNavClick('portal')}
                    className="flex-1 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 text-center"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="py-1.5 px-3 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('portal')}
                className="w-full py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <User className="w-5 h-5 text-blue-500" />
                Access Patient Portal
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
