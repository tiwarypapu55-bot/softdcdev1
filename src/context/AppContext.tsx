/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseAdmin, uploadToStorage } from '../lib/supabase';
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

// Helper functions to map snake_case from DB to camelCase for the frontend (and vice-versa)
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function ensureUUID(id: string): string {
  if (!id || !isUUID(id)) {
    return generateUUID();
  }
  return id;
}

const snakeToCamel = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  } else if (obj !== null && typeof obj === 'object') {
    const n: any = {};
    Object.keys(obj).forEach((k) => {
      if (['kyc_docs', 'documents', 'heads', 'gallery'].includes(k)) {
        n[k.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())] = obj[k];
      } else {
        const camelKey = k.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        n[camelKey] = snakeToCamel(obj[k]);
      }
    });
    return n;
  }
  return obj;
};

const camelToSnake = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  } else if (obj !== null && typeof obj === 'object') {
    const n: any = {};
    Object.keys(obj).forEach((k) => {
      if (['kycDocs', 'documents', 'heads', 'gallery'].includes(k)) {
        n[k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)] = obj[k];
      } else {
        const snakeKey = k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        n[snakeKey] = camelToSnake(obj[k]);
      }
    });
    return n;
  }
  return obj;
};

const mapDbToBusinessProfile = (row: any): BusinessProfile => {
  if (!row) return {} as BusinessProfile;

  // Extract extra fields from gallery backup if present
  let extraFields: any = {};
  const galleryArray = Array.isArray(row.gallery) ? row.gallery : [];
  const extraFieldsItem = galleryArray.find((item: any) => item && item.id === '__extra_fields_backup__');
  if (extraFieldsItem && extraFieldsItem.data) {
    extraFields = extraFieldsItem.data;
  }

  const cleanGallery = galleryArray.filter((item: any) => item && item.id !== '__extra_fields_backup__');

  return {
    id: row.id || '00000000-0000-0000-0000-000000000001',
    name: row.name || 'SOFTDEV TALLY GURU',
    legalName: row.legal_name || 'SOFTDEV TALLY GURU PRASHIKSHAN SANSTHAN SOCIETY',
    isoNo: row.iso_no || '9001:2015',
    regNo: row.reg_no || 'G-58913 / 1442',
    email: row.email || 'info@stginstitute.in',
    phone: row.phone || '+91 9450455378',
    address: row.address || 'Near Mahila Degree College, Companybagh Basti (Uttar Pradesh) India-272001',
    regionalAddress: row.regional_address || '',
    pincode: ('pincode' in row) ? (row.pincode || '') : (extraFields.pincode || ''),
    website: row.website || 'www.stginstitute.in',
    workingHours: row.working_hours || '09:00 AM - 06:00 PM',
    logoUrl: ('logo_url' in row) ? (row.logo_url || '') : (extraFields.logoUrl || ''),
    headerImageUrl: ('header_image_url' in row) ? (row.header_image_url || '') : (extraFields.headerImageUrl || ''),
    signatureUrl: ('signature_url' in row) ? (row.signature_url || '') : (extraFields.signatureUrl || ''),
    mission: row.mission || 'To empower students through technology and quality education.',
    facebookUrl: row.facebook_url || '',
    twitterUrl: row.twitter_url || '',
    instagramUrl: row.instagram_url || '',
    linkedinUrl: row.linkedin_url || '',
    directorPhotoUrl: ('director_photo_url' in row) ? (row.director_photo_url || '') : (extraFields.directorPhotoUrl || ''),
    directorName: ('director_name' in row) ? (row.director_name || '') : (extraFields.directorName || ''),
    directorMessage: ('director_message' in row) ? (row.director_message || '') : (extraFields.directorMessage || ''),
    banners: ('banners' in row) ? (row.banners || []) : (extraFields.banners || []),
    gallery: cleanGallery,
    aboutUsUrl: ('about_banner_url' in row) ? (row.about_banner_url || '') : (extraFields.aboutUsUrl || ''),
    contactUsUrl: ('contact_banner_url' in row) ? (row.contact_banner_url || '') : (extraFields.contactUsUrl || ''),
    featuredCoursesBannerUrl: ('featured_courses_image_url' in row) ? (row.featured_courses_image_url || '') : (extraFields.featuredCoursesBannerUrl || ''),
    successStoriesBannerUrl: ('success_stories_banner_url' in row) ? (row.success_stories_banner_url || '') : (extraFields.successStoriesBannerUrl || ''),
    receiptHeaderUrl: ('receipt_top_header_url' in row) ? (row.receipt_top_header_url || '') : (extraFields.receiptHeaderUrl || ''),
    visionaries: ('visionaries' in row) ? (row.visionaries || []) : (extraFields.visionaries || []),
    prospectus: row.prospectus_url || row.prospectus_name ? {
      url: row.prospectus_url || '',
      name: row.prospectus_name || '',
      size: row.prospectus_size || '',
      version: row.prospectus_version || ''
    } : (extraFields.prospectus || null)
  };
};

