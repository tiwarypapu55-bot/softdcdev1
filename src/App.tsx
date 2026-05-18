/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { GraduationCap } from 'lucide-react';
import { LandingPage } from './pages/Landing';
import CourseDetail from './pages/website/CourseDetail';
import { WebsiteHome } from './pages/website/Home';
import { AboutUs } from './pages/website/AboutUs';
import { Courses } from './pages/website/Courses';
import { FranchiseInfo } from './pages/website/FranchiseInfo';
import { ContactUs } from './pages/website/ContactUs';
import { StudentZone } from './pages/website/StudentZone';
import { Gallery } from './pages/website/Gallery';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminFranchiseManagement } from './pages/admin/FranchiseManagement';
import { ExamMaster } from './pages/admin/ExamMaster';
import { CourseManagement } from './pages/admin/CourseManagement';
import { BusinessProfile } from './pages/admin/BusinessProfile';
import { AcademicMaster } from './pages/admin/AcademicMaster';
import { AdmissionEnquiries } from './pages/admin/AdmissionEnquiries';
import { FeeMaster } from './pages/admin/FeeMaster';
import { StudentRegistration } from './pages/admin/StudentRegistration';
import { FeeCollection } from './pages/admin/FeeCollection';
import { FranchiseFeeMaster } from './pages/admin/FranchiseFeeMaster';
import { Accounts } from './pages/admin/Accounts';
import { StudentDirectory } from './pages/admin/StudentDirectory';
import { StudentDetail } from './pages/admin/StudentDetail';
import { StudentLedger } from './pages/admin/StudentLedger';
import { Announcements } from './pages/admin/Announcements';
import { DocumentVerification, CertificateStudio, CertificateTemplates, CreateCertificateTemplate } from './pages/admin/SupportModules';
import { EmployeeManagement } from './pages/franchise/EmployeeManagement';
import { Wallet } from './pages/franchise/Wallet';
import { FranchiseDashboard } from './pages/franchise/FranchiseDashboard';
import { FeeCollection as FranchiseFeeCollection } from './pages/franchise/FeeCollection';
import { Attendance } from './pages/franchise/Attendance';
import { EContent } from './pages/franchise/EContent';
import { TimeTable } from './pages/franchise/TimeTable';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { Classes as TeacherClasses } from './pages/teacher/Classes';
import { Students as TeacherStudents } from './pages/teacher/Students';
import { TeacherAttendance } from './pages/teacher/TeacherAttendance';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { Profile as StudentProfile } from './pages/student/Profile';
import { StudentCertificates } from './pages/student/StudentCertificates';
import { StudentDocuments } from './pages/student/StudentDocuments';
import { StudentAccounts } from './pages/student/StudentAccounts';
import { Verification } from './pages/Verification';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { currentUser, isLoading } = useApp();
  const location = useLocation();

  if (isLoading) return <div className="h-screen flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#888888]">Initializing Workspace...</div>;

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

