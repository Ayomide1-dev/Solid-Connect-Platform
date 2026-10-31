import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ASSETS } from '../../lib/constants';
import type { Teacher, ClassArm, Assignment, Submission } from '../../types';
import {
  BookOpen,
  CalendarCheck,
  FileText,
  Clock,
  Plus,
  X,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState<ClassArm[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Assignment Modal
  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    subjectName: 'Mathematics',
    classId: '',
    description: '',
    dueDate: '2025-03-10',
    maxScore: 20,
  });

  // Grade Submission Modal
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState(18);
  const [gradeFeedback, setGradeFeedback] = useState('Well presented calculation.');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [clsList, asgList, subList] = await Promise.all([
        api.getClasses(),
        api.getAssignments(),
        api.getSubmissions(),
      ]);
      setClasses(clsList);
      setAssignments(asgList);
      setSubmissions(subList);

      if (clsList.length > 0 && !assignmentForm.classId) {
        setAssignmentForm((prev) => ({ ...prev, classId: clsList[0].id }));
      }
    } catch (err) {
      console.error('Failed to load teacher dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetCls = classes.find((c) => c.id === assignmentForm.classId);
    if (!targetCls) return;

    try {
      await api.createAssignment({
        title: assignmentForm.title,
        subjectName: assignmentForm.subjectName,
        classId: targetCls.id,
        className: targetCls.name,
        arm: targetCls.arm,
        teacherId: currentUser?.id || 'tch_1',
        teacherName: currentUser?.name || 'Subject Teacher',
        description: assignmentForm.description,
        dueDate: assignmentForm.dueDate,
        maxScore: Number(assignmentForm.maxScore),
      });

      setIsNewAssignmentOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to post assignment');
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    try {
      await api.gradeSubmission(gradingSubmission.id, {
        score: gradeScore,
        feedback: gradeFeedback,
        teacherName: currentUser?.name || 'Teacher',
        teacherId: currentUser?.id || 'tch_1',
      });
      setGradingSubmission(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Grading submission failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Teacher Welcome Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 hidden md:block">
          <img
            src={ASSETS.teacherClassroom}
            alt="Teacher Classroom"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider">
            Academic Faculty Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, {currentUser?.name || 'Teacher'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Record classroom attendance, enter Continuous Assessment (CA) scores, post homework tasks, and evaluate student submissions.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('attendance')}
              className="px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Take Attendance</span>
            </button>
            <button
              onClick={() => onNavigate('scores')}
              className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
            >
              <FileText className="w-4 h-4" />
              <span>Enter Test Scores</span>
            </button>
            <button
              onClick={() => setIsNewAssignmentOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Homework</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('attendance')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Daily Attendance Register</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
            Mark Present / Absent
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Form master classroom logs and punctuality tracking
          </p>
        </div>

        <div
          onClick={() => onNavigate('scores')}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Continuous Assessment (CA)</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
            Subject Score Entry
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            CA 1, CA 2, Exam test scores and automated grading
          </p>
        </div>

        <div
          onClick={() => setIsNewAssignmentOpen(true)}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Assignments & Tasks</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-slate-800 text-purple-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">
            {assignments.length} Active Tasks
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {submissions.filter((s) => s.status === 'submitted').length} pending grading
          </p>
        </div>
      </div>

      {/* Two Column Grid: Assignments List & Submissions Awaiting Grading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignments List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Published Assignments</span>
            </h2>
            <button
              onClick={() => setIsNewAssignmentOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              + New Task
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {asg.title}
                  </h3>
                  <span className="text-[11px] font-mono text-blue-600 font-bold">
                    Max: {asg.maxScore} pts
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {asg.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                  <span>{asg.className} {asg.arm}</span>
                  <span aria-hidden="true">·</span>
                  <span>{asg.subjectName}</span>
                  <span aria-hidden="true">·</span>
                  <span>Due: {asg.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Submissions to Review */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Student Homework Submissions</span>
          </h2>

          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    {sub.studentName}{' '}
                    <span className="font-mono text-slate-400 font-normal">({sub.admissionNo})</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {sub.submissionText}
                  </p>
                  {sub.status === 'graded' ? (
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      Graded: {sub.score} pts · “{sub.feedback}”
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-600 font-medium">Pending Grade Review</div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setGradingSubmission(sub);
                    setGradeScore(sub.score || 18);
                    setGradeFeedback(sub.feedback || 'Good attempt, well reasoned.');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shrink-0 cursor-pointer"
                >
                  {sub.status === 'graded' ? 'Update Grade' : 'Grade'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {isNewAssignmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create New Class Assignment
              </h2>
              <button
                onClick={() => setIsNewAssignmentOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  placeholder="e.g. Exercises on Linear Equations"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Class
                  </label>
                  <select
                    value={assignmentForm.classId}
                    onChange={(e) =>
                      setAssignmentForm({ ...assignmentForm, classId: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.arm}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={assignmentForm.subjectName}
                    onChange={(e) =>
                      setAssignmentForm({ ...assignmentForm, subjectName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Instructions & Question Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={assignmentForm.description}
                  onChange={(e) =>
                    setAssignmentForm({ ...assignmentForm, description: e.target.value })
                  }
                  placeholder="Detail the pages, question numbers or instructions for students..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Submission Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={assignmentForm.dueDate}
                    onChange={(e) =>
                      setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Maximum Score Points
                  </label>
                  <input
                    type="number"
                    value={assignmentForm.maxScore}
                    onChange={(e) =>
                      setAssignmentForm({ ...assignmentForm, maxScore: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewAssignmentOpen(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Post Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Grade Student Submission
                </h2>
                <p className="text-xs text-slate-500">
                  {gradingSubmission.studentName} ({gradingSubmission.admissionNo})
                </p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">
                Student Solution
              </div>
              <p className="text-slate-700 dark:text-slate-300">{gradingSubmission.submissionText}</p>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Awarded Score (Points):
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Teacher Feedback & Corrections:
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
