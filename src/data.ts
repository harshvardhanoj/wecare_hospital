/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Department, Doctor, PatientProfile, VitalsReading, Prescription, LabResult, MedicalRecord, Appointment } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Advanced diagnosis and cutting-edge therapies for heart conditions, coronary diseases, and heart failure.',
    longDescription: 'Our Cardiology Division is a globally recognized center of excellence. Equipped with state-of-the-art non-invasive diagnostics alongside state-of-the-art operative units, our expert cardiologists handle coronary artery disease, arrhythmias, vascular diseases, and complex heart failure using the minimum invasive routes possible to optimize patient outcomes.',
    icon: 'Heart',
    headOfDept: 'Dr. Sarah Jenkins, MD, FACC',
    location: 'West Wing, 3rd Floor, Suite 305',
    bedsCount: 42,
    features: [
      'State-of-the-art Hybrid Catheterization Lab',
      'Advanced 3D Echocardiography & Cardiac MRI',
      'Preventative Heart Wellness programs',
      '24/7 Dedicated Cardiac Emergency Intervention Team'
    ]
  },
  {
    id: 'neurology',
    name: 'Neurology & Neurosurgery',
    description: 'Comprehensive neurological evaluation and delicate neurosurgical procedures for complex brain and spinal cord cases.',
    longDescription: 'The Neurology and Brain Sciences Institute at WeCare specializes in diagnosing and treating all conditions impacting the brain, nervous system, and spine. We offer comprehensive services for stroke management, epilepsy pathways, tremors and Parkinson’s, neuro-oncology, and delicate neurosurgeries utilizing automated precision guidance systems.',
    icon: 'Brain',
    headOfDept: 'Dr. Robert Chen, PhD',
    location: 'East Wing, 4th Floor, Suite 410',
    bedsCount: 35,
    features: [
      'Intraoperative MRI and neuronavigation systems',
      'Comprehensive Comprehensive Stroke Center (AHA Certified)',
      'Advanced Electrophysiology lab for Epilepsy mapping',
      'Multidisciplinary Neuro-rehabilitation center'
    ]
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics & Neonatology',
    description: 'Gentle, expert healthcare designed for newborns, growing infants, toddlers, and young teens.',
    longDescription: 'WeCare Pediatrics provides high-quality primary and specialized sub-specialty services within a warm, child-friendly atmosphere. From pediatric immunology, pulmonology, and intensive neonatal critical care (NICU Level IV), our multidisciplinary pediatricians support health-focused childhoods with utmost gentle professionalism.',
    icon: 'Baby',
    headOfDept: 'Dr. Emily Taylor, MD, FAAP',
    location: 'South Wing, Ground Floor, Suite 102',
    bedsCount: 50,
    features: [
      'Level IV Neonatal Intensive Care Unit (NICU)',
      'Child-friendly emergency and immunization clinics',
      'Specialized pediatric surgical and oncology team',
      'Developments and behavioral screening pathways'
    ]
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics & Joint Care',
    description: 'Reclaim joint mobility and strength. Specializing in robotic joint-replacement and sports injury recovery.',
    longDescription: 'Our Orthopedics, Joint Reconstruction, and Sports Medicine Division helps patients regain their active range of movement. We offer robotic-guided total hip and knee arthroplasties, advanced arthroscopy for sports-related tendon/ligament repairs, trauma reconstructive surgery, and a highly specialized physiotherapy team.',
    icon: 'Activity',
    headOfDept: 'Dr. Marcus Vance, MD, FAAOS',
    location: 'West Wing, 1st Floor, Suite 140',
    bedsCount: 28,
    features: [
      'Mako Robotic-Arm Assisted joint replacements',
      'Comprehensive sports biomechanics clinic',
      'Minimally invasive keyhole arthroscopic surgery',
      'Integrated physical therapy and recovery programs'
    ]
  },
  {
    id: 'oncology',
    name: 'Oncology Center',
    description: 'Empathetic pathways for cancer diagnosis, radiotherapy, and advanced immunotherapy protocols.',
    longDescription: 'The WeCare Comprehensive Cancer Center provides holistic cancer care including precision medical oncology, high-dosage modern radiation therapies, smart immunotherapy, and innovative targeted therapies. Powered by multi-doctor tumor boards, we build unique responsive care pathways personalized for every patient.',
    icon: 'ShieldAlert',
    headOfDept: 'Dr. Angela Martinez, MD, PhD',
    location: 'North Tower, Ground Floor, Suite A',
    bedsCount: 30,
    features: [
      'TrueBeam Linear Accelerator for precise radiotherapy',
      'On-site oncology pharmacy and chemotherapy suites',
      'Multi-disciplinary tumor board evaluations',
      'Holistic oncology counseling and survivorship services'
    ]
  },
  {
    id: 'dermatology',
    name: 'Dermatology & Skin Center',
    description: 'Expert diagnostics for skin health, chronic conditions, and professional aesthetics.',
    longDescription: 'Our Dermatology Division provides comprehensive diagnosis and therapeutics for all hair, nail, skin infections, eczema, severe psoriasis, allergy patch tests, and aggressive skin cancers (Mohs surgery). We also offer medically guided aesthetic procedures managed by board-certified dermatologists.',
    icon: 'Sparkles',
    headOfDept: 'Dr. Sophia Carter, MD',
    location: 'East Wing, 2nd Floor, Suite 220',
    bedsCount: 10,
    features: [
      'Advanced phototherapy cabins for eczema and psoriasis',
      'State-of-the-art laser skin technology suites',
      'Certified Mohs micrographic surgery for skin cancers',
      'Comprehensive diagnostic allergy patching tests'
    ]
  }
];

