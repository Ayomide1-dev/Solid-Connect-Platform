import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { Teacher, ClassArm, Subject } from '../../types';
import { Users, Plus, Mail, Phone, BookOpen, GraduationCap, X, Edit } from 'lucide-react';

export const StaffManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassArm[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    assignedClasses: [] as string[],
    assignedSubjects: [] as string[],
    isClassTeacherOf: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tch, cls, sub] = await Promise.all([
        api.getTeachers(),
        api.getClasses(),
        api.getSubjects(),
      ]);
      setTeachers(tch);
      setClasses(cls);
      setSubjects(sub);
    } catch (err) {
      console.error('Failed to load teachers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedTeacher) {
        await api.updateTeacher(selectedTeacher.id, formData);
      } else {
        await api.createTeacher(formData);
      }
      setIsModalOpen(false);
      setSelectedTeacher(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const toggleClass = (classId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedClasses: prev.assignedClasses.includes(classId)
        ? prev.assignedClasses.filter((id) => id !== classId)
        : [...prev.assignedClasses, classId],
    }));
  };

  const toggleSubject = (subjectName: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedSubjects: prev.assignedSubjects.includes(subjectName)
        ? prev.assignedSubjects.filter((name) => name !== subjectName)
        : [...prev.assignedSubjects, subjectName],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Academic Staff & Teachers</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage teacher profiles, qualifications, subject specialization, and form master assignments.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedTeacher(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              qualification: 'B.Sc (Ed) / B.Ed, University of Lagos',
              assignedClasses: [],
              assignedSubjects: [],
              isClassTeacherOf: '',
            });
            setIsModalOpen(true);
          }}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Appoint New Teacher</span>
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((tch) => {
          const formClass = classes.find((c) => c.id === tch.isClassTeacherOf);
          return (
            <div
              key={tch.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    {tch.staffId}
                  </span>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{tch.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {tch.qualification}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedTeacher(tch);
                    setFormData({
                      name: tch.name,
                      email: tch.email,
                      phone: tch.phone,
                      qualification: tch.qualification,
                      assignedClasses: tch.assignedClasses || [],
                      assignedSubjects: tch.assignedSubjects || [],
                      isClassTeacherOf: tch.isClassTeacherOf || '',
                    });
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md cursor-pointer"
                  title="Edit Teacher"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tch.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{tch.phone}</span>
                </div>
              </div>

              {formClass && (
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>
                    Form Master for: <strong>{formClass.name} {formClass.arm}</strong>
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Teaching Subjects
                </div>
                <div className="flex flex-wrap gap-1">
                  {tch.assignedSubjects.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 text-[11px] rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teacher Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {selectedTeacher ? 'Edit Teacher Record' : 'Appoint New Teacher'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name & Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mr. Chinedu Okafor"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="teacher@crownheights.sch.ng"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 803 123 4567"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Educational Qualification
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. B.Sc (Ed) Mathematics, University of Lagos"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Assign Form Master Role (Class Teacher of):
                </label>
                <select
                  value={formData.isClassTeacherOf}
                  onChange={(e) => setFormData({ ...formData, isClassTeacherOf: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Not a Form Master</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} {cls.arm} ({cls.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subjects Taught:
                </label>
                <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg max-h-36 overflow-y-auto">
                  {subjects.map((sub) => (
                    <label key={sub.id} className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.assignedSubjects.includes(sub.name)}
                        onChange={() => toggleSubject(sub.name)}
                        className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-800 dark:text-slate-200">{sub.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
