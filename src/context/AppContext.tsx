/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Franchise, Student, Certificate, WalletTransaction, UserRole, Course, FeeStructure, FeePayment, FranchiseFee, AdmissionEnquiry, Exam, BusinessProfile, BusinessTransaction, AcademicSession, Announcement, Voucher, CourseCategory, Program, GlobalCourseSettings, Subject } from '../types';

interface AppState {
  currentUser: User | null;
  franchises: Franchise[];
  students: Student[];
  certificates: Certificate[];
  walletTransactions: WalletTransaction[];
  businessTransactions: BusinessTransaction[];
  courses: Course[];
  feeStructures: FeeStructure[];
  feePayments: FeePayment[];
  franchiseFees: FranchiseFee[];
  enquiries: AdmissionEnquiry[];
  businessProfile: BusinessProfile;
  sessions: AcademicSession[];
  announcements: Announcement[];
  vouchers: Voucher[];
  exams: Exam[];
  subjects: Subject[];
  courseCategories: CourseCategory[];
  programs: Program[];
  globalCourseSettings: GlobalCourseSettings;
  isLoading: boolean;
}

interface AppContextType extends AppState {
  addFranchiseFee: (fee: FranchiseFee) => void;
  updateFranchiseFee: (id: string, updates: Partial<FranchiseFee>) => void;
  updateBusinessProfile: (updates: Partial<BusinessProfile>) => void;
  setCurrentUser: (user: User | null) => void;
  addFranchise: (franchise: Franchise) => void;
  updateFranchise: (id: string, updates: Partial<Franchise>) => void;
  deleteFranchise: (id: string) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  issueCertificate: (cert: Certificate) => void;
  addWalletTransaction: (tx: WalletTransaction) => void;
  addBusinessTransaction: (tx: BusinessTransaction) => void;
  addVoucher: (v: Voucher) => void;
  updateVoucher: (id: string, updates: Partial<Voucher>) => void;
  verifyVoucher: (id: string) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addCourseCategory: (category: CourseCategory) => void;
  updateCourseCategory: (id: string, updates: Partial<CourseCategory>) => void;
  deleteCourseCategory: (id: string) => void;
  addProgram: (program: Program) => void;
  updateProgram: (id: string, updates: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  updateGlobalCourseSettings: (updates: Partial<GlobalCourseSettings>) => void;
  addSession: (session: AcademicSession) => void;
  updateSession: (id: string, updates: Partial<AcademicSession>) => void;
  deleteSession: (id: string) => void;
  addAnnouncement: (ann: Announcement) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  addFeeStructure: (fee: FeeStructure) => void;
  updateFeeStructure: (id: string, updates: Partial<FeeStructure>) => void;
  deleteFeeStructure: (id: string) => void;
  addFeePayment: (payment: FeePayment) => void;
  addEnquiry: (enquiry: AdmissionEnquiry) => void;
  updateEnquiry: (id: string, updates: Partial<AdmissionEnquiry>) => void;
  deleteEnquiry: (id: string) => void;
  addExam: (exam: Exam) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  clearData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [businessTransactions, setBusinessTransactions] = useState<BusinessTransaction[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [feePayments, setFeePayments] = useState<FeePayment[]>([]);
  const [franchiseFees, setFranchiseFees] = useState<FranchiseFee[]>([]);
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [globalCourseSettings, setGlobalCourseSettings] = useState<GlobalCourseSettings>({
    autoGenerateCode: true,
    prerequisiteCheck: false,
    passPercentage: 35,
    minAttendance: 75
  });
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    id: 'bp1',
    name: 'SOFTDEV TALLY GURU',
    legalName: 'SOFTDEV TALLY GURU PRASHIKSHAN SANSTHAN SOCIETY',
    isoNo: '9001:2015',
    regNo: 'G-58913 / 1442',
    email: 'info@stginstitute.in',
    phone: '+91 9450455378',
    address: 'Near Mahila Degree College, Companybagh Basti (Uttar Pradesh) India-272001',
    regionalAddress: 'Near Kisan Degree College, Mahson Road Basti (Uttar Pradesh) India-272001',
    website: 'www.stginstitute.in',
    workingHours: '09:00 AM - 06:00 PM',
    mission: 'To empower students through technology and quality education.',
    logoUrl: 'https://firebasestorage.googleapis.com/v0/b/ais-dev-pzzj54zbvfrllp25htfrww.appspot.com/o/softdev_logo.png?alt=media&token=48c0b58e-7e9b-46a2-97b7-54324f331777',
    directorName: 'Director',
    directorMessage: 'At Softdev Guru, our mission has always been clear: to bridge the gap between traditional education and the rapidly evolving demands of the global digital economy. We don\'t just teach software; we cultivate a mindset of innovation and practical excellence.',
    banners: [
      'https://firebasestorage.googleapis.com/v0/b/ais-dev-pzzj54zbvfrllp25htfrww.appspot.com/o/softdev_banner_wide.png?alt=media&token=48c0b58e-7e9b-46a2-97b7-54324f331777',
      'https://via.placeholder.com/1200x400?text=SOFTDEV+TALLY+GURU+LAB',
      'https://via.placeholder.com/1200x400?text=SOFTDEV+TALLY+GURU+WORKSHOP'
    ],
    gallery: [
       { id: 'h1', url: 'https://firebasestorage.googleapis.com/v0/b/ais-dev-pzzj54zbvfrllp25htfrww.appspot.com/o/softdev_banner_wide.png?alt=media&token=48c0b58e-7e9b-46a2-97b7-54324f331777', caption: 'Official Institute Banner' },
       { id: '1', url: 'https://via.placeholder.com/800x600?text=Institute+Lab', caption: 'State of the Art Lab' },
       { id: '2', url: 'https://via.placeholder.com/800x600?text=Accounting+Workshop', caption: 'Accounting Workshop' },
       { id: '3', url: 'https://via.placeholder.com/800x600?text=Celebration', caption: 'Success Celebration' }
    ],
    prospectus: {
      name: 'STG_Academic_Prospectus_2026.pdf',
      size: '2.4 MB',
      url: 'https://stginstitute.in/prospectus.pdf',
      version: 'v2026.1.0'
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initial Seed Data
  const seedData = () => {
    const initialCategories: CourseCategory[] = [
      { id: 'cat-1', name: 'Software Development', description: 'Programming and App Dev' },
      { id: 'cat-2', name: 'Financial Accounting', description: 'Tally, GST and Business accounts' },
      { id: 'cat-3', name: 'Cyber Security', description: 'Network protection' },
      { id: 'cat-4', name: 'Office Automation', description: 'MS Office and Desktop operations' }
    ];

    const initialCourses: Course[] = [
      { 
        id: 'c1', title: 'Tally Prime Expert', category: 'Financial Accounting', duration: '3 Months', 
        description: 'Advanced Tally Prime training with real-world scenarios.', level: 'Professional', rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1554224155-169641357599?w=400&h=400&fit=crop'
      },
      { 
        id: 'c2', title: 'Python Fundamentals', category: 'Software Development', duration: '2 Months', 
        description: 'Basic to advanced Python.', level: 'Intermediate', rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop'
      },
      { 
        id: 'c3', title: 'DCA (Diploma in Computer App)', category: 'Office Automation', duration: '12 Months', 
        description: 'One year diploma covering all basics.', level: 'Advanced', rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop'
      }
    ];

    const initialSessions: AcademicSession[] = [
      { id: 'sess-1', name: '2024-25', startDate: '2024-04-01', endDate: '2025-03-31', status: 'ACTIVE', isDefault: true },
      { id: 'sess-2', name: '2023-24', startDate: '2023-04-01', endDate: '2024-03-31', status: 'INACTIVE', isDefault: false }
    ];

    const initialFranchises: Franchise[] = [
      {
        id: 'f1', name: 'Basti Main Campus', ownerId: 'u2', contact: '9450455378', address: 'Gandhi Nagar, Basti',
        walletBalance: 50000, status: 'APPROVED', revenueSharePercent: 20, createdAt: '2024-01-10T10:00:00Z',
        licenseDocs: [], loginId: 'basti_root', password: 'password', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=BC'
      },
      {
        id: 'f2', name: 'Lucknow Center', ownerId: 'u3', contact: '8888888888', address: 'Hazratganj, Lucknow',
        walletBalance: 15000, status: 'APPROVED', revenueSharePercent: 25, createdAt: '2024-02-15T12:00:00Z',
        licenseDocs: [], loginId: 'lucknow_ct', password: 'password'
      }
    ];

    const initialStudents: Student[] = [
      {
        id: 's1', enrollmentNo: 'STG/2024/0001', admissionNo: 'AD-2024-101', name: 'Aryan Mishra',
        fatherName: 'Rajesh Mishra', motherName: 'Sunita Mishra', dob: '2005-05-15', gender: 'Male',
        contact: '9988776655', guardianContact: '9988776654', email: 'aryan@stg.in',
        casteCategory: 'General', religion: 'Hinduism', maritalStatus: 'Single',
        identityType: 'Aadhar', idNumber: '1234 5678 9012', apparId: 'AP-9921',
        franchiseId: 'f1', studyCenter: 'Basti Main Campus', session: '2024-25',
        courseCategory: 'Financial Accounting', course: 'Tally Prime Expert', courseDuration: '3 Months',
        admissionDate: '2024-04-10', highestQualification: '12th', qualificationDetail: 'Science Stream',
        passingYear: '2023', address: '12, Malviya Road, Basti', state: 'Uttar Pradesh', district: 'Basti',
        pincode: '272001', remark: 'Good performance', enquirySource: 'Direct Website', verificationCode: 'V-9912',
        feeStatus: 'PARTIAL', kycStatus: 'PENDING', kycDocs: [
          { id: 'kd1', type: 'AADHAR', name: 'Aadhar Card', url: 'https://via.placeholder.com/800x500?text=Aadhar+Card+Preview', status: 'PENDING', uploadedAt: new Date().toISOString() },
          { id: 'kd2', type: 'QUALIFICATION', name: '12th Marksheet', url: 'https://via.placeholder.com/800x1100?text=Marksheet+Preview', status: 'PENDING', uploadedAt: new Date().toISOString() }
        ], 
        documents: [
          { id: 'doc-1', type: 'AADHAR', name: 'Aadhar / ID Card', url: 'https://via.placeholder.com/800x500?text=Aadhar+Card+Preview', status: 'PENDING', uploadedAt: new Date().toISOString() },
          { id: 'doc-2', type: 'QUALIFICATION', name: 'Qualification Document', url: 'https://via.placeholder.com/800x1100?text=Marksheet+Preview', status: 'PENDING', uploadedAt: new Date().toISOString() },
        ],
        totalFees: 5000, paidAmount: 2500,
        certificateStatus: 'NOT_APPLIED'
      },
      {
        id: 's2', enrollmentNo: 'STG/2024/0002', admissionNo: 'AD-2024-102', name: 'Pragati Singh',
        fatherName: 'Sanjay Singh', motherName: 'Anjali Singh', dob: '2006-02-20', gender: 'Female',
        contact: '9977665544', guardianContact: '9977665543', email: 'pragati@stg.in',
        casteCategory: 'OBC', religion: 'Hinduism', maritalStatus: 'Single',
        identityType: 'Aadhar', idNumber: '4455 6677 8899', apparId: 'AP-9922',
        franchiseId: 'f1', studyCenter: 'Basti Main Campus', session: '2024-25',
        courseCategory: 'Software Development', course: 'Python Fundamentals', courseDuration: '2 Months',
        admissionDate: '2024-05-02', highestQualification: 'B.Sc', qualificationDetail: 'Computer Science',
        passingYear: '2024', address: 'Mohalla Azad Nagar, Basti', state: 'Uttar Pradesh', district: 'Basti',
        pincode: '272002', remark: 'Inquisitive learner', enquirySource: 'Friend Referral', verificationCode: 'V-9913',
        feeStatus: 'PAID', kycStatus: 'APPROVED', kycDocs: [
          { id: 'kd3', type: 'AADHAR', name: 'Aadhar Card', url: 'https://via.placeholder.com/800x500?text=Aadhar+Card+Approved', status: 'APPROVED', uploadedAt: new Date().toISOString() }
        ],
        documents: [
          { id: 'doc-1', type: 'AADHAR', name: 'Aadhar / ID Card', url: 'https://via.placeholder.com/800x500?text=Aadhar+Card+Approved', status: 'APPROVED', uploadedAt: new Date().toISOString() },
        ],
        totalFees: 4500, paidAmount: 4500,
        certificateStatus: 'ISSUED'
      }
    ];

    const initialPayments: FeePayment[] = [
      {
        id: 'p1', studentId: 's1', receiptNo: 'RCP-001', date: '2024-04-10', feeType: 'Admission Fee',
        amount: 5000, discount: 0, penalty: 0, paidAmount: 2500, balance: 2500, paymentMode: 'CASH',
        status: 'Partial', collectionTime: '10:30 AM'
      },
      {
        id: 'p2', studentId: 's2', receiptNo: 'RCP-002', date: '2024-05-02', feeType: 'Full Course Fee',
        amount: 4500, discount: 0, penalty: 0, paidAmount: 4500, balance: 0, paymentMode: 'UPI',
        status: 'Paid', collectionTime: '11:45 AM'
      }
    ];

    const initialEnquiries: AdmissionEnquiry[] = [
      { id: 'enq-1', name: 'Rohan Gupta', email: 'rohan@gmail.com', phone: '9000000001', course: 'Tally Prime Expert', message: 'Looking for morning batch.', status: 'PENDING', createdAt: '2024-05-10T09:00:00Z' },
      { id: 'enq-2', name: 'Sana Khan', email: 'sana@gmail.com', phone: '9000000002', course: 'Python Fundamentals', message: 'Is certificate placement guaranteed?', status: 'FOLLOWED_UP', createdAt: '2024-05-12T14:20:00Z' }
    ];

    const initialAnnouncements: Announcement[] = [
      { id: 'ann-1', title: 'Session 2024-25 Registrations Open!', content: 'All centers are requested to update their course slots.', target: 'ALL', date: '2024-03-20T10:00:00Z', priority: 'HIGH', status: 'PUBLISHED' },
      { id: 'ann-2', title: 'System Maintenance', content: 'Portal will be down on Sunday night.', target: ['ADMIN', 'FRANCHISE'], date: '2024-05-14T10:00:00Z', priority: 'MEDIUM', status: 'PUBLISHED' }
    ];

    const initialFranchiseFees: FranchiseFee[] = [
      { id: 'ff1', franchiseId: 'f1', franchiseName: 'Basti Main Campus', registrationFees: 10000, marksheetFees: 500, description: 'Standard Tier Fee' },
      { id: 'ff2', franchiseId: 'f2', franchiseName: 'Lucknow Center', registrationFees: 15000, marksheetFees: 750, description: 'Tier 1 City' }
    ];

    const initialExams: Exam[] = [
      { id: 'ex-1', name: 'Q1 Theory Exam', session: '2024-25', trade: 'Tally Prime Expert', unit: 'Final', startDate: '2024-07-01', endDate: '2024-07-02', remarks: 'Bring AD-Card', status: 'UPCOMING', invigilator: 'Prof. Sharma' }
    ];

    setCourseCategories(initialCategories);
    setCourses(initialCourses);
    setSessions(initialSessions);
    setFranchises(initialFranchises);
    setStudents(initialStudents);
    setFeePayments(initialPayments);
    setEnquiries(initialEnquiries);
    setAnnouncements(initialAnnouncements);
    setFranchiseFees(initialFranchiseFees);
    setExams(initialExams);

    localStorage.setItem('courseCategories', JSON.stringify(initialCategories));
    localStorage.setItem('courses', JSON.stringify(initialCourses));
    localStorage.setItem('sessions', JSON.stringify(initialSessions));
    localStorage.setItem('franchises', JSON.stringify(initialFranchises));
    localStorage.setItem('students', JSON.stringify(initialStudents));
    localStorage.setItem('feePayments', JSON.stringify(initialPayments));
    localStorage.setItem('enquiries', JSON.stringify(initialEnquiries));
    localStorage.setItem('announcements', JSON.stringify(initialAnnouncements));
    localStorage.setItem('franchiseFees', JSON.stringify(initialFranchiseFees));
    localStorage.setItem('exams', JSON.stringify(initialExams));
  };

  // Initialize from storage or defaults
  useEffect(() => {
    const savedFranchises = localStorage.getItem('franchises');
    const savedStudents = localStorage.getItem('students');
    const savedEnquiries = localStorage.getItem('enquiries');
    const savedCourses = localStorage.getItem('courses');
    const savedFeeStructures = localStorage.getItem('feeStructures');
    const savedFeePayments = localStorage.getItem('feePayments');
    const savedFranchiseFees = localStorage.getItem('franchiseFees');
    const savedCertificates = localStorage.getItem('certificates');
    const savedSessions = localStorage.getItem('sessions');
    const savedAnnouncements = localStorage.getItem('announcements');
    const savedVouchers = localStorage.getItem('vouchers');
    const savedExams = localStorage.getItem('exams');
    const savedSubjects = localStorage.getItem('subjects');
    const savedCategories = localStorage.getItem('courseCategories');
    const savedPrograms = localStorage.getItem('programs');
    const savedGlobalSettings = localStorage.getItem('globalCourseSettings');
    const savedWalletTransactions = localStorage.getItem('walletTransactions');
    const savedBusinessTransactions = localStorage.getItem('businessTransactions');
    const savedBusinessProfile = localStorage.getItem('businessProfile');
    const savedUser = localStorage.getItem('user');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    // Seed data if courses is empty (or first launch)
    const parsedCourses = savedCourses ? JSON.parse(savedCourses) : [];
    if (!savedCourses || (Array.isArray(parsedCourses) && parsedCourses.length === 0)) {
      seedData();
    } else {
      const safeParse = (val: string | null) => {
        if (!val) return [];
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      };

      setFranchises(safeParse(savedFranchises));
      setStudents(safeParse(savedStudents));
      setEnquiries(safeParse(savedEnquiries));
      setCourses(safeParse(savedCourses));
      setFeeStructures(safeParse(savedFeeStructures));
      setFeePayments(safeParse(savedFeePayments));
      setFranchiseFees(safeParse(savedFranchiseFees));
      setCertificates(safeParse(savedCertificates));
      setSessions(safeParse(savedSessions));
      setAnnouncements(safeParse(savedAnnouncements));
      setVouchers(safeParse(savedVouchers));
      setExams(safeParse(savedExams));
      setSubjects(safeParse(savedSubjects));
      setCourseCategories(safeParse(savedCategories));
      setPrograms(safeParse(savedPrograms));
      
      if (savedGlobalSettings) {
        try {
          const parsed = JSON.parse(savedGlobalSettings);
          setGlobalCourseSettings(prev => ({ ...prev, ...parsed }));
        } catch (e) {}
      }
      
      setWalletTransactions(safeParse(savedWalletTransactions));
      setBusinessTransactions(safeParse(savedBusinessTransactions));
      
      if (savedBusinessProfile) {
        try {
          const parsed = JSON.parse(savedBusinessProfile);
          setBusinessProfile(prev => ({ ...prev, ...parsed }));
        } catch (e) {}
      }
    }

    setIsLoading(false);
  }, []);

  // Save to storage on updates
  useEffect(() => {
    if (!isLoading) {
      const saveData = (key: string, data: any) => {
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
          console.error(`Failed to save ${key} to localStorage:`, error);
        }
      };

      saveData('franchises', franchises);
      saveData('students', students);
      saveData('enquiries', enquiries);
      saveData('courses', courses);
      saveData('feeStructures', feeStructures);
      saveData('feePayments', feePayments);
      saveData('franchiseFees', franchiseFees);
      saveData('certificates', certificates);
      saveData('sessions', sessions);
      saveData('announcements', announcements);
      saveData('courseCategories', courseCategories);
      saveData('programs', programs);
      saveData('globalCourseSettings', globalCourseSettings);
      saveData('vouchers', vouchers);
      saveData('exams', exams);
      saveData('subjects', subjects);
      saveData('walletTransactions', walletTransactions);
      saveData('businessTransactions', businessTransactions);
      saveData('businessProfile', businessProfile);
    }
  }, [franchises, students, enquiries, courses, feeStructures, feePayments, franchiseFees, certificates, walletTransactions, businessTransactions, businessProfile, isLoading, sessions, announcements, courseCategories, programs, globalCourseSettings, vouchers, exams, subjects]);

  const login = (email: string, role: UserRole) => {
    const user: User = {
      id: (role === 'ADMIN' || role === 'ADMINISTRATOR') ? 'u1' : role === 'FRANCHISE' ? 'f1' : 's1',
      name: (role === 'ADMIN' || role === 'ADMINISTRATOR') ? 'System Director' : role === 'FRANCHISE' ? 'Basti Center Manager' : 'Student User',
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      franchiseId: (role === 'ADMIN' || role === 'ADMINISTRATOR') ? undefined : 'f1',
    };
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  const addFranchise = (f: Franchise) => setFranchises(prev => [...prev, f]);
  const updateFranchise = (id: string, updates: Partial<Franchise>) => 
    setFranchises(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  const deleteFranchise = (id: string) => setFranchises(prev => prev.filter(f => f.id !== id));
  
  const addStudent = (s: Student) => setStudents(prev => [...prev, s]);
  const updateStudent = (id: string, updates: Partial<Student>) =>
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));

  const issueCertificate = (c: Certificate) => setCertificates(prev => [...prev, c]);
  const addWalletTransaction = (t: WalletTransaction) => {
    // Check for sufficient balance if it's a debit
    if (t.type === 'DEBIT' && t.status === 'SUCCESS') {
      const currentFranchise = franchises.find(f => f.id === t.franchiseId);
      const currentBalance = currentFranchise?.walletBalance || 0;
      if (currentBalance < t.amount) {
        throw new Error('Inadequate wallet balance. Please recharge to proceed.');
      }
    }

    setWalletTransactions(prev => [t, ...prev]);
    
    if (t.status === 'SUCCESS') {
      const amountChange = t.type === 'CREDIT' ? t.amount : -t.amount;
      setFranchises(prev => prev.map(f => 
        f.id === t.franchiseId 
          ? { ...f, walletBalance: (f.walletBalance || 0) + amountChange }
          : f
      ));
    }
  };

  const addBusinessTransaction = (t: BusinessTransaction) => setBusinessTransactions(prev => [t, ...prev]);

  const addVoucher = (v: Voucher) => setVouchers(prev => [v, ...prev]);
  const updateVoucher = (id: string, updates: Partial<Voucher>) => 
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));

