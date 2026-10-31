import React from 'react';
import type { ReportCard, School } from '../../types';
import { ASSETS } from '../../lib/constants';
import { X, Printer, Download, CheckCircle2, Award } from 'lucide-react';

interface ReportCardModalProps {
  reportCard: ReportCard;
  school: School | null;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  reportCard,
  school,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Controls Bar (hidden during print) */}
        <div className="no-print p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Official Academic Performance Term Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Report Card Document */}
        <div className="p-8 space-y-6 bg-white font-sans">
          {/* School Letterhead & Crest */}
          <div className="flex items-center justify-between border-b-2 border-blue-900 pb-5">
            <img
              src={school?.logo || ASSETS.logo}
              alt="School Crest"
              className="w-20 h-20 object-contain rounded-lg border border-slate-200 p-1"
              referrerPolicy="no-referrer"
            />
            <div className="text-center flex-1 px-4">
              <h1 className="text-2xl font-black text-blue-950 uppercase tracking-tight">
                {school?.name || 'Crown Heights International School'}
              </h1>
              <p className="text-xs font-semibold text-blue-800 italic">
                “{school?.motto || 'Knowledge, Character and Excellence'}”
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                {school?.address || 'Lekki Phase 1, Lagos, Nigeria'}
              </p>
              <p className="text-[11px] text-slate-600">
                Email: {school?.email} · Phone: {school?.phone}
              </p>
            </div>
            <div className="w-20 text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Official
              </span>
            </div>
          </div>

          <div className="text-center -mt-2">
            <span className="inline-block px-4 py-1 text-xs font-bold text-white bg-blue-900 rounded-md uppercase tracking-wider">
              Termly Academic Progress Report Sheet
            </span>
          </div>

          {/* Student Bio Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Student Name:</span>
              <span className="font-bold text-slate-900">{reportCard.studentName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Admission No:</span>
              <span className="font-mono font-bold text-blue-900">{reportCard.admissionNo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Class & Arm:</span>
              <span className="font-bold text-slate-900">
                {reportCard.className} {reportCard.arm}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Academic Period:</span>
              <span className="font-bold text-slate-900">
                {reportCard.term}, {reportCard.session}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Total Score:</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {reportCard.totalScore}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Average Percentage:</span>
              <span className="font-mono font-bold text-blue-700 tabular-nums">
                {reportCard.averageScore.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Class Position:</span>
              <span className="font-bold text-emerald-700">
                {getOrdinal(reportCard.classPosition)} / {reportCard.classTotalStudents}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">School Attendance:</span>
              <span className="font-medium text-slate-800">
                {reportCard.daysPresent} days present / {reportCard.daysAbsent} absent
              </span>
            </div>
          </div>

          {/* Academic Scores Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-blue-900 text-white font-semibold">
                  <th className="p-2.5">Subject</th>
                  <th className="p-2.5 text-center font-mono">CA 1 (15%)</th>
                  <th className="p-2.5 text-center font-mono">CA 2 (15%)</th>
                  <th className="p-2.5 text-center font-mono">Exam (70%)</th>
                  <th className="p-2.5 text-center font-mono">Total (100%)</th>
                  <th className="p-2.5 text-center">Grade</th>
                  <th className="p-2.5 text-center">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportCard.subjects.map((sub, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                    <td className="p-2.5 font-medium text-slate-900">{sub.subjectName}</td>
                    <td className="p-2.5 text-center font-mono tabular-nums text-slate-700">
                      {sub.ca1}
                    </td>
                    <td className="p-2.5 text-center font-mono tabular-nums text-slate-700">
                      {sub.ca2}
                    </td>
                    <td className="p-2.5 text-center font-mono tabular-nums text-slate-700">
                      {sub.exam}
                    </td>
                    <td className="p-2.5 text-center font-mono tabular-nums font-bold text-slate-900">
                      {sub.total}
                    </td>
                    <td className="p-2.5 text-center font-bold text-blue-900">{sub.grade}</td>
                    <td className="p-2.5 text-center text-slate-600">{sub.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Affective & Psychomotor Domain Evaluation */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2">
              Behavioral & Affective Domain Rating (Scale: 1 - 5)
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-md border border-slate-200">
                <div className="text-[10px] text-slate-500">Punctuality</div>
                <div className="font-bold text-blue-900 mt-0.5">
                  {reportCard.affectiveTraits?.punctuality || 5} / 5
                </div>
              </div>
              <div className="p-2 bg-white rounded-md border border-slate-200">
                <div className="text-[10px] text-slate-500">Neatness</div>
                <div className="font-bold text-blue-900 mt-0.5">
                  {reportCard.affectiveTraits?.neatness || 5} / 5
                </div>
              </div>
              <div className="p-2 bg-white rounded-md border border-slate-200">
                <div className="text-[10px] text-slate-500">Honesty</div>
                <div className="font-bold text-blue-900 mt-0.5">
                  {reportCard.affectiveTraits?.honesty || 5} / 5
                </div>
              </div>
              <div className="p-2 bg-white rounded-md border border-slate-200">
                <div className="text-[10px] text-slate-500">Leadership</div>
                <div className="font-bold text-blue-900 mt-0.5">
                  {reportCard.affectiveTraits?.leadership || 4} / 5
                </div>
              </div>
              <div className="p-2 bg-white rounded-md border border-slate-200">
                <div className="text-[10px] text-slate-500">Politeness</div>
                <div className="font-bold text-blue-900 mt-0.5">
                  {reportCard.affectiveTraits?.politeness || 5} / 5
                </div>
              </div>
              <div className="p-2 bg-white rounded-md border border-slate-200">
                <div className="text-[10px] text-slate-500">Sports</div>
                <div className="font-bold text-blue-900 mt-0.5">
                  {reportCard.affectiveTraits?.sportsmanship || 4} / 5
                </div>
              </div>
            </div>
          </div>

          {/* Teacher and Principal Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Class Teacher's Remark:
              </span>
              <p className="text-slate-800 italic leading-relaxed">
                “{reportCard.teacherComment}”
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Form Master Signature</span>
                <span className="font-serif italic font-bold text-slate-700">Signed</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Principal / Head Teacher's Remark:
              </span>
              <p className="text-slate-800 italic leading-relaxed">
                “{reportCard.principalComment}”
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>School Stamp & Date</span>
                <span className="font-semibold text-blue-900">
                  {new Date().toLocaleDateString('en-NG')}
                </span>
              </div>
            </div>
          </div>

          {/* Resumption Notice */}
          <div className="p-3 bg-blue-50 rounded-lg text-center text-xs text-blue-900 font-medium border border-blue-100">
            Next Term Resumption Date:{' '}
            <strong>{new Date(reportCard.nextTermResumptionDate).toDateString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
