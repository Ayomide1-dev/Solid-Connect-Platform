import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { ClassArm, Subject, Teacher, ClassTimetable } from '../../types';
import { Clock, Plus, X, Calendar } from 'lucide-react';

export const TimetableModule: React.FC = () => {
  const [classes, setClasses] = useState<ClassArm[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [timetables, setTimetables] = useState<ClassTimetable[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [isLoading, setIsLoading] = useState(true);

  // New period modal
  const [isAddPeriodModalOpen, setIsAddPeriodModalOpen] = useState(false);
  const [periodForm, setPeriodForm] = useState({
    periodNumber: 1,
    time: '08:00 - 08:45',
    subjectName: 'Mathematics',
    teacherName: 'Mr. Chinedu Okafor',
    room: 'Room 204',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [clsList, subList, tchList, ttList] = await Promise.all([
        api.getClasses(),
        api.getSubjects(),
        api.getTeachers(),
        api.getTimetables(),
      ]);
      setClasses(clsList);
      setSubjects(subList);
      setTeachers(tchList);
      setTimetables(ttList);

      if (clsList.length > 0 && !selectedClassId) {
        setSelectedClassId(clsList[0].id);
      }
    } catch (err) {
      console.error('Failed to load timetables:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeTimetable = timetables.find(
    (t) => t.classId === selectedClassId && t.day === selectedDay
  );

  const handleAddPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetCls = classes.find((c) => c.id === selectedClassId);
    if (!targetCls) return;

    const existingPeriods = activeTimetable ? [...activeTimetable.periods] : [];

    // Append or replace period
    const existingIdx = existingPeriods.findIndex((p) => p.periodNumber === periodForm.periodNumber);
    if (existingIdx !== -1) {
      existingPeriods[existingIdx] = { ...periodForm };
    } else {
      existingPeriods.push({ ...periodForm });
      existingPeriods.sort((a, b) => a.periodNumber - b.periodNumber);
    }

    try {
      await api.saveTimetable({
        classId: targetCls.id,
        className: targetCls.name,
        arm: targetCls.arm,
        day: selectedDay,
        periods: existingPeriods,
      });

      setIsAddPeriodModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save timetable period');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Class Timetables & Lesson Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure weekly lesson periods, allocate subject masters, and prevent classroom schedule clashes.
          </p>
        </div>

        <button
          onClick={() => {
            setPeriodForm({
              periodNumber: (activeTimetable?.periods?.length || 0) + 1,
              time: '08:00 - 08:45',
              subjectName: subjects[0]?.name || 'Mathematics',
              teacherName: teachers[0]?.name || 'Teacher',
              room: 'Classroom',
            });
            setIsAddPeriodModalOpen(true);
          }}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lesson Period</span>
        </button>
      </div>

      {/* Class and Day Selection Strip */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-slate-500 font-semibold shrink-0">Select Class:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.arm}
              </option>
            ))}
          </select>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto w-full sm:w-auto">
          {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Periods Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="p-3.5 w-16 text-center font-mono">Period</th>
              <th className="p-3.5 w-36 font-mono">Time Slot</th>
              <th className="p-3.5">Curriculum Subject</th>
              <th className="p-3.5">Assigned Teacher</th>
              <th className="p-3.5">Venue / Classroom</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {(!activeTimetable || activeTimetable.periods.length === 0) ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No lesson schedule entered for {selectedDay}. Click "Add Lesson Period" above.
                </td>
              </tr>
            ) : (
              activeTimetable.periods.map((period) => (
                <tr key={period.periodNumber} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  <td className="p-3.5 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                    #{period.periodNumber}
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                    {period.time}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                    {period.subjectName}
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    {period.teacherName}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {period.room || 'Main Hall'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Period Modal */}
      {isAddPeriodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add Lesson Period ({selectedDay})
              </h2>
              <button
                onClick={() => setIsAddPeriodModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPeriod} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Period Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={periodForm.periodNumber}
                    onChange={(e) =>
                      setPeriodForm({ ...periodForm, periodNumber: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Time Interval
                  </label>
                  <input
                    type="text"
                    value={periodForm.time}
                    onChange={(e) => setPeriodForm({ ...periodForm, time: e.target.value })}
                    placeholder="08:00 - 08:45"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={periodForm.subjectName}
                  onChange={(e) =>
                    setPeriodForm({ ...periodForm, subjectName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Teacher
                </label>
                <select
                  value={periodForm.teacherName}
                  onChange={(e) =>
                    setPeriodForm({ ...periodForm, teacherName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Venue / Classroom
                </label>
                <input
                  type="text"
                  value={periodForm.room}
                  onChange={(e) => setPeriodForm({ ...periodForm, room: e.target.value })}
                  placeholder="e.g. Science Lab 1, Room 204"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPeriodModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Save Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
