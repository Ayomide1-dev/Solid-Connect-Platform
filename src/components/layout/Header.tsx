import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ASSETS } from '../../lib/constants';
import type { UserRole } from '../../types';
import {
  Sun,
  Moon,
  RotateCcw,
  UserCheck,
  ChevronDown,
  LogOut,
  Bell,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNotifications,
  unreadCount = 0,
}) => {
  const { currentUser, currentSchool, switchRole, logout, resetDemoData } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleRoleSelect = async (role: UserRole) => {
    setRoleDropdownOpen(false);
    await switchRole(role);
  };

  const handleReset = async () => {
    if (confirm('Reset all demo school data to initial Nigerian primary & secondary school defaults?')) {
      setIsResetting(true);
      try {
        await resetDemoData();
      } finally {
        setIsResetting(false);
      }
    }
  };

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'admin', label: 'Administrator', desc: 'School Principal & Admin Office' },
    { role: 'teacher', label: 'Teacher', desc: 'Subject Teacher & Form Master' },
    { role: 'student', label: 'Student', desc: 'Academic portal & homework' },
    { role: 'parent', label: 'Parent / Guardian', desc: 'Children results & fees' },
    { role: 'bursar', label: 'Bursar', desc: 'Tuition fees & accounting' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={ASSETS.logo}
            alt="Sch Connect Logo"
            className="w-9 h-9 rounded-lg object-contain bg-blue-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs"
            referrerPolicy="no-referrer"
          />
          <button
            onClick={() => onSelectTab('overview')}
            className="text-left group cursor-pointer focus-visible:outline-hidden"
          >
            <div className="text-lg font-bold tracking-tight text-blue-900 dark:text-blue-100 whitespace-nowrap">
              Sch Connect
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block whitespace-nowrap">
              {currentSchool?.name || 'School Management Portal'}
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('overview')}
            className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
              currentTab === 'overview' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>

          {currentUser?.role === 'admin' && (
            <>
              <button
                onClick={() => onSelectTab('students')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'students' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Students
              </button>
              <button
                onClick={() => onSelectTab('teachers')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'teachers' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Teachers
              </button>
              <button
                onClick={() => onSelectTab('results')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'results' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Report Cards
              </button>
              <button
                onClick={() => onSelectTab('fees')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'fees' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                School Fees
              </button>
            </>
          )}

          {currentUser?.role === 'teacher' && (
            <>
              <button
                onClick={() => onSelectTab('attendance')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'attendance' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Attendance
              </button>
              <button
                onClick={() => onSelectTab('scores')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'scores' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Grade Scores
              </button>
              <button
                onClick={() => onSelectTab('assignments')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'assignments' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Assignments
              </button>
            </>
          )}

          {currentUser?.role === 'student' && (
            <>
              <button
                onClick={() => onSelectTab('my-timetable')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'my-timetable' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Timetable
              </button>
              <button
                onClick={() => onSelectTab('my-assignments')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'my-assignments' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Homework
              </button>
              <button
                onClick={() => onSelectTab('my-results')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'my-results' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Report Card
              </button>
            </>
          )}

          {currentUser?.role === 'parent' && (
            <>
              <button
                onClick={() => onSelectTab('children')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'children' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Ward Profile
              </button>
              <button
                onClick={() => onSelectTab('parent-results')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'parent-results' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Term Results
              </button>
              <button
                onClick={() => onSelectTab('parent-fees')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'parent-fees' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Pay Fees
              </button>
            </>
          )}

          {currentUser?.role === 'bursar' && (
            <>
              <button
                onClick={() => onSelectTab('invoices')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'invoices' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Invoices
              </button>
              <button
                onClick={() => onSelectTab('receipts')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'receipts' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Receipts
              </button>
              <button
                onClick={() => onSelectTab('fee-audit')}
                className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  currentTab === 'fee-audit' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
                }`}
              >
                Reconciliation
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1 primary action area / Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications Button */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
              title="Notifications & Announcements"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Reset to default Nigerian demo records"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo</span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-900 dark:text-blue-100 rounded-lg border border-blue-200 dark:border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="capitalize hidden sm:inline">{currentUser?.role || 'Switch Role'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {currentUser?.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser?.email}
                  </p>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    Switch Active Role
                  </div>
                  {roles.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => handleRoleSelect(item.role)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${
                        currentUser?.role === item.role
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div>{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                      </div>
                      {currentUser?.role === item.role && (
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
