import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { AuthModal } from './components/auth/AuthModal';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentManagement } from './components/admin/StudentManagement';
import { StaffManagement } from './components/admin/StaffManagement';
import { ClassSubjectManagement } from './components/admin/ClassSubjectManagement';
import { SchoolSettings } from './components/admin/SchoolSettings';

import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { BursarDashboard } from './components/bursar/BursarDashboard';

import { AttendanceModule } from './components/attendance/AttendanceModule';
import { ResultsModule } from './components/results/ResultsModule';
import { TimetableModule } from './components/timetable/TimetableModule';
import { AnnouncementsModule } from './components/announcements/AnnouncementsModule';

function MainApp() {
  const { currentUser, currentSchool, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [unreadNoticeCount, setUnreadNoticeCount] = useState(2);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Loading Sch Connect Portal...
          </p>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    const role = currentUser?.role || 'admin';

    // Route matching
    if (currentTab === 'overview') {
      if (role === 'admin') return <AdminDashboard onNavigate={setCurrentTab} school={currentSchool} />;
      if (role === 'teacher') return <TeacherDashboard onNavigate={setCurrentTab} />;
      if (role === 'student') return <StudentDashboard />;
      if (role === 'parent') return <ParentDashboard />;
      if (role === 'bursar') return <BursarDashboard />;
    }

    if (currentTab === 'students' || currentTab === 'parents') {
      return <StudentManagement />;
    }

    if (currentTab === 'teachers') {
      return <StaffManagement />;
    }

    if (currentTab === 'classes') {
      return <ClassSubjectManagement />;
    }

    if (currentTab === 'attendance' || currentTab === 'my-attendance' || currentTab === 'parent-attendance') {
      return <AttendanceModule />;
    }

    if (currentTab === 'results' || currentTab === 'scores' || currentTab === 'my-results') {
      return <ResultsModule />;
    }

    if (currentTab === 'fees' || currentTab === 'invoices' || currentTab === 'receipts' || currentTab === 'fee-audit' || currentTab === 'payment-entry') {
      return <BursarDashboard />;
    }

    if (currentTab === 'timetables' || currentTab === 'my-timetable') {
      return <TimetableModule />;
    }

    if (currentTab === 'my-assignments' || currentTab === 'assignments') {
      if (role === 'teacher') return <TeacherDashboard onNavigate={setCurrentTab} />;
      return <StudentDashboard />;
    }

    if (currentTab === 'children' || currentTab === 'parent-results' || currentTab === 'parent-fees' || currentTab === 'parent-messages') {
      return <ParentDashboard />;
    }

    if (currentTab === 'announcements' || currentTab === 'events' || currentTab === 'messages') {
      return <AnnouncementsModule />;
    }

    if (currentTab === 'settings' || currentTab === 'audit') {
      return <SchoolSettings />;
    }

    // Default fallback
    return <AdminDashboard onNavigate={setCurrentTab} school={currentSchool} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNotifications={() => {
          setCurrentTab('announcements');
          setUnreadNoticeCount(0);
        }}
        unreadCount={unreadNoticeCount}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 md:pb-8">
        {/* Sidebar for Desktop / Tablet */}
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