export const DOCTORS: Doctor[] = [
  // Cardiology
  {
    id: 'doc-jenkins',
    name: 'Dr. Sarah Jenkins',
    title: 'Consultant Interventional Cardiologist',
    departmentId: 'cardiology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    specialties: ['Coronary Angioplasty', 'Heart Valve Repair', 'Cardiac MRI'],
    qualification: 'MD, FACC - Harvard Medical School',
    experience: 18,
    rating: 4.9,
    availability: ['Mon', 'Tue', 'Wed', 'Thu'],
    bio: 'Dr. Jenkins possesses over 18 years of cardiology experience. She is highly acclaimed for her mastery of minimally invasive coronary stent placements and serves as an advocate for preventative cardiovascular wellness.',
    email: 'sarah.jenkins@wecare.org',
    consultFee: 150
  },
  {
    id: 'doc-aravind',
    name: 'Dr. Aravind Menon',
    title: 'Senior Cardiac Surgeon',
    departmentId: 'cardiology',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    specialties: ['CABG Surgery', 'Congenital Heart Defects', 'Aortic Root Replacement'],
    qualification: 'MD, FACS - Johns Hopkins University',
    experience: 22,
    rating: 4.8,
    availability: ['Tue', 'Wed', 'Thu', 'Fri'],
    bio: 'Dr. Menon is a renowned cardiothoracic surgeon who has performed over 3,000 successful bypass operations and aortic repairs. He values meticulous clinical preparation and empathetic patient-centric care.',
    email: 'aravind.menon@wecare.org',
    consultFee: 180
  },
  // Neurology
  {
    id: 'doc-chen',
    name: 'Dr. Robert Chen',
    title: 'Chief Pediatric Neurologist & Surgical Planner',
    departmentId: 'neurology',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    specialties: ['Stroke Recovery', 'Deep Brain Stimulation', 'Epilepsy Interventions'],
    qualification: 'MD, PhD - Stanford University',
    experience: 20,
    rating: 4.9,
    availability: ['Mon', 'Wed', 'Fri'],
    bio: 'Dr. Chen collaborates with neurosurgeons globally to spearhead precision navigational planning. His research centers on utilizing micro-electrodes for treating tremors and seizure patterns.',
    email: 'robert.chen@wecare.org',
    consultFee: 160
  },
  {
    id: 'doc-patel',
    name: 'Dr. Priya Patel',
    title: 'Consultant Clinical Neuro-Specialist',
    departmentId: 'neurology',
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    specialties: ['Multiple Sclerosis', 'Dementia Research', 'Migraine Management'],
    qualification: 'MD - Oxford University School of Medicine',
    experience: 12,
    rating: 4.7,
    availability: ['Mon', 'Tue', 'Thu', 'Fri'],
    bio: 'Dr. Patel focuses on multi-modal symptom therapeutics for neuro-degenerative diseases. She aims to improve long-term functional independence and cognitive longevity in her patients.',
    email: 'priya.patel@wecare.org',
    consultFee: 130
  },
  // Pediatrics
  {
    id: 'doc-taylor',
    name: 'Dr. Emily Taylor',
    title: 'Professor & Attending Pediatrician',
    departmentId: 'pediatrics',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    specialties: ['NICU Management', 'Child Asthma Pathologies', 'Juvenile Immunology'],
    qualification: 'MD, FAAP - University of Toronto',
    experience: 16,
    rating: 4.9,
    availability: ['Mon', 'Tue', 'Wed', 'Fri'],
    bio: 'Dr. Taylor loves helping children grow up strong and worry-free. She handles infantile respiratory therapies, childhood auto-immune diseases, and acts as the Neonatal Intensive Care supervisor.',
    email: 'emily.taylor@wecare.org',
    consultFee: 110
  },
  {
    id: 'doc-wilson',
    name: 'Dr. James Wilson',
    title: 'Consultant Pediatric Surgeon',
    departmentId: 'pediatrics',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    specialties: ['Minimal Access Pediatric Surgery', 'Neonatal Abnormalities'],
    qualification: 'MD - University of California, San Francisco',
    experience: 15,
    rating: 4.8,
    availability: ['Tue', 'Thu', 'Fri'],
    bio: 'Dr. Wilson specializes in incredibly delicate keyhole neonate surgeries. His supportive, calm, and conversational approach puts anxious children and parents at complete ease.',
    email: 'james.wilson@wecare.org',
    consultFee: 140
  },
  // Orthopedics
  {
    id: 'doc-vance',
    name: 'Dr. Marcus Vance',
    title: 'Senior Robotic Orthopedic Surgeon',
    departmentId: 'orthopedics',
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400',
    specialties: ['Robotic Hip Arthroplasty', 'Knee Reconstruction', 'Joint Trauma Care'],
    qualification: 'MD, FAAOS - Yale School of Medicine',
    experience: 19,
    rating: 4.9,
    availability: ['Mon', 'Tue', 'Thu'],
    bio: 'A pioneer in robotic-assisted orthopedics, Dr. Vance applies high-fidelity mechanical alignment to achieve faster structural rehabilitation and natural fluid range of movement post-surgery.',
    email: 'marcus.vance@wecare.org',
    consultFee: 160
  },
  {
    id: 'doc-gonzalez',
    name: 'Dr. Sofia Gonzalez',
    title: 'Consultant Sports Medicine Specialist',
    departmentId: 'orthopedics',
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=400',
    specialties: ['Ligament Arthroplasty', 'Rotator Cuff Injuries', 'PRP Joint Injections'],
    qualification: 'MD - Columbia University College of Physicians',
    experience: 11,
    rating: 4.8,
    availability: ['Wed', 'Thu', 'Fri'],
    bio: 'Dr. Gonzalez treats Olympic, professional, and weekend-warrior athletes. Her treatment integrates custom biomechanics modeling and blood-plasma healing therapies to rebuild joints without extensive surgeries.',
    email: 'sofia.gonzalez@wecare.org',
    consultFee: 120
  },
  // Oncology
  {
    id: 'doc-martinez',
    name: 'Dr. Angela Martinez',
    title: 'Chief Molecular Oncologist',
    departmentId: 'oncology',
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    specialties: ['Targeted Immunotherapy', 'Breast & Lung Oncology', 'Gene Therapies'],
    qualification: 'MD, PhD - Perelman School of Medicine, UPenn',
    experience: 21,
    rating: 5.0,
    availability: ['Mon', 'Tue', 'Wed', 'Thu'],
    bio: 'Dr. Martinez is the department director and is highly acclaimed for customizing immunotherapies tailored to tumor molecular genetics. Her work emphasizes complete mental and clinical support.',
    email: 'angela.martinez@wecare.org',
    consultFee: 170
  },
  // Dermatology
  {
    id: 'doc-carter',
    name: 'Dr. Sophia Carter',
    title: 'Senior Clinical Dermatologist',
    departmentId: 'dermatology',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    specialties: ['Chronic Skin Pathologies', 'Mohs Micrographic Surgery', 'Laser Rejuvenation'],
    qualification: 'MD - NYU Grossman School of Medicine',
    experience: 14,
    rating: 4.8,
    availability: ['Mon', 'Thu', 'Fri'],
    bio: 'Dr. Carter acts as our chronic skin specialist. She operates on melanoma cases surgically using high-precision slices and sets customized, clinically responsive skin-barrier restoration regimens.',
    email: 'sophia.carter@wecare.org',
    consultFee: 110
  }
];

