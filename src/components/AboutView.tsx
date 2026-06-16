/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, ShieldAlert, Users, History, Check, ShieldCheck, HeartPulse } from 'lucide-react';

export default function AboutView() {
  const pillars = [
    {
      title: 'Pristine Patient Safety (JCI gold Seal)',
      desc: 'Our protocols align with strict Joint Commission International metrics, maintaining double checking safety measures across all operating theaters.',
      icon: ShieldCheck,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      title: 'Universal Access & Fair Billing',
      desc: 'We support all major health coverage plans, and provide fully mapped out itemized estimates prior to any scheduled operational procedure.',
      icon: Users,
      color: 'text-teal-600 bg-teal-50'
    },
    {
      title: 'Translational Clinical Innovation',
      desc: 'All divisions participate directly in clinical research trials, importing cutting-edge medical approaches to treat intractable conditions.',
      icon: HeartPulse,
      color: 'text-blue-600 bg-blue-50'
    }
  ];

  const timeline = [
    { year: '1981', title: 'The Genesis', desc: 'Dr. Arthur WeCare, MD, constructs a small outpatient surgical center in New York focused on community cardio health.' },
    { year: '1996', title: 'Hospital Expansion', desc: 'The facility adds East Wing capabilities, establishing WeCare Acute Hospital with 150 clinical beds.' },
    { year: '2012', title: 'Precision Robotic Launch', desc: 'Sets up first dedicated robotic operation theaters, enabling surgical planners to execute minimally-invasive work.' },
    { year: '2026', title: 'WeCare Healthcare Systems', desc: 'Operating as a premier, multi-tower medical center housing gold-standard diagnostics and a complete HIPAA-secure patient portal.' }
  ];

  const leadership = [
    {
      name: 'Dr. Arthur WeCare, MD',
      title: 'Founding Director & President',
      desc: 'A double-board certified cardiothoracic surgeon who dedicated 40 years to establishing Metropolis’s leading community health center.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Dr. Helen Vance, PhD',
      title: 'Chief Medical Officer (CMO)',
      desc: 'Supervises all clinical trials and quality controls. Helen ensures clinical methodologies match world-class JCI standards.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Richard Thorne, MBA',
      title: 'Chief Operations Officer (COO)',
      desc: 'Manages WeCare’s expansion, logistics, IT structures, and patient portals to guarantee simple service access.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16" id="about-view-container">
      {/* Intro Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4" id="about-intro">
        <span className="text-xs uppercase tracking-widest font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Who We Are
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Deep Science. Heartfelt Compassion.
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          At WeCare Hospitals, our primary focus is restoring and enriching quality of life. We bring together world-class clinicians and state-of-the-art medical technology under one integrated campus.
        </p>
      </section>

      {/* Hospital Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8" id="about-pillars">
        {pillars.map((pillar, idx) => {
          const PillarIcon = pillar.icon;
          return (
            <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pillar.color}`}>
                <PillarIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{pillar.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
            </div>
          );
        })}
      </section>

      {/* History Timeline */}
      <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-100" id="about-timeline">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">Our Decades of Medical Commitment</h2>
          </div>

          <div className="relative border-l-2 border-blue-150 pl-6 space-y-10 ml-4 py-2">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline dot */}
                <span className="absolute -left-[33px] top-1.5 w-4.5 h-4.5 rounded-full bg-blue-600 border-4 border-white shadow-xs group-hover:scale-110 transition-transform"></span>
                
                <span className="text-sm font-extrabold text-blue-600 block mb-0.5">{item.year}</span>
                <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="space-y-10" id="about-leadership">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 font-display">Executive Clinic Leadership</h2>
          <p className="text-sm text-slate-500 mt-2">
            The board of directors and chief medical authorities keeping WeCare at the vanguard of patient recovery and compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leadership.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="h-44 bg-slate-100 bg-cover bg-center" style={{ backgroundImage: `url('${item.image}')` }}></div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                <span className="text-xs font-bold text-blue-600 block">{item.title}</span>
                <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Info or Quality commitment */}
      <section className="bg-gradient-to-br from-indigo-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-10" id="about-campus-info">
        <div className="w-full md:w-1/2 space-y-4">
          <span className="text-xs font-extrabold tracking-widest text-indigo-300 uppercase">Interactive Campus Map</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            A Unified Campus Built for Fast Ingress
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            WeCare Premier Campus is spread across four custom wings connected via indoor sky-bridges. Designed with immediate helicopter drop zones alongside rapid ambulance unloading terminals to ensure zero loss of valuable timing.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>West Wing: Cardio & Ortho</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>East Wing: Brain Sciences</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>North Tower: Oncology</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>South Wing: Pediatrics Unit</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-56 bg-slate-800 rounded-2xl overflow-hidden shadow-lg relative bg-cover bg-center"
             style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600')` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-4">
            <p className="text-xs font-bold text-slate-200">Main Outpatient Pavilion and Surgical Wing Arrival Area</p>
          </div>
        </div>
      </section>
    </div>
  );
}
