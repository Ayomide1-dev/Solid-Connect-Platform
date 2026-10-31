import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { formatNaira, ASSETS } from '../../lib/constants';
import type { DashboardSummary, School } from '../../types';
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Plus,
  ArrowUpRight,
  Clock,
  Bell,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
  school: School | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, school }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to load summary:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner with Campus Photography */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-sm">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img
            src={ASSETS.campusExterior}
            alt="School Campus"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative p-6 sm:p-8 z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
              <span>{school?.currentSession || '2024/2025'}</span>
              <span aria-hidden="true">·</span>
              <span>{school?.currentTerm || '1st Term'}</span>
              <span aria-hidden="true">·</span>
              <span>Administrative Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {school?.name || 'Crown Heights International School'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              “{school?.motto || 'Knowledge, Character and Excellence'}” — Streamlining primary and secondary education operations across Nigeria.
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('students')}
              className="px-3.5 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="px-3.5 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => onNavigate('results')}
              className="px-3.5 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Publish Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Registered Students</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {summary?.totalStudents || 0}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Active enrollees</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Verified</span>
          </div>
        </div>

        {/* Total Teachers */}
        <div
          onClick={() => onNavigate('teachers')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Teaching Staff</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {summary?.totalTeachers || 0}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Subject specialists</span>
            <span aria-hidden="true">·</span>
            <span>Allocated</span>
          </div>
        </div>

        {/* Attendance Summary */}
        <div
          onClick={() => onNavigate('attendance')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Today's Attendance</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {summary?.todayAttendance.percentage || 96}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {summary?.todayAttendance.present} present
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-600 dark:text-amber-400">
              {summary?.todayAttendance.late} late
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-600 dark:text-rose-400">
              {summary?.todayAttendance.absent} absent
            </span>
          </div>
        </div>

        {/* Fees Invoiced & Collected */}
        <div
          onClick={() => onNavigate('fees')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Fees Collected</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {formatNaira(summary?.totalCollectedFees || 0)}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Pending: </span>
            <span className="text-amber-600 dark:text-amber-400 font-medium tabular-nums">
              {formatNaira(summary?.totalPendingFees || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Announcements & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                School Announcements
              </h2>
            </div>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {summary?.recentAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {ann.title}
                  </h3>
                  {ann.priority === 'urgent' && (
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider shrink-0">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                  <span>{ann.authorName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">Target: {ann.targetRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming School Events */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Upcoming Academic Calendar Events
              </h2>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Full Calendar
            </button>
          </div>

          <div className="space-y-3">
            {summary?.upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3"
              >
                <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-center shrink-0 w-12">
                  <div className="text-[10px] font-semibold uppercase">
                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-base font-bold tabular-nums">
                    {new Date(evt.date).getDate()}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {evt.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                    <span>{evt.time}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{evt.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit & Security Log Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Recent System Security & Audit Log
          </h2>
          <button
            onClick={() => onNavigate('audit')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Audit Trail ({summary?.recentActivities.length})
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {summary?.recentActivities.slice(0, 4).map((item) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0"></span>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.action}</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-2">{item.details}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums shrink-0">
                {new Date(item.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