export const TIME_SLOTS = [
  '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', 
  '10:30 AM', '11:00 AM', '11:30 AM', '01:30 PM', 
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', 
  '04:00 PM'
];

export const DEFAULT_PATIENT: PatientProfile = {
  id: 'pat-00512',
  name: 'Jane Doe',
  email: 'jane.doe@gmail.com',
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
};

export const DEFAULT_VITALS: VitalsReading[] = [
  { date: '2026-02-10', bloodPressureSystolic: 118, bloodPressureDiastolic: 78, heartRate: 72, weight: 64.2, oxygenLevel: 99 },
  { date: '2026-03-12', bloodPressureSystolic: 120, bloodPressureDiastolic: 79, heartRate: 74, weight: 63.8, oxygenLevel: 98 },
  { date: '2020-04-15', bloodPressureSystolic: 124, bloodPressureDiastolic: 81, heartRate: 76, weight: 63.1, oxygenLevel: 98 },
  { date: '2026-05-18', bloodPressureSystolic: 119, bloodPressureDiastolic: 77, heartRate: 70, weight: 62.7, oxygenLevel: 99 },
  { date: '2026-06-12', bloodPressureSystolic: 116, bloodPressureDiastolic: 75, heartRate: 68, weight: 62.4, oxygenLevel: 99 }
];

