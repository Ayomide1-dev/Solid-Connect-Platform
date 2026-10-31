import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  CalendarCheck,
  FileText,
  Clock,
  CreditCard,
  Bell,
  Settings,
  ShieldCheck,
  Send,
  Building2,
  Calendar,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser, currentSchool } = useAuth();
  const role = currentUser?.role || 'admin';

  interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    section?: string;
  }

  const getMenuItems = (): MenuItem[] => {
    switch (role) {
      case 'admin':
        return [
          { id: 'overview', label: 'Admin Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'Student Records', icon: GraduationCap, section: 'Academics & Enrolment' },
          { id: 'teachers', label: 'Teacher Records', icon: Users },
          { id: 'parents', label: 'Parents & Guardians', icon: UserCheck },
          { id: 'classes', label: 'Classes & Subjects', icon: BookOpen },
          { id: 'attendance', label: 'Digital Attendance', icon: CalendarCheck, section: 'Operations & Records' },
          { id: 'results', label: 'Results & Reports', icon: FileText },
          { id: 'timetables', label: 'Timetables & Slots', icon: Clock },
          { id: 'fees', label: 'Fees & Invoices', icon: CreditCard },
          { id: 'announcements', label: 'Announcements', icon: Bell, section: 'Communications' },
          { id: 'events', label: 'School Calendar', icon: Calendar },
          { id: 'messages', label: 'Parent Enquiries', icon: Send },
          { id: 'settings', label: 'School Settings', icon: Settings, section: 'Administration' },
          { id: 'audit', label: 'Audit Trail', icon: ShieldCheck },
        ];
      case 'teacher':
        return [
          { id: 'overview', label: 'Teacher Dashboard', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance Register', icon: CalendarCheck, section: 'Classroom' },
          { id: 'scores', label: 'Score Entry (CA & Exam)', icon: FileText },
          { id: 'assignments', label: 'Assignments', icon: BookOpen },
          { id: 'timetables', label: 'My Timetable', icon: Clock },
          { id: 'announcements', label: 'School Notices', icon: Bell, section: 'Information' },
          { id: 'events', label: 'School Events', icon: Calendar },
        ];
      case 'student':
        return [
          { id: 'overview', label: 'Student Dashboard', icon: LayoutDashboard },
          { id: 'my-timetable', label: 'My Timetable', icon: Clock, section: 'Academics' },
          { id: 'my-assignments', label: 'Assignments', icon: BookOpen },
          { id: 'my-results', label: 'Termly Report Card', icon: FileText },
          { id: 'my-attendance', label: 'Attendance History', icon: CalendarCheck },
          { id: 'announcements', label: 'Announcements', icon: Bell, section: 'Campus' },
          { id: 'events', label: 'Upcoming Events', icon: Calendar },
        ];
      case 'parent':
        return [
          { id: 'overview', label: 'Parent Portal', icon: LayoutDashboard },
          { id: 'children', label: 'Child Profile', icon: GraduationCap, section: 'Ward Information' },
          { id: 'parent-attendance', label: 'Attendance Track', icon: CalendarCheck },
          { id: 'parent-results', label: 'Report Cards', icon: FileText },
          { id: 'parent-fees', label: 'School Fees & Payment', icon: CreditCard, section: 'Financial' },
          { id: 'parent-messages', label: 'Enquiry to School', icon: Send },
          { id: 'announcements', label: 'School Notices', icon: Bell },
        ];
      case 'bursar':
        return [
          { id: 'overview', label: 'Bursary Dashboard', icon: LayoutDashboard },
          { id: 'invoices', label: 'Student Invoices', icon: FileText, section: 'Fee Management' },
          { id: 'receipts', label: 'Payment Receipts', icon: CreditCard },
          { id: 'payment-entry', label: 'Record Bank Transfer', icon: Building2 },
          { id: 'fee-audit', label: 'Reconciliation Report', icon: ShieldCheck },
          { id: 'announcements', label: 'Notices', icon: Bell },
        ];
      default:
        return [{ id: 'overview', label: 'Dashboard', icon: LayoutDashboard }];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      {/* School Context Card */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
          <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="truncate">{currentSchool?.name}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="font-medium text-blue-700 dark:text-blue-300">{currentSchool?.currentSession}</span>
          <span aria-hidden="true">·</span>
          <span>{currentSchool?.currentTerm}</span>
        </div>
      </div>

      {/* Navigation links */}
      <div className="p-3 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <React.Fragment key={item.id}>
              {item.section && (
                <div
                  className={`text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 ${
                    index === 0 ? 'pt-1 pb-1.5' : 'pt-4 pb-1.5'
                  }`}
                >
                  {item.section}
                </div>
              )}
              <button
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                <span className="truncate">{item.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* User Footer Profile */}
      <div className="mt-auto p-3 border-t border-slate-100 dark:border-slate-800">
        <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
            {currentUser?.name}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
            Role: {currentUser?.role}
          </p>
        </div>
      </div>
    </aside>
  );
};