export default function App() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable common shortcuts for DevTools and copying
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+Shift+K, Ctrl+U, Ctrl+S
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'K')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
        (e.metaKey && e.altKey && e.key === 'i') // Mac CMD+ALT+I
      ) {
        e.preventDefault();
        return false;
      }
      
      // Also disable Ctrl+A, Ctrl+X, Ctrl+C, Ctrl+V for general users to prevent easy cloning
      // But only if not in an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      if (!isInput && e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'v' || e.key === 'V' || e.key === 'a' || e.key === 'A' || e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        return false;
      }
    };

    // Disable copy/cut
    const handleCopyCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopyCut);
    document.addEventListener('cut', handleCopyCut);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopyCut);
      document.removeEventListener('cut', handleCopyCut);
    };
  }, []);

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WebsiteHome />} />
          <Route path="/login" element={<LandingPage />} />
          <Route path="/verify/:id?" element={
            <ProtectedRoute>
              <Verification />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/franchise-info" element={<FranchiseInfo />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/student-zone" element={<StudentZone />} />
          
          {/* Admin & Administrator Routes */}
          {['admin', 'administrator'].map(pathPrefix => (
            <React.Fragment key={pathPrefix}>
              <Route path={`/${pathPrefix}`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/collection`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <FeeCollection />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/enquiries`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <AdmissionEnquiries />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/franchises`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <AdminFranchiseManagement />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/exams`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <ExamMaster />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/courses`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <CourseManagement />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/academic`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <AcademicMaster />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/franchise-fees`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <FranchiseFeeMaster />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/fees`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <FeeMaster />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/students`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <StudentDirectory />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/students/:id`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <StudentDetail />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/ledger`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <StudentLedger />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/accounts`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <Accounts />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/registration/:id?`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <StudentRegistration />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/announcements`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <Announcements />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/business`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <BusinessProfile />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/documents`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <DocumentVerification />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/certificates`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <CertificateStudio />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/certificates/templates`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <CertificateTemplates />
                </ProtectedRoute>
              } />
              <Route path={`/${pathPrefix}/certificates/create`} element={
                <ProtectedRoute roles={['ADMIN', 'ADMINISTRATOR']}>
                  <CreateCertificateTemplate />
                </ProtectedRoute>
              } />
            </React.Fragment>
          ))}

          {/* Franchise Routes */}
          <Route path="/franchise" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <FranchiseDashboard />
            </ProtectedRoute>
          } />
          <Route path="/franchise/employees" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <EmployeeManagement />
            </ProtectedRoute>
          } />
          <Route path="/franchise/exams" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <ExamMaster />
            </ProtectedRoute>
          } />
          <Route path="/franchise/academic" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <AcademicMaster />
            </ProtectedRoute>
          } />
          <Route path="/franchise/franchise-fees" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <FranchiseFeeMaster />
            </ProtectedRoute>
          } />
          <Route path="/franchise/fees" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <FeeMaster />
            </ProtectedRoute>
          } />
          <Route path="/franchise/registration/:id?" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <StudentRegistration />
            </ProtectedRoute>
          } />
          <Route path="/franchise/collection" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <FranchiseFeeCollection />
            </ProtectedRoute>
          } />
          <Route path="/franchise/students" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <StudentDirectory />
            </ProtectedRoute>
          } />
          <Route path="/franchise/students/:id" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <StudentDetail />
            </ProtectedRoute>
          } />
          <Route path="/franchise/ledger" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <StudentLedger />
            </ProtectedRoute>
          } />
          <Route path="/franchise/wallet" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <Wallet />
            </ProtectedRoute>
          } />
          <Route path="/franchise/account" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <Accounts />
            </ProtectedRoute>
          } />
          <Route path="/franchise/accounts" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <Accounts />
            </ProtectedRoute>
          } />
          <Route path="/franchise/announcements" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <Announcements />
            </ProtectedRoute>
          } />
          <Route path="/franchise/notifications" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <Announcements />
            </ProtectedRoute>
          } />
          <Route path="/franchise/attendance" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <Attendance />
            </ProtectedRoute>
          } />
          <Route path="/franchise/e-content" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <EContent />
            </ProtectedRoute>
          } />
          <Route path="/franchise/timetable" element={
            <ProtectedRoute roles={['FRANCHISE']}>
              <TimeTable />
            </ProtectedRoute>
          } />

          {/* Teacher Routes */}
          <Route path="/teacher" element={
            <ProtectedRoute roles={['TEACHER']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/teacher/classes" element={
            <ProtectedRoute roles={['TEACHER']}>
              <TeacherClasses />
            </ProtectedRoute>
          } />
          <Route path="/teacher/students" element={
            <ProtectedRoute roles={['TEACHER']}>
              <TeacherStudents />
            </ProtectedRoute>
          } />
          <Route path="/teacher/attendance" element={
            <ProtectedRoute roles={['TEACHER']}>
              <TeacherAttendance />
            </ProtectedRoute>
          } />
          <Route path="/teacher/exams" element={
            <ProtectedRoute roles={['TEACHER']}>
              <ExamMaster />
            </ProtectedRoute>
          } />
          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute roles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute roles={['STUDENT']}>
              <StudentProfile />
            </ProtectedRoute>
          } />
          <Route path="/student/certificates" element={
            <ProtectedRoute roles={['STUDENT']}>
              <StudentCertificates />
            </ProtectedRoute>
          } />
          <Route path="/student/documents" element={
            <ProtectedRoute roles={['STUDENT']}>
              <StudentDocuments />
            </ProtectedRoute>
          } />
          <Route path="/student/accounts" element={
            <ProtectedRoute roles={['STUDENT']}>
              <StudentAccounts />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
