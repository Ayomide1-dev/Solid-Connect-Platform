import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import type { ClassArm, Student, AttendanceSheet, AttendanceRecord } from '../../types';
import {
  CalendarCheck,
  Check,
  X,
  Clock,
  Save,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState<ClassArm[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [currentSheet, setCurrentSheet] = useState<AttendanceSheet | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Load classes & initial data
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [clsList, stdList] = await Promise.all([api.getClasses(), api.getStudents()]);
        setClasses(clsList);
        setStudents(stdList);
        if (clsList.length > 0) {
          setSelectedClassId(clsList[0].id);
        }
      } catch (err) {
        console.error('Failed to load classes for attendance:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Fetch or build attendance sheet whenever classId or date changes
  useEffect(() => {
    if (!selectedClassId || !selectedDate) return;

    async function loadSheet() {
      setIsLoading(true);
      setSaveMessage('');
      try {
        const sheets = await api.getAttendance({ classId: selectedClassId, date: selectedDate });
        const classStudents = students.filter((s) => s.classId === selectedClassId);

        if (sheets.length > 0) {
          const existing = sheets[0];
          setCurrentSheet(existing);

          // Merge any newly registered student into records
          const existingMap = new Map(existing.records.map((r) => [r.studentId, r]));
          const mergedRecords: AttendanceRecord[] = classStudents.map((s) => {
            const found = existingMap.get(s.id);
            return (
              found || {
                studentId: s.id,
                studentName: `${s.firstName} ${s.lastName}`,
                admissionNo: s.admissionNo,
                status: 'present',
              }
            );
          });
          setRecords(mergedRecords);
        } else {
          setCurrentSheet(null);
          // Default all to 'present'
          const defaultRecords: AttendanceRecord[] = classStudents.map((s) => ({
            studentId: s.id,
            studentName: `${s.firstName} ${s.lastName}`,
            admissionNo: s.admissionNo,
            status: 'present',
          }));
          setRecords(defaultRecords);
        }
      } catch (err) {
        console.error('Failed to load attendance:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSheet();
  }, [selectedClassId, selectedDate, students]);

  const updateStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  };

  const updateReason = (studentId: string, reason: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, reason } : r))
    );
  };

  const markAll = (status: 'present' | 'absent' | 'late') => {
    setRecords((prev) => prev.map((r) => ({ ...r, status })));
  };

  const handleSave = async () => {
    const selectedCls = classes.find((c) => c.id === selectedClassId);
    if (!selectedCls) return;

    setIsSaving(true);
    setSaveMessage('');
    try {
      const payload: Partial<AttendanceSheet> = {
        classId: selectedCls.id,
        className: selectedCls.name,
        arm: selectedCls.arm,
        date: selectedDate,
        records,
        markedByStaffId: currentUser?.id || 'staff_01',
        markedByStaffName: currentUser?.name || 'Academic Staff',
      };

      const result = await api.saveAttendance(payload);
      setCurrentSheet(result);
      setSaveMessage('Attendance register successfully saved and locked.');
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to record attendance');
    } finally {
      setIsSaving(false);
    }
  };

  const stats = {
    total: records.length,
    present: records.filter((r) => r.status === 'present').length,
    late: records.filter((r) => r.status === 'late').length,
    absent: records.filter((r) => r.status === 'absent').length,
  };
  const attendanceRate =
    stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Digital Classroom Attendance Register</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Record daily student attendance, track punctuality, and submit audited registers.
          </p>
        </div>

        {saveMessage && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveMessage}</span>
          </div>
        )}
      </div>

      {/* Filter and Selection Card */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Select Class:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.arm} ({c.level})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Register Date:
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => markAll('present')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => markAll('absent')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
          >
            Mark All Absent
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Submitting...' : 'Submit Register'}</span>
          </button>
        </div>
      </div>

      {/* Attendance Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] text-slate-500">Attendance Rate</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {attendanceRate}%
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Present</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {stats.present} / {stats.total}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Late</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {stats.late}
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Absent</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {stats.absent}
          </div>
        </div>
      </div>

      {/* Register Info Strip */}
      {currentSheet && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              Submitted by <strong>{currentSheet.markedByStaffName}</strong> on{' '}
              {new Date(currentSheet.markedAt).toLocaleTimeString()}
            </span>
          </div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400">Audited Record</span>
        </div>
      )}

      {/* Students Attendance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="p-3.5 w-12 text-center">#</th>
              <th className="p-3.5">Admission No</th>
              <th className="p-3.5">Student Name</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Notes / Late Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Loading attendance records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No students enrolled in this class.
                </td>
              </tr>
            ) : (
              records.map((r, idx) => (
                <tr
                  key={r.studentId}
                  className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                    r.status === 'absent' ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''
                  }`}
                >
                  <td className="p-3.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                  <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-medium">
                    {r.admissionNo}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                    {r.studentName}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateStatus(r.studentId, 'present')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                          r.status === 'present'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(r.studentId, 'late')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                          r.status === 'late'
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(r.studentId, 'absent')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                          r.status === 'absent'
                            ? 'bg-rose-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <input
                      type="text"
                      value={r.reason || ''}
                      onChange={(e) => updateReason(r.studentId, e.target.value)}
                      placeholder={
                        r.status === 'absent'
                          ? 'Reason for absence (e.g. sick leave, travel)'
                          : r.status === 'late'
                          ? 'Reason for late arrival (e.g. traffic, bus delay)'
                          : 'Optional note...'
                      }
                      className="w-full px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
