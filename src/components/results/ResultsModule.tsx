import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { calculateGrade, TERMS, SESSIONS } from '../../lib/constants';
import type { ClassArm, Student, Subject, ReportCard, SubjectScore } from '../../types';
import { ReportCardModal } from '../common/ReportCardModal';
import {
  FileText,
  Save,
  CheckCircle2,
  Printer,
  Eye,
  Plus,
  Send,
  Lock,
} from 'lucide-react';

export const ResultsModule: React.FC = () => {
  const { currentUser, currentSchool } = useAuth();
  const [classes, setClasses] = useState<ClassArm[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('1st Term');
  const [selectedSession, setSelectedSession] = useState('2024/2025');

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [currentReportCard, setCurrentReportCard] = useState<ReportCard | null>(null);
  const [subjectScores, setSubjectScores] = useState<SubjectScore[]>([]);

  const [teacherComment, setTeacherComment] = useState('');
  const [principalComment, setPrincipalComment] = useState('');
  const [affectiveTraits, setAffectiveTraits] = useState({
    punctuality: 5,
    neatness: 5,
    honesty: 5,
    leadership: 4,
    politeness: 5,
    sportsmanship: 4,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [modalReportCard, setModalReportCard] = useState<ReportCard | null>(null);

  // Initialize
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [clsList, stdList, subList, repList] = await Promise.all([
          api.getClasses(),
          api.getStudents(),
          api.getSubjects(),
          api.getResults(),
        ]);
        setClasses(clsList);
        setStudents(stdList);
        setSubjects(subList);
        setReportCards(repList);

        if (clsList.length > 0) {
          setSelectedClassId(clsList[0].id);
        }
      } catch (err) {
        console.error('Failed to load results module:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Filter students by selected class
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // When class changes, select the first student in that class
  useEffect(() => {
    if (classStudents.length > 0 && (!selectedStudentId || !classStudents.some((s) => s.id === selectedStudentId))) {
      setSelectedStudentId(classStudents[0].id);
    } else if (classStudents.length === 0) {
      setSelectedStudentId('');
    }
  }, [selectedClassId, students]);

  // Load selected student's report card
  useEffect(() => {
    if (!selectedStudentId) {
      setCurrentReportCard(null);
      setSubjectScores([]);
      return;
    }

    const found = reportCards.find(
      (r) =>
        r.studentId === selectedStudentId &&
        r.term === selectedTerm &&
        r.session === selectedSession
    );

    const std = students.find((s) => s.id === selectedStudentId);

    if (found) {
      setCurrentReportCard(found);
      setSubjectScores(found.subjects || []);
      setTeacherComment(found.teacherComment || '');
      setPrincipalComment(found.principalComment || '');
      setAffectiveTraits(
        found.affectiveTraits || {
          punctuality: 5,
          neatness: 5,
          honesty: 5,
          leadership: 4,
          politeness: 5,
          sportsmanship: 4,
        }
      );
    } else {
      setCurrentReportCard(null);
      // Initialize with default subjects
      const initialScores: SubjectScore[] = subjects.slice(0, 5).map((sub) => {
        const ca1 = 12;
        const ca2 = 13;
        const exam = 55;
        const total = ca1 + ca2 + exam;
        const g = calculateGrade(total);
        return {
          subjectId: sub.id,
          subjectName: sub.name,
          ca1,
          ca2,
          exam,
          total,
          grade: g.grade,
          remark: g.remark,
        };
      });
      setSubjectScores(initialScores);
      setTeacherComment('Pleasant and attentive student. Displays steady academic progress.');
      setPrincipalComment('Good performance. Continue working diligently.');
    }
  }, [selectedStudentId, selectedTerm, selectedSession, reportCards, subjects, students]);

  const handleScoreChange = (
    index: number,
    field: 'ca1' | 'ca2' | 'exam',
    value: number
  ) => {
    setSubjectScores((prev) => {
      const updated = [...prev];
      const item = { ...updated[index] };

      // Validation bounds
      if (field === 'ca1' || field === 'ca2') {
        item[field] = Math.max(0, Math.min(15, value || 0));
      } else {
        item.exam = Math.max(0, Math.min(70, value || 0));
      }

      item.total = item.ca1 + item.ca2 + item.exam;
      const g = calculateGrade(item.total);
      item.grade = g.grade;
      item.remark = g.remark;

      updated[index] = item;
      return updated;
    });
  };

  const handleSaveResult = async (status: 'draft' | 'published' = 'draft') => {
    const std = students.find((s) => s.id === selectedStudentId);
    const cls = classes.find((c) => c.id === selectedClassId);
    if (!std || !cls) return;

    setIsSaving(true);
    setStatusMessage('');
    try {
      const totalScore = subjectScores.reduce((acc, curr) => acc + curr.total, 0);
      const averageScore = subjectScores.length > 0 ? totalScore / subjectScores.length : 0;

      const payload: Partial<ReportCard> = {
        studentId: std.id,
        studentName: `${std.firstName} ${std.lastName}`,
        admissionNo: std.admissionNo,
        classId: cls.id,
        className: cls.name,
        arm: cls.arm,
        term: selectedTerm,
        session: selectedSession,
        subjects: subjectScores,
        totalScore,
        averageScore,
        classPosition: 1,
        classTotalStudents: classStudents.length,
        teacherComment,
        principalComment,
        affectiveTraits,
        status,
        staffId: currentUser?.id,
        staffName: currentUser?.name,
      };

      const saved = await api.saveResult(payload);
      setCurrentReportCard(saved);

      // Refresh report cards list
      const refreshed = await api.getResults();
      setReportCards(refreshed);

      setStatusMessage(
        status === 'published'
          ? 'Report card published! Ward and parents can now view official result.'
          : 'Scores saved successfully in draft state.'
      );
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save scores');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBatchPublish = async () => {
    if (
      !confirm(
        `Publish all report cards for ${selectedTerm} ${selectedSession}? Parents and students will be able to see their official grades.`
      )
    )
      return;

    setIsPublishing(true);
    try {
      const res = await api.publishResultsBatch({
        classId: selectedClassId,
        term: selectedTerm,
        session: selectedSession,
      });
      const refreshed = await api.getResults();
      setReportCards(refreshed);
      setStatusMessage(`Published ${res.publishedCount} report cards for this class!`);
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Publishing failed');
    } finally {
      setIsPublishing(false);
    }
  };

  const totalScoreCalc = subjectScores.reduce((acc, curr) => acc + curr.total, 0);
  const avgCalc = subjectScores.length > 0 ? (totalScoreCalc / subjectScores.length).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Academic Results & Continuous Assessment</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Record Continuous Assessment (CA 1 & 2), termly exam scores, remarks, and publish report cards.
          </p>
        </div>

        {statusMessage && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Class & Term Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Class & Arm:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.arm}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Session:
            </label>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {SESSIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Term:
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBatchPublish}
            disabled={isPublishing}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing...' : 'Publish Term Class Results'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Student List on left, Score Entry on right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Student Selector List */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-2xs h-fit">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Students ({classStudents.length})
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {classStudents.map((std) => {
              const hasReport = reportCards.some(
                (r) =>
                  r.studentId === std.id &&
                  r.term === selectedTerm &&
                  r.session === selectedSession
              );
              const isSelected = std.id === selectedStudentId;

              return (
                <button
                  key={std.id}
                  onClick={() => setSelectedStudentId(std.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="truncate">
                    <div>{std.firstName} {std.lastName}</div>
                    <div
                      className={`text-[10px] font-mono ${
                        isSelected ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {std.admissionNo}
                    </div>
                  </div>
                  {hasReport && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-xs font-medium ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      }`}
                    >
                      Graded
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Score Entry Area */}
        <div className="lg:col-span-3 space-y-6">
          {selectedStudentId ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-6">
              {/* Student Overview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {students.find((s) => s.id === selectedStudentId)?.firstName}{' '}
                      {students.find((s) => s.id === selectedStudentId)?.lastName}
                    </h2>
                    <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {students.find((s) => s.id === selectedStudentId)?.admissionNo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Grading System: WAEC Standard (CA1: 15% · CA2: 15% · Exam: 70%)
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Aggregate / Average</div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                      {totalScoreCalc} pts · {avgCalc}%
                    </div>
                  </div>

                  {currentReportCard && (
                    <button
                      type="button"
                      onClick={() => setModalReportCard(currentReportCard)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700 hover:bg-blue-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Sheet</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Subject Scores Entry Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                      <th className="p-3">Subject</th>
                      <th className="p-3 text-center w-28">CA 1 (15%)</th>
                      <th className="p-3 text-center w-28">CA 2 (15%)</th>
                      <th className="p-3 text-center w-28">Exam (70%)</th>
                      <th className="p-3 text-center w-24">Total</th>
                      <th className="p-3 text-center w-20">Grade</th>
                      <th className="p-3 text-center">Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {subjectScores.map((score, index) => (
                      <tr key={score.subjectId || index} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                          {score.subjectName}
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="15"
                            value={score.ca1}
                            onChange={(e) =>
                              handleScoreChange(index, 'ca1', parseInt(e.target.value) || 0)
                            }
                            className="w-16 mx-auto px-2 py-1 text-center font-mono font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="15"
                            value={score.ca2}
                            onChange={(e) =>
                              handleScoreChange(index, 'ca2', parseInt(e.target.value) || 0)
                            }
                            className="w-16 mx-auto px-2 py-1 text-center font-mono font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="70"
                            value={score.exam}
                            onChange={(e) =>
                              handleScoreChange(index, 'exam', parseInt(e.target.value) || 0)
                            }
                            className="w-16 mx-auto px-2 py-1 text-center font-mono font-medium rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                          {score.total}
                        </td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">
                          {score.grade}
                        </td>
                        <td className="p-3 text-center text-slate-600 dark:text-slate-400">
                          {score.remark}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Remarks Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class Teacher's Remark:
                  </label>
                  <textarea
                    rows={2}
                    value={teacherComment}
                    onChange={(e) => setTeacherComment(e.target.value)}
                    placeholder="Enter academic and behavioral observation..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Principal's General Remark:
                  </label>
                  <textarea
                    rows={2}
                    value={principalComment}
                    onChange={(e) => setPrincipalComment(e.target.value)}
                    placeholder="Head teacher's endorsement remark..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleSaveResult('draft')}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Draft</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveResult('published')}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save & Publish Report Card</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              Select a student to enter scores and remarks.
            </div>
          )}
        </div>
      </div>

      {/* Report Card Sheet Modal */}
      {modalReportCard && (
        <ReportCardModal
          reportCard={modalReportCard}
          school={currentSchool}
          onClose={() => setModalReportCard(null)}
        />
      )}
    </div>
  );
};