export const DEFAULT_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-29019',
    date: '2026-06-12',
    doctorName: 'Dr. Sarah Jenkins',
    medication: 'Lisinopril (Cardioprotective)',
    dosage: '10 mg',
    frequency: 'Once Daily (Morning)',
    duration: '90 Days',
    instructions: 'Take with a full glass of water, ideally before breakfast. Monitor blood pressure weekly.'
  },
  {
    id: 'rx-11054',
    date: '2026-05-18',
    doctorName: 'Dr. Sophia Carter',
    medication: 'Fluticasone Propionate (Crème)',
    dosage: '0.05%',
    frequency: 'Twice Daily (Morning/Night)',
    duration: '14 Days',
    instructions: 'Apply a very thin layer exclusively on affected patches of dry eczema. Keep area uncovered.'
  }
];

export const DEFAULT_LAB_RESULTS: LabResult[] = [
  {
    id: 'lab-3091',
    date: '2026-06-12',
    testName: 'General Lipid Panel',
    category: 'Cardiovascular Profile',
    result: '185 mg/dL',
    range: '< 200 mg/dL',
    status: 'Normal',
    doctorName: 'Dr. Sarah Jenkins',
    notes: 'Total cholesterol is outstanding. HDL is high at 62 mg/dL. LDL is optimal at 98 mg/dL. Continue current balanced cardiovascular diet.'
  },
  {
    id: 'lab-1025',
    date: '2026-06-12',
    testName: 'TSH (Thyroid Stimulating Hormone)',
    category: 'Endocrinology Panel',
    result: '5.2 mIU/L',
    range: '0.4 - 4.0 mIU/L',
    status: 'High',
    doctorName: 'Dr. Sarah Jenkins',
    notes: 'Mildly elevated TSH. May suggest subclinical hypothyroidism. We will recheck in 3 months. Inform doctor if feeling unexplainable fatigue.'
  },
  {
    id: 'lab-9104',
    date: '2026-05-18',
    testName: 'Vitamin D, 25-Hydroxy',
    category: 'Vitamins & Minerals',
    result: '28 ng/mL',
    range: '30 - 100 ng/mL',
    status: 'Low',
    doctorName: 'Dr. Sophia Carter',
    notes: 'Slight deficiency detected. Start taking over-the-counter Vitamin D3 Cholecalciferol 2,000 IU daily with meal to restore baseline.'
  }
];

