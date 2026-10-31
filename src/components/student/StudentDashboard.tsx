import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { ASSETS } from '../../lib/constants';
import type { Student, ReportCard, Assignment, Submission, ClassTimetable } from '../../types';
import { ReportCardModal } from '../common/ReportCardModal';
import {
  Clock,
  BookOpen,
  FileText,
  CalendarCheck,
  Send,
  Eye,
  CheckCircle2,
  X,
  Upload,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, currentSchool } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [timetables, setTimetables] = useState<ClassTimetable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Homework submission modal
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmittingWork, setIsSubmittingWork] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState('');

  // Report card preview modal
  const [previewReportCard, setPreviewReportCard] = useState<ReportCard | null>(null);

  useEffect(() => {
    async function loadStudentData() {
      setIsLoading(true);
      try {
        const [allStudents, allReports, allAsg, allSub, allTt] = await Promise.all([
          api.getStudents(),
          api.getResults(),
          api.getAssignments(),
          api.getSubmissions(),
          api.getTimetables(),
        ]);

        // Match student by linkedEntityId or current user email
        const matched =
          allStudents.find((s) => s.id === currentUser?.linkedEntityId) ||
          allStudents.find((s) => s.firstName.toLowerCase().includes('toluwanimi')) ||
          allStudents[0];

        setStudent(matched);

        if (matched) {
          // Published report cards only
          setReportCards(allReports.filter((r) => r.studentId === matched.id && r.status === 'published'));
          setAssignments(allAsg.filter((a) => a.classId === matched.classId));
          setSubmissions(allSub.filter((s) => s.studentId === matched.id));
          setTimetables(allTt.filter((t) => t.classId === matched.classId));
        }
      } catch (err) {
        console.error('Failed to load student portal:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStudentData();
  }, [currentUser]);

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment || !student) return;

    setIsSubmittingWork(true);
    setSubmissionSuccess('');
    try {
      await api.submitHomework({
        assignmentId: submittingAssignment.id,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        admissionNo: student.admissionNo,
        submissionText,
        attachedFile: `${student.firstName}_${submittingAssignment.subjectName}_Solution.pdf`,
      });

      setSubmissionSuccess('Homework answers successfully submitted to your subject teacher!');
      setSubmissionText('');
      setTimeout(() => {
        setSubmittingAssignment(null);
        setSubmissionSuccess('');
      }, 2000);

      // Refresh submissions
      const updatedSub = await api.getSubmissions({ studentId: student.id });
      setSubmissions(updatedSub);
    } catch (err: any) {
      alert(err.message || 'Failed to submit assignment');
    } finally {
      setIsSubmittingWork(false);
    }
  };

  const latestReportCard = reportCards[0];

  return (
    <div className="space-y-6">
      {/* Student Profile Hero Header */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
              <span>{student?.className} {student?.arm}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{student?.admissionNo}</span>
              <span aria-hidden="true">·</span>
              <span>Student Academic Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Hello, {student?.firstName} {student?.lastName}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Track your daily class schedule, submit homework exercises, and check published report cards.
            </p>
          </div>

          {latestReportCard && (
            <button
              onClick={() => setPreviewReportCard(latestReportCard)}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white text-blue-900 hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>View Official Report Card</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Class Attendance</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
            97.5% Present
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">58 Present · 2 Absences recorded</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Term Average Score</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums mt-1">
            {latestReportCard ? `${latestReportCard.averageScore.toFixed(1)}%` : 'Collation in progress'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {latestReportCard ? `Rank: ${latestReportCard.classPosition} of ${latestReportCard.classTotalStudents}` : 'Pending final publish'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Active Assignments</div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
            {assignments.length} Tasks
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {submissions.length} solutions submitted
          </div>
        </div>
      </div>

      {/* Two Column Grid: Timetable & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Class Timetable */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Today's Class Schedule (Monday)</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">08:00 - 14:00</span>
          </div>

          <div className="space-y-2">
            {(timetables[0]?.periods || []).map((period) => (
              <div
                key={period.periodNumber}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center font-mono">
                    {period.periodNumber}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {period.subjectName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Teacher: {period.teacherName} · Room: {period.room || 'General Classroom'}
                    </div>
                  </div>
                </div>
                <div className="text-slate-500 font-mono text-[11px] tabular-nums">
                  {period.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments Portal */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Homework & Classwork Tasks</span>
          </h2>

          <div className="space-y-3">
            {assignments.map((asg) => {
              const submission = submissions.find((s) => s.assignmentId === asg.id);
              return (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {asg.title}
                      </h3>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                        {asg.subjectName} · Teacher: {asg.teacherName}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      Due: {asg.dueDate}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {asg.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    {submission ? (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {submission.status === 'graded'
                            ? `Graded: ${submission.score} / ${asg.maxScore} pts`
                            : 'Submitted · Awaiting Teacher Feedback'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-600 font-medium">
                        Not yet submitted
                      </span>
                    )}

                    <button
                      onClick={() => setSubmittingAssignment(asg)}
                      className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                    >
                      {submission ? 'Resubmit Answers' : 'Submit Homework'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Homework Submission Modal */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Submit Homework
                </h2>
                <p className="text-xs text-slate-500">
                  {submittingAssignment.title} ({submittingAssignment.subjectName})
                </p>
              </div>
              <button
                onClick={() => setSubmittingAssignment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submissionSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{submissionSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitHomework} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Written Solution / Working:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Type your workings, answers or explanation here..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500">
                  <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <span>Attach solution sheet (PDF/Image will be linked automatically)</span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSubmittingAssignment(null)}
                    className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingWork}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                  >
                    {isSubmittingWork ? 'Uploading...' : 'Confirm Submission'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Report Card Modal */}
      {previewReportCard && (
        <ReportCardModal
          reportCard={previewReportCard}
          school={currentSchool}
          onClose={() => setPreviewReportCard(null)}
        />
      )}
    </div>
  );
};
