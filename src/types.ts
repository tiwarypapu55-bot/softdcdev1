/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BusinessProfile {
  id: string;
  name: string;
  legalName: string;
  isoNo: string;
  regNo: string;
  email: string;
  phone: string;
  address: string;
  regionalAddress?: string;
  pincode?: string;
  website: string;
  workingHours: string;
  logoUrl?: string;
  headerImageUrl?: string;
  signatureUrl?: string;
  mission: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  prospectus?: {
    name: string;
    size: string;
    url: string;
    version: string;
  } | null;
  directorPhotoUrl?: string;
  directorName?: string;
  directorMessage?: string;
  banners?: string[];
  gallery?: { id: string; url: string; caption?: string }[];
  aboutUsUrl?: string;
  contactUsUrl?: string;
  featuredCoursesBannerUrl?: string;
  successStoriesBannerUrl?: string;
  visionaries?: { id: string; name: string; role: string; imageUrl: string }[];
  receiptHeaderUrl?: string;
}

export interface Exam {
  id: string;
  name: string;
  session: string;
  trade: string;
  unit: string;
  startDate: string;
  endDate: string;
  remarks: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  invigilator: string;
}

export type UserRole = 'ADMINISTRATOR' | 'ADMIN' | 'FRANCHISE' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  franchiseId?: string; // For FRANCHISE and STUDENT
}

export interface Franchise {
  id: string;
  name: string;
  ownerId: string;
  contact: string;
  address: string;
  walletBalance: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED';
  licenseDocs: DocumentRecord[];
  revenueSharePercent: number; // e.g., 20 means 20% to admin, 80% to franchise
  createdAt: string;
  validityFrom?: string;
  validityTo?: string;
  loginId?: string;
  password?: string;
  approvalCertificateUrl?: string;
  directorPhotoUrl?: string;
  logoUrl?: string;
  enabledMenus?: string[]; // List of menu IDs enabled for this franchise
}

export interface PaymentModeDetail {
  mode: string;
  amount: number;
  transactionId?: string;
}

export interface FeeHeadDetail {
  type: string;
  amount: number;
  discount: number;
  penalty: number;
  dueDate?: string;
  penaltyRate?: number;
}

export interface FeePayment {
  id: string;
  studentId: string;
  receiptNo: string;
  date: string;
  feeType: string;
  heads?: FeeHeadDetail[];
  amount: number;
  discount: number;
  penalty: number;
  paidAmount: number;
  balance: number;
  paymentMode: string;
  paymentModes?: PaymentModeDetail[];
  transactionId?: string;
  collectionTime?: string;
  status: 'Paid' | 'Partial' | 'Pending';
  remarks?: string;
  dueDate?: string;
  penaltyRate?: number;
}

export interface FranchiseFee {
  id: string;
  franchiseId: string;
  franchiseName: string;
  registrationFees: number;
  marksheetFees: number;
  description?: string;
}

export interface Student {
  id: string;
  enrollmentNo: string;
  admissionNo: string; // Add this for Roll No/Admission No
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  contact: string;
  guardianContact: string;
  email: string;
  casteCategory: string;
  religion: string;
  maritalStatus: string;
  identityType: string;
  idNumber: string;
  apparId: string;
  photoUrl?: string;
  
  // Center & Course Details
  franchiseId: string;
  studyCenter: string;
  session: string;
  courseCategory: string;
  course: string;
  courseDuration: string;
  admissionDate: string;
  
  // Qualification
  highestQualification: string;
  qualificationDetail: string;
  passingYear: string;
  
  // Address
  address: string;
  state: string;
  district: string;
  pincode: string;
  
  // Extra
  remark: string;
  enquirySource: string;
  verificationCode: string;
  
  // Existing system fields
  feeStatus: 'PAID' | 'PARTIAL' | 'PENDING';
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  kycDocs: DocumentRecord[];
  documents?: {
    id: string;
    type: string;
    url: string;
    name: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    uploadedAt: string;
  }[];
  totalFees: number;
  paidAmount: number;
  certificateStatus?: 'NOT_APPLIED' | 'APPLIED' | 'ISSUED';
}

export interface DocumentRecord {
  id: string;
  type: string;
  name: string;
  url: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: string;
}

export interface WalletTransaction {
  id: string;
  franchiseId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  purpose: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  voucherId?: string;
}

export interface Voucher {
  id: string;
  voucherNo: string;
  date: string;
  amount: number;
  franchiseId: string;
  centerName: string;
  directorName: string;
  remarks: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

export interface Certificate {
  id: string;
  certificateNo: string;
  studentId: string;
  studentName: string;
  course: string;
  issueDate: string;
  expiryDate?: string;
  status: 'ISSUED' | 'REVOKED';
  franchiseId: string;
  qrCodeData: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  type: 'COURSE_FEE' | 'EXAM_FEE' | 'CERTIFICATE_FEE';
  paymentMethod: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  longDescription?: string;
  features?: string[];
  level: string;
  rating: number;
  imageUrl?: string;
  bannerUrl?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  bannerUrl?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  includedCourseIds: string[];
  imageUrl?: string;
  bannerUrl?: string;
  duration: string;
  level: string;
}

export interface GlobalCourseSettings {
  autoGenerateCode: boolean;
  prerequisiteCheck: boolean;
  passPercentage: number;
  minAttendance: number;
}

export interface FeeStructure {
  id: string;
  head: string;
  courseId: string;
  courseName: string;
  frequency: string;
  amount: number;
  discount: number;
  latePenalty: number;
  session: string;
  type: string; // e.g., Academic, Service, Material
  status: 'ACTIVE' | 'INACTIVE';
}

export interface AdmissionEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  status: 'PENDING' | 'FOLLOWED_UP' | 'ENROLLED' | 'CLOSED';
  createdAt: string;
}

export interface BusinessTransaction {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  paymentMode: string;
  referenceId?: string; // e.g., Student ID or Franchise ID
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE';
  avatar?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: UserRole[] | 'ALL';
  date: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PUBLISHED' | 'DRAFT';
}

export interface AcademicSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  isDefault: boolean;
}

export interface Subject {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  creditHours: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  roles: UserRole[];
}