export const DEFAULT_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-007',
    date: '2026-06-12',
    type: 'Visit',
    title: 'Cardiology Bi-Annual Follow Up Visit',
    description: 'Patient presented for regular follow-up on minor idiopathic palpitations. EKG demonstrates healthy normal sinus rhythm. Lisinopril dose reaffirmed. Routine lipids blood draw executed.',
    doctorName: 'Dr. Sarah Jenkins',
    attachment: 'Official_Cardiology_Summary_JaneDoe.pdf'
  },
  {
    id: 'rec-006',
    date: '2026-05-18',
    type: 'Visit',
    title: 'Eczema Consultation & Barrier Review',
    description: 'Patient reported localized skin flare-up on right elbow during high stress periods. Initial patch allergy test negative. Prescribed mild fluticasone crème to recover barrier integrity.',
    doctorName: 'Dr. Sophia Carter',
    attachment: 'Dermatological_Report_JaneDoe.pdf'
  },
  {
    id: 'rec-005',
    date: '2026-03-12',
    type: 'Immunization',
    title: 'Annual Influenza Booster (Influvac Tetra)',
    description: 'Seasonal quadrivalent flu vaccine booster safely administered intramuscularly in left deltoid. Patient watched for 15 minutes. No adverse post-vaccination side effects reported.',
    doctorName: 'WeCare Outpatient Immunology Staff'
  }
];

export const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-04281',
    doctorId: 'doc-jenkins',
    doctorName: 'Dr. Sarah Jenkins',
    departmentId: 'cardiology',
    departmentName: 'Cardiology',
    patientName: 'Jane Doe',
    patientEmail: 'jane.doe@gmail.com',
    patientPhone: '+1 (555) 732-9011',
    patientType: 'returning',
    date: '2026-06-25',
    timeSlot: '10:00 AM',
    status: 'scheduled',
    reason: 'Lipid panel follow-up and TSH review discussion.',
    createdAt: '2026-06-12T04:12:00Z'
  },
  {
    id: 'apt-00921',
    doctorId: 'doc-carter',
    doctorName: 'Dr. Sophia Carter',
    departmentId: 'dermatology',
    departmentName: 'Dermatology & Skin Center',
    patientName: 'Jane Doe',
    patientEmail: 'jane.doe@gmail.com',
    patientPhone: '+1 (555) 732-9011',
    patientType: 'returning',
    date: '2026-06-12',
    timeSlot: '02:30 PM',
    status: 'completed',
    reason: 'Follow-up on skin repair crème and review of vitamin D levels.',
    createdAt: '2026-05-18T06:40:00Z'
  }
];
