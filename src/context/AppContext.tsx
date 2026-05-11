/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Franchise, Student, Certificate, WalletTransaction, UserRole, Course, FeeStructure, FeePayment, FranchiseFee, AdmissionEnquiry, BusinessProfile, BusinessTransaction, AcademicSession, Announcement, Voucher } from '../types';

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
  login: (email: string, role: UserRole) => void;
  logout: () => void;
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
    const savedWalletTransactions = localStorage.getItem('walletTransactions');
    const savedBusinessTransactions = localStorage.getItem('businessTransactions');
    const savedBusinessProfile = localStorage.getItem('businessProfile');
    const savedUser = localStorage.getItem('user');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    else {
      const initialCourses: Course[] = [
        { 
          id: 'c1', 
          title: 'Distance Education Courses', 
          category: 'Distance Courses', 
          duration: 'Flexible', 
          description: 'Pursue your degree through online and distance mode.', 
          longDescription: 'Our distance education programs are designed for working professionals and students who need flexibility. We offer a wide range of computer and management courses through recognised universities, supported by our local learning centers.',
          features: ['DCA / ADCA / PGDCA', 'BCA / B.Sc IT / M.Sc IT', 'Tally Prime with GST', 'Web & Graphic Designing', 'Digital Marketing Certification'],
          level: 'Flexible Learning', 
          rating: 4.8 
        },
        { 
          id: 'c2', 
          title: 'Digital Marketing & Web Design', 
          category: 'Web Designing & Digital Marketing', 
          duration: '3 Month', 
          description: 'Master SEO, SMM, and professional website development.', 
          longDescription: 'A performance-driven program that combines creative design with technical marketing skills. You will learn to build responsive websites and implement digital growth strategies using modern tools.',
          features: ['Search Engine Optimization (SEO)', 'Social Media Marketing & Ads', 'WordPress, HTML5 & CSS3', 'Graphic Design for Social Media'],
          level: 'Industry Expert', 
          rating: 4.9 
        },
        { 
          id: 'c3', 
          title: 'NIELIT O Level', 
          category: 'NIELIT Courses', 
          duration: '1 Year', 
          description: 'Foundation Level Course recognized for Government Jobs.', 
          longDescription: 'The NIELIT ‘O’ Level course is equivalent to a Foundation Level Course in Computer Applications. It provides a robust foundation in ICT, covering everything from core hardware basics to advanced Python programming and IoT applications.',
          features: [
            'M1-R5: IT Tools and Network Basics',
            'M2-R5: Web Designing & Publishing',
            'M3-R5: Programming & Problem Solving through Python',
            'M4-R5: Internet of Things (IoT) & its Applications',
            'Practical Lab Assignments & Major Projects'
          ],
          level: 'Professional (Level 5)', 
          rating: 5.0 
        },
        { 
          id: 'c4', 
          title: 'Tally Prime with GST', 
          category: 'Accounting Courses', 
          duration: '3 Month', 
          description: 'Authorised Training Partner program for professional accountants.', 
          longDescription: 'As an Authorised Training Partner, we offer high-end accounting training with a focus on practical implementation. You will learn Tally Prime with GST, TDS, Payroll, and advanced inventory management.',
          features: [
            'Basic & Advanced Accounting Concepts',
            'Tally Prime with GST Implementation',
            'TDS and Payroll Management',
            'Income Tax & ITR Filing Basics',
            'Real-world Audit & Tally Projects'
          ],
          level: 'Expert Accounts', 
          rating: 4.7 
        },
        { 
          id: 'c5', 
          title: 'Diploma in Computer Application (DCA)', 
          category: 'Diploma Courses', 
          duration: '6 Month', 
          description: 'Essential digital skills for office automation.', 
          longDescription: 'DCA is a 6-month foundational diploma that prepares students for office roles. It covers fundamental computer operations, office productivity suites, and basic information management systems.',
          features: ['Fundamentals of Computing', 'Operating Systems (Windows/Linux)', 'MS Office (Word, Excel, PowerPoint)', 'Internet & Social Networking'],
          level: 'Core Foundations', 
          rating: 4.6 
        },
        { 
          id: 'c6', 
          title: 'Advance Diploma in Computer Application (ADCA)', 
          category: 'Diploma Courses', 
          duration: '12 Month', 
          description: 'Deep dive into advanced software and hardware management.', 
          longDescription: 'ADCA is our signature 12-month program for comprehensive IT training. It covers everything from basic office tools to advanced financial accounting, web design, and software development concepts.',
          features: ['Advanced Programming Concepts', 'E-Accounting & Tally Mastery', 'Desktop Publishing & Graphics', 'Software Project Development'],
          level: 'Advanced Skills', 
          rating: 4.9 
        },
        { 
          id: 'c9', 
          title: 'Desktop Publishing (DTP)', 
          category: 'Diploma Courses', 
          duration: '6 Month', 
          description: 'Master professional graphic design and publishing tools.', 
          longDescription: 'Learn to create professional logos, brochures, magazines, and marketing collaterals. This course focuses on industry-standard vector and raster graphics software.',
          features: ['Adobe Photoshop CC Mastery', 'CorelDraw for Professional Design', 'PageMaker & Layout Design', 'Digital Printing & Color Theory'],
          level: 'Creative Expert', 
          rating: 4.8 
        },
        { 
          id: 'c7', 
          title: 'Financial Accounting (DFA)', 
          category: 'Accounting Courses', 
          duration: '6 Month', 
          description: 'Professional financial bookkeeping and auditing techniques.', 
          longDescription: 'DFA focus on the core intricacies of professional bookkeeping. You will master the accounting cycle, finalization of accounts, and understand corporate accounting standards.',
          features: ['Advanced Financial Reporting', 'Budgetary Control & Auditing', 'Corporate Accounting Standards', 'Computerized Accounting Audit'],
          level: 'Accountant Grade', 
          rating: 4.5 
        },
        { 
          id: 'c8', 
          title: 'Computer Concept Course (CCC)', 
          category: 'NIELIT Courses', 
          duration: '3 Month', 
          description: 'NIELIT IT Literacy course for everyone.', 
          longDescription: 'CCC is an essential IT literacy course designed to equip individuals with basic computer skills for daily data operations. It is a mandatory requirement for many government applications.',
          features: ['GUI Based Operating Systems', 'Word Processing Concepts', 'Spreadsheets & Formulas', 'Digital Financial & Cyber Security'],
          level: 'Entry Level', 
          rating: 4.8 
        }
      ];
      setCourses(initialCourses);
    }

    if (savedFeeStructures) setFeeStructures(JSON.parse(savedFeeStructures));
    
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    else {
      const initialSessions: AcademicSession[] = [
        { id: 's1', name: '2023-24', startDate: '2023-04-01', endDate: '2024-03-31', status: 'INACTIVE', isDefault: false },
        { id: 's2', name: '2024-25', startDate: '2024-04-01', endDate: '2025-03-31', status: 'ACTIVE', isDefault: true },
        { id: 's3', name: '2025-26', startDate: '2025-04-01', endDate: '2026-03-31', status: 'ACTIVE', isDefault: false },
      ];
      setSessions(initialSessions);
    }

    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
    else {
      const initialAnnouncements: Announcement[] = [
        { id: 'a1', title: 'Summer Intake Admissions Open', content: 'We are now accepting applications for the July 2024 academic session. Franchises are encouraged to start marketing.', target: 'ALL', date: '2024-04-20', priority: 'HIGH', status: 'PUBLISHED' },
        { id: 'a2', title: 'New GST Course Material Updated', content: 'The latest GST professional course modules have been uploaded to the E-Content section.', target: ['FRANCHISE', 'TEACHER'], date: '2024-04-22', priority: 'MEDIUM', status: 'PUBLISHED' },
      ];
      setAnnouncements(initialAnnouncements);
    }

    if (savedVouchers) setVouchers(JSON.parse(savedVouchers));
    else {
      const initialVouchers: Voucher[] = [
        { id: 'v7', voucherNo: 'V007', date: '2026-03-25', amount: 3000, franchiseId: 'f2', centerName: 'Academy Center 2', directorName: 'SANJAY KUMAR MAURYA', remarks: 'paid', status: 'VERIFIED' },
        { id: 'v6', voucherNo: 'V006', date: '2025-12-12', amount: 2000, franchiseId: 'f1', centerName: 'Academy Center 1', directorName: 'John Franchise', remarks: 'ygfjehflkej', status: 'VERIFIED' },
        { id: 'v5', voucherNo: 'V005', date: '2025-11-27', amount: 2000, franchiseId: 'f1', centerName: 'Academy Center 1', directorName: 'John Franchise', remarks: 'jmggjhj', status: 'VERIFIED' },
        { id: 'v4', voucherNo: 'V004', date: '2025-11-19', amount: 2000, franchiseId: 'f1', centerName: 'Academy Center 1', directorName: 'John Franchise', remarks: '46587878797', status: 'VERIFIED' },
        { id: 'v3', voucherNo: 'V003', date: '2025-10-28', amount: 2000, franchiseId: 'f1', centerName: 'Academy Center 1', directorName: 'John Franchise', remarks: 'BXDHNBSDH', status: 'VERIFIED' },
        { id: 'v2', voucherNo: 'V002', date: '2025-10-17', amount: 5000, franchiseId: 'f1', centerName: 'Academy Center 1', directorName: 'John Franchise', remarks: 'NA', status: 'VERIFIED' },
        { id: 'v1', voucherNo: 'V001', date: '2025-10-10', amount: 25000, franchiseId: 'f1', centerName: 'Academy Center 1', directorName: 'John Franchise', remarks: 'NA', status: 'VERIFIED' },
      ];
      setVouchers(initialVouchers);
    }

    if (savedFeePayments) setFeePayments(JSON.parse(savedFeePayments));
    else {
      const initialFeePayments: FeePayment[] = [
        { id: 'p1', studentId: 's1', receiptNo: 'RCPT001', date: '2024-04-26', feeType: 'ONE TIME', amount: 3000, discount: 200, penalty: 0, paidAmount: 2800, balance: 0, paymentMode: 'UPI', status: 'Paid' },
      ];
      setFeePayments(initialFeePayments);
    }

    if (savedFranchiseFees) setFranchiseFees(JSON.parse(savedFranchiseFees));
    else {
      const initialFranchiseFees: FranchiseFee[] = [
        { id: 'ff1', franchiseId: 'f1', franchiseName: 'SOFTDEV TALLY GURU', registrationFees: 100, marksheetFees: 500 },
      ];
      setFranchiseFees(initialFranchiseFees);
    }

    if (savedFranchises) setFranchises(JSON.parse(savedFranchises));
    else {
      const mockFranchises: Franchise[] = [
        {
          id: 'f1',
          name: 'TechHub Mumbai',
          ownerId: 'u2',
          contact: '+91 9876543210',
          address: 'Andheri West, Mumbai',
          walletBalance: 25000,
          status: 'APPROVED',
          licenseDocs: [],
          revenueSharePercent: 20,
          createdAt: new Date().toISOString(),
          enabledMenus: ['DASHBOARD', 'STUDENTS', 'WALLET', 'EXAMS', 'COLLECTION', 'E_LEARNING']
        },
        {
          id: 'f2',
          name: 'CodeCraft Pune',
          ownerId: 'u3',
          contact: '+91 9876543211',
          address: 'Kothrud, Pune',
          walletBalance: 12000,
          status: 'PENDING',
          licenseDocs: [],
          revenueSharePercent: 20,
          createdAt: new Date().toISOString(),
          enabledMenus: ['DASHBOARD', 'STUDENTS']
        }
      ];
      setFranchises(mockFranchises);
    }

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    else {
      const mockStudents: Student[] = [
        {
          id: 's1',
          enrollmentNo: 'SF2024001',
          admissionNo: 'ST0828',
          name: 'Rahul Kumar',
          fatherName: 'Rajesh Kumar',
          motherName: 'Sunita Devi',
          dob: '2005-08-20',
          gender: 'Male',
          contact: '+91 7777777777',
          guardianContact: '+91 9999999999',
          email: 'rahul@example.com',
          casteCategory: 'General',
          religion: 'Hindu',
          maritalStatus: 'Single',
          identityType: 'Aadhar Card',
          idNumber: '1234-5678-9012',
          apparId: 'ABC-123',
          franchiseId: 'f1',
          studyCenter: 'TechHub Mumbai',
          session: '2024-25',
          courseCategory: 'Diploma Courses',
          course: 'Advance Diploma in Computer Application(ADCA)',
          courseDuration: '3 Month',
          admissionDate: '2024-01-15',
          highestQualification: '12th Pass',
          qualificationDetail: 'CBSE',
          passingYear: '2023',
          address: 'Andheri West, Mumbai',
          state: 'Maharashtra',
          district: 'Mumbai',
          pincode: '400053',
          remark: 'Scholarship student',
          enquirySource: 'Friend/Referral',
          verificationCode: 'V001',
          feeStatus: 'PAID',
          kycStatus: 'VERIFIED',
          kycDocs: [],
          totalFees: 45000,
          paidAmount: 45000,
        }
      ];
      setStudents(mockStudents);
    }

    if (savedEnquiries) setEnquiries(JSON.parse(savedEnquiries));
    if (savedCertificates) setCertificates(JSON.parse(savedCertificates));
    else {
      const initialCertificates: Certificate[] = [
        { 
          id: 'cert1', 
          studentId: 's1', 
          studentName: 'Rahul Kumar',
          franchiseId: 'f1',
          certificateNo: 'CERT-2024-STG-001', 
          course: 'Advance Diploma in Computer Application(ADCA)', 
          issueDate: '2024-05-10', 
          status: 'ISSUED', 
          qrCodeData: 'STG-CERT-001-RAHUL' 
        },
        { 
          id: 'cert2', 
          studentId: 's1', 
          studentName: 'Rahul Kumar',
          franchiseId: 'f1',
          certificateNo: 'CERT-2024-TALLY-001', 
          course: 'Tally Prime with GST', 
          issueDate: '2024-04-12', 
          status: 'ISSUED', 
          qrCodeData: 'STG-CERT-002-TALLY' 
        }
      ];
      setCertificates(initialCertificates);
    }
    if (savedWalletTransactions) setWalletTransactions(JSON.parse(savedWalletTransactions));
    if (savedBusinessTransactions) setBusinessTransactions(JSON.parse(savedBusinessTransactions));
    if (savedBusinessProfile) setBusinessProfile(JSON.parse(savedBusinessProfile));

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
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            alert(`Storage limit reached while saving ${key}. Try using smaller images or removing old documents.`);
          }
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
      saveData('vouchers', vouchers);
      saveData('walletTransactions', walletTransactions);
      saveData('businessTransactions', businessTransactions);
      saveData('businessProfile', businessProfile);
    }
  }, [franchises, students, enquiries, courses, feeStructures, feePayments, franchiseFees, certificates, walletTransactions, businessTransactions, businessProfile, isLoading, sessions, announcements]);

  const login = (email: string, role: UserRole) => {
    const user: User = {
      id: (role === 'ADMIN' || role === 'ADMINISTRATOR') ? 'u1' : role === 'FRANCHISE' ? 'u2' : 'u4',
      name: (role === 'ADMIN' || role === 'ADMINISTRATOR') ? 'System Admin' : role === 'FRANCHISE' ? 'John Franchise' : 'Alice Student',
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      franchiseId: (role === 'ADMIN' || role === 'ADMINISTRATOR') ? undefined : (role === 'FRANCHISE' ? 'f1' : 'f1'),
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
    setWalletTransactions(prev => [t, ...prev]);
    if (t.status === 'SUCCESS') {
      updateFranchise(t.franchiseId, { 
        walletBalance: (franchises.find(f => f.id === t.franchiseId)?.walletBalance || 0) + (t.type === 'CREDIT' ? t.amount : -t.amount)
      });
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

  const addSession = (s: AcademicSession) => setSessions(prev => [...prev, s]);
  const updateSession = (id: string, updates: Partial<AcademicSession>) =>
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSession = (id: string) => setSessions(prev => prev.filter(s => s.id !== id));

  const addAnnouncement = (a: Announcement) => setAnnouncements(prev => [a, ...prev]);
  const updateAnnouncement = (id: string, updates: Partial<Announcement>) =>
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  const deleteAnnouncement = (id: string) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  const addFeeStructure = (f: FeeStructure) => setFeeStructures(prev => [...prev, f]);
  const updateFeeStructure = (id: string, updates: Partial<FeeStructure>) =>
    setFeeStructures(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  const deleteFeeStructure = (id: string) => setFeeStructures(prev => prev.filter(f => f.id !== id));

  const addFeePayment = (p: FeePayment) => setFeePayments(prev => [...prev, p]);

  const addEnquiry = (e: AdmissionEnquiry) => setEnquiries(prev => [e, ...prev]);
  const updateEnquiry = (id: string, updates: Partial<AdmissionEnquiry>) =>
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  const deleteEnquiry = (id: string) => setEnquiries(prev => prev.filter(e => e.id !== id));

  const addFranchiseFee = (f: FranchiseFee) => setFranchiseFees(prev => [...prev, f]);
  const updateFranchiseFee = (id: string, updates: Partial<FranchiseFee>) =>
    setFranchiseFees(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));

  const updateBusinessProfile = (updates: Partial<BusinessProfile>) =>
    setBusinessProfile(prev => ({ ...prev, ...updates }));

  return (
    <AppContext.Provider value={{
      currentUser, franchises, students, certificates, walletTransactions, businessTransactions, courses, feeStructures, feePayments, franchiseFees, enquiries, businessProfile, sessions, announcements, vouchers, isLoading,
      setCurrentUser, addFranchise, updateFranchise, deleteFranchise, addStudent, updateStudent,
      issueCertificate, addWalletTransaction, addBusinessTransaction, addVoucher, updateVoucher, verifyVoucher, addCourse, updateCourse, deleteCourse, 
      addSession, updateSession, deleteSession,
      addAnnouncement, updateAnnouncement, deleteAnnouncement,
      addFeeStructure, updateFeeStructure, deleteFeeStructure, addFeePayment,
      addEnquiry, updateEnquiry, deleteEnquiry,
      addFranchiseFee, updateFranchiseFee, updateBusinessProfile, login, logout
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
