import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  BookOpen,
  FileText,
  Clock,
  Send,
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'admin';

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'admin':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Students', icon: GraduationCap },
          { id: 'teachers', label: 'Teachers', icon: Users },
          { id: 'results', label: 'Results', icon: FileText },
          { id: 'fees', label: 'Fees', icon: CreditCard },
        ];
      case 'teacher':
        return [
          { id: 'overview', label: 'Home', icon: LayoutDashboard },
          { id: 'attendance', label: 'Register', icon: CalendarCheck },
          { id: 'scores', label: 'Scores', icon: FileText },
          { id: 'assignments', label: 'Tasks', icon: BookOpen },
        ];
      case 'student':
        return [
          { id: 'overview', label: 'Home', icon: LayoutDashboard },
          { id: 'my-timetable', label: 'Classes', icon: Clock },
          { id: 'my-assignments', label: 'Homework', icon: BookOpen },
          { id: 'my-results', label: 'Report', icon: FileText },
        ];
      case 'parent':
        return [
          { id: 'overview', label: 'Home', icon: LayoutDashboard },
          { id: 'children', label: 'Child', icon: GraduationCap },
          { id: 'parent-results', label: 'Results', icon: FileText },
          { id: 'parent-fees', label: 'Pay Fees', icon: CreditCard },
          { id: 'parent-messages', label: 'Message', icon: Send },
        ];
      case 'bursar':
        return [
          { id: 'overview', label: 'Home', icon: LayoutDashboard },
          { id: 'invoices', label: 'Invoices', icon: FileText },
          { id: 'receipts', label: 'Receipts', icon: CreditCard },
          { id: 'fee-audit', label: 'Audit', icon: LayoutDashboard },
        ];
      default:
        return [{ id: 'overview', label: 'Home', icon: LayoutDashboard }];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="grid grid-flow-col auto-cols-fr h-16 items-center max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] py-1 cursor-pointer transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