const mapBusinessProfileToDb = (bp: Partial<BusinessProfile>, dbColumns?: string[]): any => {
  const columns = dbColumns || [
    'id', 'name', 'legal_name', 'iso_no', 'reg_no', 'email', 'phone', 'address', 'regional_address',
    'website', 'working_hours', 'logo_url', 'header_image_url', 'signature_url', 'mission',
    'facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url', 'director_photo_url',
    'director_name', 'director_message', 'banners', 'gallery', 'pincode', 'enable_digital_signatures',
    'visionaries', 'about_banner_url', 'contact_banner_url', 'featured_courses_image_url', 
    'success_stories_banner_url', 'receipt_top_header_url', 'prospectus_url', 'prospectus_name', 
    'prospectus_size', 'prospectus_version', 'prospectus_updated_at'
  ];

  const row: any = {};
  const extraFields: any = {};

  const assignField = (bpKey: string, dbCol: string, val: any) => {
    if (columns.includes(dbCol)) {
      row[dbCol] = val;
    } else {
      extraFields[bpKey] = val;
    }
  };

  if (bp.id !== undefined) row.id = bp.id;
  if (bp.name !== undefined) row.name = bp.name;
  if (bp.legalName !== undefined) assignField('legalName', 'legal_name', bp.legalName);
  if (bp.isoNo !== undefined) assignField('isoNo', 'iso_no', bp.isoNo);
  if (bp.regNo !== undefined) assignField('regNo', 'reg_no', bp.regNo);
  if (bp.email !== undefined) assignField('email', 'email', bp.email);
  if (bp.phone !== undefined) assignField('phone', 'phone', bp.phone);
  if (bp.address !== undefined) assignField('address', 'address', bp.address);
  if (bp.regionalAddress !== undefined) assignField('regionalAddress', 'regional_address', bp.regionalAddress);
  if (bp.website !== undefined) assignField('website', 'website', bp.website);
  if (bp.workingHours !== undefined) assignField('workingHours', 'working_hours', bp.workingHours);
  if (bp.logoUrl !== undefined) assignField('logoUrl', 'logo_url', bp.logoUrl);
  if (bp.headerImageUrl !== undefined) assignField('headerImageUrl', 'header_image_url', bp.headerImageUrl);
  if (bp.signatureUrl !== undefined) assignField('signatureUrl', 'signature_url', bp.signatureUrl);
  if (bp.mission !== undefined) assignField('mission', 'mission', bp.mission);
  if (bp.facebookUrl !== undefined) assignField('facebookUrl', 'facebook_url', bp.facebookUrl);
  if (bp.twitterUrl !== undefined) assignField('twitterUrl', 'twitter_url', bp.twitterUrl);
  if (bp.instagramUrl !== undefined) assignField('instagramUrl', 'instagram_url', bp.instagramUrl);
  if (bp.linkedinUrl !== undefined) assignField('linkedinUrl', 'linkedin_url', bp.linkedinUrl);
  if (bp.directorPhotoUrl !== undefined) assignField('directorPhotoUrl', 'director_photo_url', bp.directorPhotoUrl);
  if (bp.directorName !== undefined) assignField('directorName', 'director_name', bp.directorName);
  if (bp.directorMessage !== undefined) assignField('directorMessage', 'director_message', bp.directorMessage);
  if (bp.banners !== undefined) assignField('banners', 'banners', bp.banners);

  // Extra fields:
  if (bp.pincode !== undefined) assignField('pincode', 'pincode', bp.pincode);
  if (bp.aboutUsUrl !== undefined) assignField('aboutUsUrl', 'about_banner_url', bp.aboutUsUrl);
  if (bp.contactUsUrl !== undefined) assignField('contactUsUrl', 'contact_banner_url', bp.contactUsUrl);
  if (bp.featuredCoursesBannerUrl !== undefined) assignField('featuredCoursesBannerUrl', 'featured_courses_image_url', bp.featuredCoursesBannerUrl);
  if (bp.successStoriesBannerUrl !== undefined) assignField('successStoriesBannerUrl', 'success_stories_banner_url', bp.successStoriesBannerUrl);
  if (bp.receiptHeaderUrl !== undefined) assignField('receiptHeaderUrl', 'receipt_top_header_url', bp.receiptHeaderUrl);
  if (bp.visionaries !== undefined) assignField('visionaries', 'visionaries', bp.visionaries);

  if (bp.prospectus !== undefined) {
    if (bp.prospectus) {
      if (columns.includes('prospectus_url')) {
        row.prospectus_url = bp.prospectus.url;
        row.prospectus_name = bp.prospectus.name;
        row.prospectus_size = bp.prospectus.size;
        row.prospectus_version = bp.prospectus.version;
      } else {
        extraFields.prospectus = bp.prospectus;
      }
    } else {
      if (columns.includes('prospectus_url')) {
        row.prospectus_url = null;
        row.prospectus_name = null;
        row.prospectus_size = null;
        row.prospectus_version = null;
      } else {
        extraFields.prospectus = null;
      }
    }
  }

  // Gallery
  if (bp.gallery !== undefined) {
    const cleanGallery = bp.gallery.filter((item: any) => item && item.id !== '__extra_fields_backup__');
    if (Object.keys(extraFields).length > 0) {
      row.gallery = [
        ...cleanGallery,
        { id: '__extra_fields_backup__', url: '', caption: 'Extra Fields Backup Space', data: extraFields }
      ];
    } else {
      row.gallery = cleanGallery;
    }
  } else if (Object.keys(extraFields).length > 0) {
    row.gallery = [
      { id: '__extra_fields_backup__', url: '', caption: 'Extra Fields Backup Space', data: extraFields }
    ];
  }

  return row;
};

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
  const [businessProfileColumns, setBusinessProfileColumns] = useState<string[]>([
    'id', 'name', 'legal_name', 'iso_no', 'reg_no', 'email', 'phone', 'address', 'regional_address',
    'website', 'working_hours', 'logo_url', 'header_image_url', 'signature_url', 'mission',
    'facebook_url', 'twitter_url', 'instagram_url', 'linkedin_url', 'director_photo_url',
    'director_name', 'director_message', 'banners', 'gallery', 'pincode', 'enable_digital_signatures',
    'visionaries', 'about_banner_url', 'contact_banner_url', 'featured_courses_image_url', 
    'success_stories_banner_url', 'receipt_top_header_url', 'prospectus_url', 'prospectus_name', 
    'prospectus_size', 'prospectus_version', 'prospectus_updated_at'
  ]);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    id: '00000000-0000-0000-0000-000000000001',
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

  // Seeds initial setup defaults directly to remote Supabase tables if they are empty
  const seedInitialDataToSupabase = async () => {
    try {
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
          walletBalance: 50000, status: 'APPROVED', revenueSharePercent: 20, createdAt: new Date().toISOString(),
          licenseDocs: [], loginId: 'basti_root', password: 'password', logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=BC'
        },
        {
          id: 'f2', name: 'Lucknow Center', ownerId: 'u3', contact: '8888888888', address: 'Hazratganj, Lucknow',
          walletBalance: 15000, status: 'APPROVED', revenueSharePercent: 25, createdAt: new Date().toISOString(),
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
            { id: 'doc-2', type: 'QUALIFICATION', name: 'Aadhar Card Back', url: 'https://via.placeholder.com/800x1100?text=Marksheet+Preview', status: 'PENDING', uploadedAt: new Date().toISOString() },
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
          status: 'Partial', remarks: 'Partial admission fees'
        },
        {
          id: 'p2', studentId: 's2', receiptNo: 'RCP-002', date: '2024-05-02', feeType: 'Full Course Fee',
          amount: 4500, discount: 0, penalty: 0, paidAmount: 4500, balance: 0, paymentMode: 'UPI',
          status: 'Paid', remarks: 'Paid completely'
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

      const initialFranchiseFees = [
        { id: 'ff1', franchiseId: 'f1', franchiseName: 'Basti Main Campus', registrationFees: 10000, marksheetFees: 500, description: 'Standard Tier Fee' },
        { id: 'ff2', franchiseId: 'f2', franchiseName: 'Lucknow Center', registrationFees: 15000, marksheetFees: 750, description: 'Tier 1 City' }
      ];

      const initialExams: Exam[] = [
        { id: 'ex-1', name: 'Q1 Theory Exam', session: '2024-25', trade: 'Tally Prime Expert', unit: 'Final', startDate: '2024-07-01', endDate: '2024-07-02', remarks: 'Bring AD-Card', status: 'UPCOMING', invigilator: 'Prof. Sharma' }
      ];

      const initialFeeStructures: FeeStructure[] = [
        {
          id: generateUUID(),
          head: 'Admission Fee',
          courseId: 'c1',
          courseName: 'Tally Prime Expert',
          frequency: 'One-time',
          amount: 1000,
          discount: 0,
          latePenalty: 5,
          session: '2024-25',
          type: 'Academic',
          status: 'ACTIVE'
        },
        {
          id: generateUUID(),
          head: 'Course Fee',
          courseId: 'c1',
          courseName: 'Tally Prime Expert',
          frequency: 'One-time',
          amount: 4000,
          discount: 0,
          latePenalty: 5,
          session: '2024-25',
          type: 'Academic',
          status: 'ACTIVE'
        },
        {
          id: generateUUID(),
          head: 'Admission Fee',
          courseId: 'c2',
          courseName: 'Python Fundamentals',
          frequency: 'One-time',
          amount: 1500,
          discount: 0,
          latePenalty: 10,
          session: '2024-25',
          type: 'Academic',
          status: 'ACTIVE'
        },
        {
          id: generateUUID(),
          head: 'Course Fee',
          courseId: 'c2',
          courseName: 'Python Fundamentals',
          frequency: 'One-time',
          amount: 3000,
          discount: 0,
          latePenalty: 10,
          session: '2024-25',
          type: 'Academic',
          status: 'ACTIVE'
        },
        {
          id: generateUUID(),
          head: 'Admission Fee',
          courseId: 'c3',
          courseName: 'DCA (Diploma in Computer App)',
          frequency: 'One-time',
          amount: 2000,
          discount: 0,
          latePenalty: 15,
          session: '2024-25',
          type: 'Academic',
          status: 'ACTIVE'
        },
        {
          id: generateUUID(),
          head: 'Course Fee',
          courseId: 'c3',
          courseName: 'DCA (Diploma in Computer App)',
          frequency: 'One-time',
          amount: 8000,
          discount: 500,
          latePenalty: 15,
          session: '2024-25',
          type: 'Academic',
          status: 'ACTIVE'
        },
        {
          id: generateUUID(),
          head: 'Exam Fee',
          courseId: 'all',
          courseName: 'All IT Courses',
          frequency: 'One-time',
          amount: 500,
          discount: 0,
          latePenalty: 10,
          session: '2024-25',
          type: 'Academic',
          status: 'ACTIVE'
        }
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
      setFeeStructures(initialFeeStructures);

      // Seed to remote database safely using Admin Client to bypass default row access locks
      await supabaseAdmin.from('courses').insert(camelToSnake(initialCourses));
      await supabaseAdmin.from('franchises').insert(camelToSnake(initialFranchises));
      
      const mappedCategories = initialCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
        thumbnail_url: cat.imageUrl || '',
        banner_image_url: cat.bannerUrl || ''
      }));
      await supabaseAdmin.from('course_categories').insert(mappedCategories);
      
      const mappedSessions = initialSessions.map(s => ({
        id: ensureUUID(s.id),
        name: s.name,
        start_date: s.startDate,
        end_date: s.endDate,
        status: s.status,
        is_default: s.isDefault
      }));
      await supabaseAdmin.from('academic_sessions').insert(mappedSessions);
      await supabaseAdmin.from('students').insert(camelToSnake(initialStudents));

      const mappedPayments = initialPayments.map(p => ({
        id: ensureUUID(p.id),
        student_id: p.studentId,
        receipt_no: p.receiptNo,
        date: p.date,
        fee_type: p.feeType,
        amount: p.amount,
        discount: p.discount,
        penalty: p.penalty,
        paid_amount: p.paidAmount,
        balance: p.balance,
        payment_mode: p.paymentMode,
        status: p.status,
        remarks: p.remarks || ''
      }));
      await supabaseAdmin.from('fee_payments').insert(mappedPayments);
      await supabaseAdmin.from('admission_enquiries').insert(camelToSnake(initialEnquiries));
      await supabaseAdmin.from('announcements').insert(camelToSnake(initialAnnouncements));

      const mappedExams = initialExams.map(ex => ({
        id: ensureUUID(ex.id),
        name: ex.name,
        session: ex.session,
        trade: ex.trade,
        unit: ex.unit,
        start_date: ex.startDate,
        end_date: ex.endDate,
        remarks: ex.remarks,
        status: ex.status,
        invigilator: ex.invigilator
      }));
      await supabaseAdmin.from('exams').insert(mappedExams);

      const mappedFranchiseFees = initialFranchiseFees.map(ff => ({
        id: ensureUUID(ff.id),
        head: 'FRANCHISE_FEE_RECORD',
        course_id: ff.franchiseId,
        course_name: ff.franchiseName,
        amount: ff.registrationFees,
        discount: ff.marksheetFees,
        frequency: ff.description,
        type: 'FRANCHISE_FEE',
        status: 'ACTIVE'
      }));
      await supabaseAdmin.from('fee_structures').insert(mappedFranchiseFees);

      await supabaseAdmin.from('fee_structures').insert(camelToSnake(initialFeeStructures));

      const defaultProfile = mapBusinessProfileToDb({
        id: '00000000-0000-0000-0000-000000000001',
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
        directorMessage: `At Softdev Guru, our mission has always been clear: to bridge the gap between traditional education and the rapidly evolving demands of the global digital economy. We don't just teach software; we cultivate a mindset of innovation and practical excellence.`,
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
        ]
      });
      await supabaseAdmin.from('business_profile').insert(defaultProfile);

      console.log('Database seeded with standard initial datasets.');
    } catch (e) {
      console.error('Remote seeding failed, operating on state fallback:', e);
    }
  };

  // 1. Initial State Hydration effect from Supabase
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const loadFromSupabase = async () => {
      try {
        setIsLoading(true);

        // Fetch from all collections
        const [
          { data: fData },
          { data: sData },
          { data: cData },
          { data: pData },
          { data: eData },
          { data: seData },
          { data: anData },
          { data: voData },
          { data: exData },
          { data: certData },
          { data: wtData },
          { data: btData },
          { data: fsData },
          { data: bpData },
          { data: ccData }
        ] = await Promise.all([
          supabaseAdmin.from('franchises').select('*'),
          supabaseAdmin.from('students').select('*'),
          supabaseAdmin.from('courses').select('*'),
          supabaseAdmin.from('fee_payments').select('*'),
          supabaseAdmin.from('admission_enquiries').select('*'),
          supabaseAdmin.from('academic_sessions').select('*'),
          supabaseAdmin.from('announcements').select('*'),
          supabaseAdmin.from('vouchers').select('*'),
          supabaseAdmin.from('exams').select('*'),
          supabaseAdmin.from('certificates').select('*'),
          supabaseAdmin.from('wallet_transactions').select('*'),
          supabaseAdmin.from('business_transactions').select('*'),
          supabaseAdmin.from('fee_structures').select('*'),
          supabaseAdmin.from('business_profile').select('*'),
          supabaseAdmin.from('course_categories').select('*')
        ]);

        const rawCourses = cData ? snakeToCamel(cData) : [];
        if (rawCourses.length === 0) {
          // Empty remote Database - trigger initial seeding to database
          await seedInitialDataToSupabase();
          
          // Seed fallback from localStorage
          const storedPrograms = localStorage.getItem('programs');
          const storedSubjects = localStorage.getItem('subjects');
          const storedSettings = localStorage.getItem('globalCourseSettings');
          if (storedPrograms) setPrograms(JSON.parse(storedPrograms));
          if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
          if (storedSettings) setGlobalCourseSettings(JSON.parse(storedSettings));
        } else {
          setFranchises(fData ? snakeToCamel(fData) : []);
          setStudents(sData ? snakeToCamel(sData) : []);
          setCourses(rawCourses);
          setFeePayments(pData ? snakeToCamel(pData) : []);
          setEnquiries(eData ? snakeToCamel(eData) : []);
          setAnnouncements(anData ? snakeToCamel(anData) : []);
          setVouchers(voData ? snakeToCamel(voData) : []);
          setCertificates(certData ? snakeToCamel(certData) : []);
          setWalletTransactions(wtData ? snakeToCamel(wtData) : []);
          setBusinessTransactions(btData ? snakeToCamel(btData) : []);

          const rawCategories = ccData ? ccData.map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description || '',
            imageUrl: row.thumbnail_url || row.image_url || '',
            bannerUrl: row.banner_image_url || row.banner_url || ''
          })) : [];
          setCourseCategories(rawCategories);

          const rawSessions = seData ? snakeToCamel(seData) : [];
          setSessions(rawSessions);

          const rawExams = exData ? snakeToCamel(exData) : [];
          setExams(rawExams);

          const rawFeeStructures = fsData ? snakeToCamel(fsData) : [];
          setFeeStructures(rawFeeStructures.filter((x: any) => x.type !== 'FRANCHISE_FEE'));
          setFranchiseFees(rawFeeStructures.filter((x: any) => x.type === 'FRANCHISE_FEE').map((x: any) => ({
            id: x.id,
            franchiseId: x.courseId,
            franchiseName: x.courseName,
            registrationFees: x.amount,
            marksheetFees: x.discount,
            description: x.frequency || ''
          })));

          if (bpData && bpData.length > 0) {
            const dbKeys = Object.keys(bpData[0]);
            setBusinessProfileColumns(prev => Array.from(new Set([...prev, ...dbKeys])));
            const loadedBp = mapDbToBusinessProfile(bpData[0]);
            setBusinessProfile(loadedBp);

            const galleryArray = Array.isArray(bpData[0].gallery) ? bpData[0].gallery : [];
            const extraFieldsItem = galleryArray.find((item: any) => item && item.id === '__extra_fields_backup__');
            if (extraFieldsItem && extraFieldsItem.data) {
              const extraFields = extraFieldsItem.data;
              if (extraFields.programs) setPrograms(extraFields.programs);
              if (extraFields.subjects) setSubjects(extraFields.subjects);
              if (extraFields.globalCourseSettings) setGlobalCourseSettings(extraFields.globalCourseSettings);
            } else {
              const storedPrograms = localStorage.getItem('programs');
              const storedSubjects = localStorage.getItem('subjects');
              const storedSettings = localStorage.getItem('globalCourseSettings');
              if (storedPrograms) setPrograms(JSON.parse(storedPrograms));
              if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
              if (storedSettings) setGlobalCourseSettings(JSON.parse(storedSettings));
            }
          } else {
            const storedPrograms = localStorage.getItem('programs');
            const storedSubjects = localStorage.getItem('subjects');
            const storedSettings = localStorage.getItem('globalCourseSettings');
            if (storedPrograms) setPrograms(JSON.parse(storedPrograms));
            if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
            if (storedSettings) setGlobalCourseSettings(JSON.parse(storedSettings));
          }
        }
      } catch (e) {
        console.error('Failed to load real-time datasets from Supabase. Offline mode starting...', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadFromSupabase();
  }, []);

  // 2. Real-Time postgres changes live synchronization channel
  useEffect(() => {
    const channel = supabaseAdmin
      .channel('global-database-realtime-replication')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        const table = payload.table;
        const eventType = payload.eventType;
        const newRecord = payload.new ? snakeToCamel(payload.new) : null;
        const oldRecord = payload.old ? snakeToCamel(payload.old) : null;

        if (table === 'courses') {
          if (eventType === 'INSERT') {
            setCourses(prev => prev.some(x => x.id === newRecord.id) ? prev : [...prev, newRecord]);
          } else if (eventType === 'UPDATE') {
            setCourses(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setCourses(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'franchises') {
          if (eventType === 'INSERT') {
            setFranchises(prev => prev.some(x => x.id === newRecord.id) ? prev : [...prev, newRecord]);
          } else if (eventType === 'UPDATE') {
            setFranchises(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setFranchises(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'students') {
          if (eventType === 'INSERT') {
            setStudents(prev => prev.some(x => x.id === newRecord.id) ? prev : [...prev, newRecord]);
          } else if (eventType === 'UPDATE') {
            setStudents(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setStudents(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'exams') {
          if (eventType === 'INSERT') {
            setExams(prev => prev.some(x => x.id === newRecord.id) ? prev : [...prev, newRecord]);
          } else if (eventType === 'UPDATE') {
            setExams(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setExams(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'vouchers') {
          if (eventType === 'INSERT') {
            setVouchers(prev => prev.some(x => x.id === newRecord.id) ? prev : [newRecord, ...prev]);
          } else if (eventType === 'UPDATE') {
            setVouchers(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setVouchers(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'wallet_transactions') {
          if (eventType === 'INSERT') {
            setWalletTransactions(prev => prev.some(x => x.id === newRecord.id) ? prev : [newRecord, ...prev]);
          } else if (eventType === 'UPDATE') {
            setWalletTransactions(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setWalletTransactions(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'business_transactions') {
          if (eventType === 'INSERT') {
            setBusinessTransactions(prev => prev.some(x => x.id === newRecord.id) ? prev : [newRecord, ...prev]);
          } else if (eventType === 'UPDATE') {
            setBusinessTransactions(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setBusinessTransactions(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'admission_enquiries') {
          if (eventType === 'INSERT') {
            setEnquiries(prev => prev.some(x => x.id === newRecord.id) ? prev : [newRecord, ...prev]);
          } else if (eventType === 'UPDATE') {
            setEnquiries(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setEnquiries(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'announcements') {
          if (eventType === 'INSERT') {
            setAnnouncements(prev => prev.some(x => x.id === newRecord.id) ? prev : [newRecord, ...prev]);
          } else if (eventType === 'UPDATE') {
            setAnnouncements(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setAnnouncements(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'certificates') {
          if (eventType === 'INSERT') {
            setCertificates(prev => prev.some(x => x.id === newRecord.id) ? prev : [...prev, newRecord]);
          } else if (eventType === 'UPDATE') {
            setCertificates(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setCertificates(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'academic_sessions') {
          if (eventType === 'INSERT') {
            setSessions(prev => prev.some(x => x.id === newRecord.id) ? prev : [...prev, newRecord]);
          } else if (eventType === 'UPDATE') {
            setSessions(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setSessions(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'fee_payments') {
          if (eventType === 'INSERT') {
            setFeePayments(prev => prev.some(x => x.id === newRecord.id) ? prev : [...prev, newRecord]);
          } else if (eventType === 'UPDATE') {
            setFeePayments(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
          } else if (eventType === 'DELETE') {
            setFeePayments(prev => prev.filter(x => x.id !== oldRecord.id));
          }
        }

        else if (table === 'business_profile') {
          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            const parsedBp = mapDbToBusinessProfile(payload.new);
            setBusinessProfile(parsedBp);

            // Extract extra backup fields
            const galleryArray = Array.isArray(payload.new.gallery) ? payload.new.gallery : [];
            const extraFieldsItem = galleryArray.find((item: any) => item && item.id === '__extra_fields_backup__');
            if (extraFieldsItem && extraFieldsItem.data) {
              const extraFields = extraFieldsItem.data;
              if (extraFields.programs) setPrograms(extraFields.programs);
              if (extraFields.subjects) setSubjects(extraFields.subjects);
              if (extraFields.globalCourseSettings) setGlobalCourseSettings(extraFields.globalCourseSettings);
            }
          }
        }

        else if (table === 'fee_structures') {
          if (newRecord && newRecord.type === 'FRANCHISE_FEE') {
            const mappedFF = {
              id: newRecord.id,
              franchiseId: newRecord.courseId,
              franchiseName: newRecord.courseName,
              registrationFees: newRecord.amount,
              marksheetFees: newRecord.discount,
              description: newRecord.frequency || ''
            };
            if (eventType === 'INSERT') {
              setFranchiseFees(prev => prev.some(x => x.id === mappedFF.id) ? prev : [...prev, mappedFF]);
            } else if (eventType === 'UPDATE') {
              setFranchiseFees(prev => prev.map(x => x.id === mappedFF.id ? { ...x, ...mappedFF } : x));
            } else if (eventType === 'DELETE') {
              setFranchiseFees(prev => prev.filter(x => x.id !== oldRecord.id));
            }
          } else if (newRecord) {
            if (eventType === 'INSERT') {
              setFeeStructures(prev => prev.some(x => x.id === newRecord.id) ? prev : [...prev, newRecord]);
            } else if (eventType === 'UPDATE') {
              setFeeStructures(prev => prev.map(x => x.id === newRecord.id ? { ...x, ...newRecord } : x));
            } else if (eventType === 'DELETE') {
              setFeeStructures(prev => prev.filter(x => x.id !== oldRecord.id));
            }
          }
        }
      })
      .subscribe();

    return () => {
      supabaseAdmin.removeChannel(channel);
    };
  }, []);

  // 3. Fallback Local Storage Persistence
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

  const addFranchise = async (f: Franchise) => {
    setFranchises(prev => [...prev, f]);
    try {
      await supabaseAdmin.from('franchises').insert(camelToSnake(f));
    } catch (err) {
      console.error('Failed to sync insert franchise to database:', err);
    }
  };

  const updateFranchise = async (id: string, updates: Partial<Franchise>) => {
    setFranchises(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    try {
      await supabaseAdmin.from('franchises').update(camelToSnake(updates)).eq('id', id);
    } catch (err) {
      console.error('Failed to sync update franchise on database:', err);
    }
  };

  const deleteFranchise = async (id: string) => {
    setFranchises(prev => prev.filter(f => f.id !== id));
    try {
      await supabaseAdmin.from('franchises').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to sync delete franchise from database:', err);
    }
  };
  
  const addStudent = async (s: Student) => {
    setStudents(prev => [...prev, s]);
    try {
      await supabaseAdmin.from('students').insert(camelToSnake(s));
    } catch (err) {
      console.error('Failed to sync add student to database:', err);
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    try {
      await supabaseAdmin.from('students').update(camelToSnake(updates)).eq('id', id);
    } catch (err) {
      console.error('Failed to sync update student on database:', err);
    }
  };

  const issueCertificate = async (c: Certificate) => {
    setCertificates(prev => [...prev, c]);
    try {
      await supabaseAdmin.from('certificates').insert(camelToSnake(c));
    } catch (err) {
      console.error('Failed to sync issue certificate to database:', err);
    }
  };

  const addWalletTransaction = async (t: WalletTransaction) => {
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
      const targetFranchise = franchises.find(f => f.id === t.franchiseId);
      const originalBalance = targetFranchise?.walletBalance || 0;
      const newBalance = originalBalance + amountChange;

      setFranchises(prev => prev.map(f => 
        f.id === t.franchiseId 
          ? { ...f, walletBalance: newBalance }
          : f
      ));

      try {
        await supabaseAdmin.from('franchises').update({ wallet_balance: newBalance }).eq('id', t.franchiseId);
      } catch (err) {
        console.error('Failed to update wallet balance on franchise:', err);
      }
    }

    try {
      await supabaseAdmin.from('wallet_transactions').insert(camelToSnake(t));
    } catch (err) {
      console.error('Failed to sync wallet transaction to database:', err);
    }
  };

  const addBusinessTransaction = async (t: BusinessTransaction) => {
    setBusinessTransactions(prev => [t, ...prev]);
    try {
      await supabaseAdmin.from('business_transactions').insert(camelToSnake(t));
    } catch (err) {
      console.error('Failed to sync business transaction to database:', err);
    }
  };

  const addVoucher = async (v: Voucher) => {
    setVouchers(prev => [v, ...prev]);
    try {
      await supabaseAdmin.from('vouchers').insert(camelToSnake(v));
    } catch (err) {
      console.error('Failed to sync voucher to database:', err);
    }
  };

  const updateVoucher = async (id: string, updates: Partial<Voucher>) => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    try {
      await supabaseAdmin.from('vouchers').update(camelToSnake(updates)).eq('id', id);
    } catch (err) {
      console.error('Failed to sync update voucher on database:', err);
    }
  };

  const verifyVoucher = async (id: string) => {
    const voucher = vouchers.find(v => v.id === id);
    if (!voucher || voucher.status === 'VERIFIED') return;

    await updateVoucher(id, { status: 'VERIFIED' });
    
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
    await addWalletTransaction(newTx);

    // Also add to business transactions
    await addBusinessTransaction({
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

  const addCourse = async (c: Course) => {
    setCourses(prev => [...prev, c]);
    try {
      await supabaseAdmin.from('courses').insert(camelToSnake(c));
    } catch (err) {
      console.error('Failed to sync add course to database:', err);
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    try {
      await supabaseAdmin.from('courses').update(camelToSnake(updates)).eq('id', id);
    } catch (err) {
      console.error('Failed to sync update course on database:', err);
    }
  };

  const deleteCourse = async (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    try {
      await supabaseAdmin.from('courses').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to sync delete course from database:', err);
    }
  };

  const addCourseCategory = async (cat: CourseCategory) => {
    if (!courseCategories.find(c => c.id === cat.id)) {
      setCourseCategories(prev => [...prev, cat]);
      try {
        let imageUrl = cat.imageUrl || '';
        let bannerUrl = cat.bannerUrl || '';
        const timestamp = Date.now();
        const catId = cat.id;

        if (imageUrl.startsWith('data:')) {
          imageUrl = await uploadToStorage(imageUrl, `cat_thumb_${catId}_${timestamp}.webp`);
        }
        if (bannerUrl.startsWith('data:')) {
          bannerUrl = await uploadToStorage(bannerUrl, `cat_banner_${catId}_${timestamp}.webp`);
        }

        // Keep local state in sync with clean URL
        setCourseCategories(prev => prev.map(c => c.id === catId ? { ...c, imageUrl, bannerUrl } : c));

        const mappedCategory = {
          id: catId,
          name: cat.name,
          description: cat.description || '',
          thumbnail_url: imageUrl,
          banner_image_url: bannerUrl
        };
        await supabaseAdmin.from('course_categories').insert(mappedCategory);
      } catch (err) {
        console.error('Failed to sync add course category to database:', err);
      }
    }
  };

  const updateCourseCategory = async (id: string, updates: Partial<CourseCategory>) => {
    const oldCategory = courseCategories.find(c => c.id === id);
    setCourseCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

    if (oldCategory && updates.name && updates.name !== oldCategory.name) {
      setCourses(prev => prev.map(course => 
        course.category === oldCategory.name ? { ...course, category: updates.name! } : course
      ));
    }

    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      
      let imageUrl = updates.imageUrl;
      let bannerUrl = updates.bannerUrl;
      const timestamp = Date.now();

      if (imageUrl && imageUrl.startsWith('data:')) {
        imageUrl = await uploadToStorage(imageUrl, `cat_thumb_${id}_${timestamp}.webp`);
        dbUpdates.thumbnail_url = imageUrl;
        setCourseCategories(prev => prev.map(c => c.id === id ? { ...c, imageUrl } : c));
      } else if (imageUrl !== undefined) {
        dbUpdates.thumbnail_url = imageUrl;
      }

      if (bannerUrl && bannerUrl.startsWith('data:')) {
        bannerUrl = await uploadToStorage(bannerUrl, `cat_banner_${id}_${timestamp}.webp`);
        dbUpdates.banner_image_url = bannerUrl;
        setCourseCategories(prev => prev.map(c => c.id === id ? { ...c, bannerUrl } : c));
      } else if (bannerUrl !== undefined) {
        dbUpdates.banner_image_url = bannerUrl;
      }

      await supabaseAdmin.from('course_categories').update(dbUpdates).eq('id', id);
    } catch (err) {
      console.error('Failed to sync update course category in database:', err);
    }
  };

  const deleteCourseCategory = async (id: string) => {
    if (!id) return;
    const categoryToDelete = courseCategories.find(c => c.id === id);
    setCourseCategories(prev => prev.filter(c => c.id !== id));
    
    if (categoryToDelete) {
      setCourses(prev => prev.map(course => 
        course.category === categoryToDelete.name ? { ...course, category: '' } : course
      ));
    }

    try {
      await supabaseAdmin.from('course_categories').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to sync delete course category from database:', err);
    }
  };

  const saveExtraToDb = async (newPrograms: Program[], newSubjects: Subject[], newSettings: GlobalCourseSettings) => {
    try {
      const extraFields: any = {
        programs: newPrograms,
        subjects: newSubjects,
        globalCourseSettings: newSettings
      };

      const galleryArray = Array.isArray(businessProfile.gallery) ? businessProfile.gallery : [];
      const extraFieldsItem = galleryArray.find((item: any) => item && item.id === '__extra_fields_backup__');
      let combinedExtraFields = { ...(extraFieldsItem?.data || {}) };
      combinedExtraFields = {
        ...combinedExtraFields,
        ...extraFields
      };

      const cleanGallery = galleryArray.filter((item: any) => item && item.id !== '__extra_fields_backup__');
      
      const updatedGallery = [
        ...cleanGallery,
        { id: '__extra_fields_backup__', url: '', caption: 'Extra Fields Backup Space', data: combinedExtraFields }
      ];

      // Update business_profile local state so it stays in sync
      setBusinessProfile(prev => ({
        ...prev,
        gallery: updatedGallery
      }));

      // Update business_profile in DB
      const bpId = isUUID(businessProfile.id) ? businessProfile.id : '00000000-0000-0000-0000-000000000001';
      const dbRow = mapBusinessProfileToDb({
        ...businessProfile,
        gallery: updatedGallery,
        id: bpId
      }, businessProfileColumns);

      const filteredDbRow: any = {};
      Object.keys(dbRow).forEach(key => {
        if (businessProfileColumns.includes(key)) {
          filteredDbRow[key] = dbRow[key];
        }
      });

      await supabaseAdmin.from('business_profile').upsert(filteredDbRow);
    } catch (err) {
      console.error('Failed to sync extra schema properties to Supabase business_profile:', err);
    }
  };

  const addProgram = async (p: Program) => {
    const updated = [...programs, p];
    setPrograms(updated);
    await saveExtraToDb(updated, subjects, globalCourseSettings);
  };

  const updateProgram = async (id: string, updates: Partial<Program>) => {
    const updated = programs.map(p => p.id === id ? { ...p, ...updates } : p);
    setPrograms(updated);
    await saveExtraToDb(updated, subjects, globalCourseSettings);
  };

  const deleteProgram = async (id: string) => {
    const updated = programs.filter(p => p.id !== id);
    setPrograms(updated);
    await saveExtraToDb(updated, subjects, globalCourseSettings);
  };

  const updateGlobalCourseSettings = async (updates: Partial<GlobalCourseSettings>) => {
    const updated = { ...globalCourseSettings, ...updates };
    setGlobalCourseSettings(updated);
    await saveExtraToDb(programs, subjects, updated);
  };

  const addSession = async (s: AcademicSession) => {
    const cleanSession = { ...s, id: ensureUUID(s.id) };
    setSessions(prev => [...prev, cleanSession]);
    try {
      await supabaseAdmin.from('academic_sessions').insert({
        id: cleanSession.id,
        name: s.name,
        start_date: s.startDate,
        end_date: s.endDate,
        status: s.status,
        is_default: s.isDefault
      });
    } catch (err) {
      console.error('Failed to sync session insert:', err);
    }
  };

  const updateSession = async (id: string, updates: Partial<AcademicSession>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    try {
      const mappedUpdates: any = {};
      if (updates.name !== undefined) mappedUpdates.name = updates.name;
      if (updates.startDate !== undefined) mappedUpdates.start_date = updates.startDate;
      if (updates.endDate !== undefined) mappedUpdates.end_date = updates.endDate;
      if (updates.status !== undefined) mappedUpdates.status = updates.status;
      if (updates.isDefault !== undefined) mappedUpdates.is_default = updates.isDefault;
      await supabaseAdmin.from('academic_sessions').update(mappedUpdates).eq('id', ensureUUID(id));
    } catch (err) {
      console.error('Failed to sync session update:', err);
    }
  };

  const deleteSession = async (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    try {
      await supabaseAdmin.from('academic_sessions').delete().eq('id', ensureUUID(id));
    } catch (err) {
      console.error('Failed to sync session deletion:', err);
    }
  };

  const addAnnouncement = async (a: Announcement) => {
    setAnnouncements(prev => [a, ...prev]);
    try {
      await supabaseAdmin.from('announcements').insert(camelToSnake(a));
    } catch (err) {
      console.error('Failed to sync insert announcement:', err);
    }
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    try {
      await supabaseAdmin.from('announcements').update(camelToSnake(updates)).eq('id', id);
    } catch (err) {
      console.error('Failed to sync update announcement:', err);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    try {
      await supabaseAdmin.from('announcements').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to sync delete announcement:', err);
    }
  };

  const addExam = async (e: Exam) => {
    const cleanExam = { ...e, id: ensureUUID(e.id) };
    setExams(prev => [...prev, cleanExam]);
    try {
      await supabaseAdmin.from('exams').insert({
        id: cleanExam.id,
        name: e.name,
        session: e.session,
        trade: e.trade,
        unit: e.unit,
        start_date: e.startDate,
        end_date: e.endDate,
        remarks: e.remarks,
        status: e.status,
        invigilator: e.invigilator
      });
    } catch (err) {
      console.error('Failed to sync exam insert:', err);
    }
  };

  const updateExam = async (id: string, updates: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    try {
      const mappedUpdates: any = {};
      if (updates.name !== undefined) mappedUpdates.name = updates.name;
      if (updates.session !== undefined) mappedUpdates.session = updates.session;
      if (updates.trade !== undefined) mappedUpdates.trade = updates.trade;
      if (updates.unit !== undefined) mappedUpdates.unit = updates.unit;
      if (updates.startDate !== undefined) mappedUpdates.start_date = updates.startDate;
      if (updates.endDate !== undefined) mappedUpdates.end_date = updates.endDate;
      if (updates.remarks !== undefined) mappedUpdates.remarks = updates.remarks;
      if (updates.status !== undefined) mappedUpdates.status = updates.status;
      if (updates.invigilator !== undefined) mappedUpdates.invigilator = updates.invigilator;
      await supabaseAdmin.from('exams').update(mappedUpdates).eq('id', ensureUUID(id));
    } catch (err) {
      console.error('Failed to sync exam update:', err);
    }
  };

  const deleteExam = async (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    try {
      await supabaseAdmin.from('exams').delete().eq('id', ensureUUID(id));
    } catch (err) {
      console.error('Failed to sync exam delete:', err);
    }
  };

  const addSubject = async (s: Subject) => {
    const updated = [...subjects, s];
    setSubjects(updated);
    await saveExtraToDb(programs, updated, globalCourseSettings);
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    const updated = subjects.map(s => s.id === id ? { ...s, ...updates } : s);
    setSubjects(updated);
    await saveExtraToDb(programs, updated, globalCourseSettings);
  };

  const deleteSubject = async (id: string) => {
    const updated = subjects.filter(s => s.id !== id);
    setSubjects(updated);
    await saveExtraToDb(programs, updated, globalCourseSettings);
  };

  const addFeeStructure = async (f: FeeStructure) => {
    const cleanFee = { ...f, id: ensureUUID(f.id) };
    setFeeStructures(prev => [...prev, cleanFee]);
    try {
      await supabaseAdmin.from('fee_structures').insert(camelToSnake(cleanFee));
    } catch (err) {
      console.error('Failed to sync fee structure insert:', err);
    }
  };

  const updateFeeStructure = async (id: string, updates: Partial<FeeStructure>) => {
    setFeeStructures(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    try {
      await supabaseAdmin.from('fee_structures').update(camelToSnake(updates)).eq('id', id);
    } catch (err) {
      console.error('Failed to sync fee structure update:', err);
    }
  };

  const deleteFeeStructure = async (id: string) => {
    setFeeStructures(prev => prev.filter(f => f.id !== id));
    try {
      await supabaseAdmin.from('fee_structures').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to sync fee structure delete:', err);
    }
  };

  const addFeePayment = async (p: FeePayment) => {
    setFeePayments(prev => [...prev, p]);
    
    // Update student's paid amount and status
    const student = students.find(s => s.id === p.studentId);
    if (student) {
      const newPaidAmount = student.paidAmount + p.paidAmount;
      const newStatus = newPaidAmount >= student.totalFees ? 'PAID' : (newPaidAmount > 0 ? 'PARTIAL' : 'PENDING');
      
      setStudents(prev => prev.map(s => {
        if (s.id === p.studentId) {
          return { ...s, paidAmount: newPaidAmount, feeStatus: newStatus };
        }
        return s;
      }));

      try {
        await supabaseAdmin.from('students').update({ paid_amount: newPaidAmount, fee_status: newStatus }).eq('id', p.studentId);
      } catch (err) {
        console.error('Failed to sync update student balances:', err);
      }
    }

    try {
      await supabaseAdmin.from('fee_payments').insert({
        id: ensureUUID(p.id),
        student_id: p.studentId,
        receipt_no: p.receiptNo,
        date: p.date,
        fee_type: p.feeType,
        amount: p.amount,
        discount: p.discount,
        penalty: p.penalty,
        paid_amount: p.paidAmount,
        balance: p.balance,
        payment_mode: p.paymentMode,
        status: p.status,
        remarks: p.remarks || ''
      });
    } catch (err) {
      console.error('Failed to sync fee payment insert:', err);
    }

    // Record as business transaction (Income)
    await addBusinessTransaction({
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

  const addEnquiry = async (e: AdmissionEnquiry) => {
    setEnquiries(prev => [e, ...prev]);
    try {
      await supabaseAdmin.from('admission_enquiries').insert(camelToSnake(e));
    } catch (err) {
      console.error('Failed to sync enquiry insert:', err);
    }
  };

  const updateEnquiry = async (id: string, updates: Partial<AdmissionEnquiry>) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    try {
      await supabaseAdmin.from('admission_enquiries').update(camelToSnake(updates)).eq('id', id);
    } catch (err) {
      console.error('Failed to sync enquiry update:', err);
    }
  };

  const deleteEnquiry = async (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
    try {
      await supabaseAdmin.from('admission_enquiries').delete().eq('id', id);
    } catch (err) {
      console.error('Failed to sync enquiry delete:', err);
    }
  };

  const addFranchiseFee = async (f: FranchiseFee) => {
    const cleanFee = { ...f, id: ensureUUID(f.id) };
    setFranchiseFees(prev => [...prev, cleanFee]);
    try {
      await supabaseAdmin.from('fee_structures').insert({
        id: cleanFee.id,
        head: 'FRANCHISE_FEE_RECORD',
        course_id: f.franchiseId,
        course_name: f.franchiseName,
        amount: f.registrationFees,
        discount: f.marksheetFees,
        frequency: f.description,
        type: 'FRANCHISE_FEE',
        status: 'ACTIVE'
      });
    } catch (err) {
      console.error('Failed to sync franchise fee insert:', err);
    }
  };

  const updateFranchiseFee = async (id: string, updates: Partial<FranchiseFee>) => {
    setFranchiseFees(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    try {
      const mappedUpdates: any = {};
      if (updates.franchiseId !== undefined) mappedUpdates.course_id = updates.franchiseId;
      if (updates.franchiseName !== undefined) mappedUpdates.course_name = updates.franchiseName;
      if (updates.registrationFees !== undefined) mappedUpdates.amount = updates.registrationFees;
      if (updates.marksheetFees !== undefined) mappedUpdates.discount = updates.marksheetFees;
      if (updates.description !== undefined) mappedUpdates.frequency = updates.description;
      await supabaseAdmin.from('fee_structures').update(mappedUpdates).eq('id', ensureUUID(id));
    } catch (err) {
      console.error('Failed to sync franchise fee update:', err);
    }
  };

  const updateBusinessProfile = async (updates: Partial<BusinessProfile>) => {
    // 1. Instantly update local UI state with the edits for an incredibly fast and snappy response
    setBusinessProfile(prev => {
      const merged = { ...prev, ...updates };
      if (!isUUID(merged.id)) {
        merged.id = '00000000-0000-0000-0000-000000000001';
      }
      return merged;
    });

    try {
      // 2. Clone updates to safely upload any base64 files (data URIs) to Supabase Storage
      const bpToSave = { ...updates };
      const bpId = isUUID(businessProfile.id) ? businessProfile.id : '00000000-0000-0000-0000-000000000001';
      const timestamp = Date.now();

      if (bpToSave.logoUrl && typeof bpToSave.logoUrl === 'string' && bpToSave.logoUrl.startsWith('data:')) {
        bpToSave.logoUrl = await uploadToStorage(bpToSave.logoUrl, `logo_${bpId}_${timestamp}.webp`);
      }
      if (bpToSave.headerImageUrl && typeof bpToSave.headerImageUrl === 'string' && bpToSave.headerImageUrl.startsWith('data:')) {
        bpToSave.headerImageUrl = await uploadToStorage(bpToSave.headerImageUrl, `header_${bpId}_${timestamp}.webp`);
      }
      if (bpToSave.signatureUrl && typeof bpToSave.signatureUrl === 'string' && bpToSave.signatureUrl.startsWith('data:')) {
        bpToSave.signatureUrl = await uploadToStorage(bpToSave.signatureUrl, `signature_${bpId}_${timestamp}.webp`);
      }
      if (bpToSave.directorPhotoUrl && typeof bpToSave.directorPhotoUrl === 'string' && bpToSave.directorPhotoUrl.startsWith('data:')) {
        bpToSave.directorPhotoUrl = await uploadToStorage(bpToSave.directorPhotoUrl, `director_${bpId}_${timestamp}.webp`);
      }
      if (bpToSave.aboutUsUrl && typeof bpToSave.aboutUsUrl === 'string' && bpToSave.aboutUsUrl.startsWith('data:')) {
        bpToSave.aboutUsUrl = await uploadToStorage(bpToSave.aboutUsUrl, `about_${bpId}_${timestamp}.webp`);
      }
      if (bpToSave.contactUsUrl && typeof bpToSave.contactUsUrl === 'string' && bpToSave.contactUsUrl.startsWith('data:')) {
        bpToSave.contactUsUrl = await uploadToStorage(bpToSave.contactUsUrl, `contact_${bpId}_${timestamp}.webp`);
      }
      if (bpToSave.featuredCoursesBannerUrl && typeof bpToSave.featuredCoursesBannerUrl === 'string' && bpToSave.featuredCoursesBannerUrl.startsWith('data:')) {
        bpToSave.featuredCoursesBannerUrl = await uploadToStorage(bpToSave.featuredCoursesBannerUrl, `featured_courses_${bpId}_${timestamp}.webp`);
      }
      if (bpToSave.successStoriesBannerUrl && typeof bpToSave.successStoriesBannerUrl === 'string' && bpToSave.successStoriesBannerUrl.startsWith('data:')) {
        bpToSave.successStoriesBannerUrl = await uploadToStorage(bpToSave.successStoriesBannerUrl, `success_stories_${bpId}_${timestamp}.webp`);
      }
      if (bpToSave.receiptHeaderUrl && typeof bpToSave.receiptHeaderUrl === 'string' && bpToSave.receiptHeaderUrl.startsWith('data:')) {
        bpToSave.receiptHeaderUrl = await uploadToStorage(bpToSave.receiptHeaderUrl, `receipt_header_${bpId}_${timestamp}.webp`);
      }

      // Upload Home Banners array if they contain base64 files
      if (bpToSave.banners && bpToSave.banners.length > 0) {
        const uploadedBanners: string[] = [];
        for (let i = 0; i < bpToSave.banners.length; i++) {
          const banner = bpToSave.banners[i];
          if (banner && typeof banner === 'string' && banner.startsWith('data:')) {
            const url = await uploadToStorage(banner, `banner_${bpId}_${i}_${timestamp}.webp`);
            uploadedBanners.push(url);
          } else if (banner) {
            uploadedBanners.push(banner);
          }
        }
        bpToSave.banners = uploadedBanners;
      }

      // Upload Gallery photos if they contain base64 files
      if (bpToSave.gallery && bpToSave.gallery.length > 0) {
        const uploadedGallery = [];
        for (let i = 0; i < bpToSave.gallery.length; i++) {
          const item = bpToSave.gallery[i];
          if (item && item.url && typeof item.url === 'string' && item.url.startsWith('data:')) {
            const url = await uploadToStorage(item.url, `gallery_${bpId}_${item.id}_${timestamp}.webp`);
            uploadedGallery.push({ ...item, url });
          } else if (item) {
            uploadedGallery.push(item);
          }
        }
        bpToSave.gallery = uploadedGallery;
      }

      // Upload Prospectus if it contains base64 file
      if (bpToSave.prospectus && bpToSave.prospectus.url && typeof bpToSave.prospectus.url === 'string' && bpToSave.prospectus.url.startsWith('data:')) {
        const url = await uploadToStorage(bpToSave.prospectus.url, `prospectus_${bpId}_${timestamp}.pdf`);
        bpToSave.prospectus = {
          ...bpToSave.prospectus,
          url
        };
      }

      // 3. Keep local state in sync with the clean, permanent public storage URLs
      setBusinessProfile(prev => ({
        ...prev,
        ...bpToSave,
        id: bpId
      }));

      // 4. Map to snakecase rows and serialize to DB row structure
      const dbRow = mapBusinessProfileToDb({
        ...businessProfile,
        ...bpToSave,
        id: bpId
      }, businessProfileColumns);

      // Filter DBRow to only include keys that are actual columns in the Supabase schema cache
      const filteredDbRow: any = {};
      Object.keys(dbRow).forEach(key => {
        if (businessProfileColumns.includes(key)) {
          filteredDbRow[key] = dbRow[key];
        } else {
          console.warn(`Column '${key}' is not available in their remote database schema. Skipping to prevent request crash.`);
        }
      });

      // 5. Try to save row to Supabase
      const { data, error } = await supabaseAdmin.from('business_profile').upsert(filteredDbRow).select();
      if (error) {
        console.error('Failed to sync business profile upsert raw error:', error);
        throw error;
      }
    } catch (err) {
      console.error('Failed to sync business profile upsert exception:', err);
      throw err;
    }
  };

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