  const verifyVoucher = (id: string) => {
    const voucher = vouchers.find(v => v.id === id);
    if (!voucher || voucher.status === 'VERIFIED') return;

    updateVoucher(id, { status: 'VERIFIED' });
    
    // Add transaction to wallet
    const newTx: WalletTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      franchiseId: voucher.franchiseId,
      amount: voucher.amount,
      type: 'CREDIT',
      purpose: `Fund Addition (Voucher ${voucher.voucherNo})`,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      voucherId: id
    };
    addWalletTransaction(newTx);

    // Also add to business transactions
    addBusinessTransaction({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      type: 'INCOME',
      category: 'Franchise Fund',
      amount: voucher.amount,
      description: `Fund deposit via Voucher ${voucher.voucherNo} - ${voucher.centerName}`,
      paymentMode: 'Voucher',
      referenceId: voucher.franchiseId,
      status: 'SUCCESS'
    });
  };

  const addCourse = (c: Course) => setCourses(prev => [...prev, c]);
  const updateCourse = (id: string, updates: Partial<Course>) =>
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteCourse = (id: string) => setCourses(prev => prev.filter(c => c.id !== id));

  const addCourseCategory = (cat: CourseCategory) => {
    if (!courseCategories.find(c => c.id === cat.id)) {
      setCourseCategories(prev => [...prev, cat]);
    }
  };
  const updateCourseCategory = (id: string, updates: Partial<CourseCategory>) => {
    const oldCategory = courseCategories.find(c => c.id === id);
    setCourseCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

    if (oldCategory && updates.name && updates.name !== oldCategory.name) {
      setCourses(prev => prev.map(course => 
        course.category === oldCategory.name ? { ...course, category: updates.name! } : course
      ));
    }
  };
  const deleteCourseCategory = (id: string) => {
    if (!id) return;
    const categoryToDelete = courseCategories.find(c => c.id === id);
    setCourseCategories(prev => prev.filter(c => c.id !== id));
    
    if (categoryToDelete) {
      setCourses(prev => prev.map(course => 
        course.category === categoryToDelete.name ? { ...course, category: '' } : course
      ));
    }
  };

  const addProgram = (p: Program) => setPrograms(prev => [...prev, p]);
  const updateProgram = (id: string, updates: Partial<Program>) =>
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deleteProgram = (id: string) => setPrograms(prev => prev.filter(p => p.id !== id));

  const updateGlobalCourseSettings = (updates: Partial<GlobalCourseSettings>) =>
    setGlobalCourseSettings(prev => ({ ...prev, ...updates }));

  const addSession = (s: AcademicSession) => setSessions(prev => [...prev, s]);
  const updateSession = (id: string, updates: Partial<AcademicSession>) =>
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSession = (id: string) => setSessions(prev => prev.filter(s => s.id !== id));

  const addAnnouncement = (a: Announcement) => setAnnouncements(prev => [a, ...prev]);
  const updateAnnouncement = (id: string, updates: Partial<Announcement>) =>
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  const deleteAnnouncement = (id: string) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  const addExam = (e: Exam) => setExams(prev => [...prev, e]);
  const updateExam = (id: string, updates: Partial<Exam>) =>
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  const deleteExam = (id: string) => setExams(prev => prev.filter(e => e.id !== id));

  const addSubject = (s: Subject) => setSubjects(prev => [...prev, s]);
  const updateSubject = (id: string, updates: Partial<Subject>) =>
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSubject = (id: string) => setSubjects(prev => prev.filter(s => s.id !== id));

  const addFeeStructure = (f: FeeStructure) => setFeeStructures(prev => [...prev, f]);
  const updateFeeStructure = (id: string, updates: Partial<FeeStructure>) =>
    setFeeStructures(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  const deleteFeeStructure = (id: string) => setFeeStructures(prev => prev.filter(f => f.id !== id));

  const addFeePayment = (p: FeePayment) => {
    setFeePayments(prev => [...prev, p]);
    
    // Update student's paid amount and status
    setStudents(prev => prev.map(s => {
      if (s.id === p.studentId) {
        const newPaidAmount = s.paidAmount + p.paidAmount;
        const newStatus = newPaidAmount >= s.totalFees ? 'PAID' : (newPaidAmount > 0 ? 'PARTIAL' : 'PENDING');
        return { ...s, paidAmount: newPaidAmount, feeStatus: newStatus };
      }
      return s;
    }));

    // Record as business transaction (Income)
    const student = students.find(s => s.id === p.studentId);
    addBusinessTransaction({
      id: Math.random().toString(36).substr(2, 9),
      date: p.date,
      type: 'INCOME',
      category: 'Fee Collection',
      amount: p.paidAmount,
      description: `Fee Payment - ${student?.name || 'Unknown'} (${p.feeType})`,
      paymentMode: p.paymentMode,
      referenceId: p.studentId,
      status: 'SUCCESS'
    });
  };

  const addEnquiry = (e: AdmissionEnquiry) => setEnquiries(prev => [e, ...prev]);
  const updateEnquiry = (id: string, updates: Partial<AdmissionEnquiry>) =>
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  const deleteEnquiry = (id: string) => setEnquiries(prev => prev.filter(e => e.id !== id));

  const addFranchiseFee = (f: FranchiseFee) => setFranchiseFees(prev => [...prev, f]);
  const updateFranchiseFee = (id: string, updates: Partial<FranchiseFee>) =>
    setFranchiseFees(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));

  const updateBusinessProfile = (updates: Partial<BusinessProfile>) =>
    setBusinessProfile(prev => ({ ...prev, ...updates }));

  const clearData = () => {
    if (window.confirm('CRITICAL: This will delete ALL student records, transactions, and settings. This cannot be undone. Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, franchises, students, certificates, walletTransactions, businessTransactions, courses, feeStructures, feePayments, franchiseFees, enquiries, businessProfile, sessions, announcements, vouchers, exams, subjects, courseCategories, programs, globalCourseSettings, isLoading,
      setCurrentUser, addFranchise, updateFranchise, deleteFranchise, addStudent, updateStudent,
      issueCertificate, addWalletTransaction, addBusinessTransaction, addVoucher, updateVoucher, verifyVoucher, addCourse, updateCourse, deleteCourse, 
      addCourseCategory, updateCourseCategory, deleteCourseCategory,
      addProgram, updateProgram, deleteProgram,
      updateGlobalCourseSettings,
      addSession, updateSession, deleteSession,
      addAnnouncement, updateAnnouncement, deleteAnnouncement,
      addExam, updateExam, deleteExam,
      addSubject, updateSubject, deleteSubject,
      addFeeStructure, updateFeeStructure, deleteFeeStructure, addFeePayment,
      addEnquiry, updateEnquiry, deleteEnquiry,
      addFranchiseFee, updateFranchiseFee, updateBusinessProfile, login, logout, clearData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
