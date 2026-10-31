import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { Student, ClassArm } from '../../types';
import {
  Search,
  Plus,
  ArrowRightLeft,
  X,
  Phone,
  Mail,
  HeartPulse,
  Trash2,
  Edit,
  GraduationCap,
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassArm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  // Modal states
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedStudentForView, setSelectedStudentForView] = useState<Student | null>(null);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);

  // Bulk selection for promotion
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [targetPromotionClassId, setTargetPromotionClassId] = useState('');

  // Form state for student registration/edit
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    gender: 'Male' as 'Male' | 'Female',
    dob: '2012-05-15',
    classId: '',
    className: 'JSS 1',
    arm: 'Gold',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: 'Lekki, Lagos',
    bloodGroup: 'O+',
    medicalNotes: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: 'Parent',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stdData, clsData] = await Promise.all([api.getStudents(), api.getClasses()]);
      setStudents(stdData);
      setClasses(clsData);
      if (clsData.length > 0 && !formData.classId) {
        setFormData((prev) => ({
          ...prev,
          classId: clsData[0].id,
          className: clsData[0].name,
          arm: clsData[0].arm,
        }));
        setTargetPromotionClassId(clsData[0].id);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCls = classes.find((c) => c.id === formData.classId);
      const payload: Partial<Student> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        otherNames: formData.otherNames,
        gender: formData.gender,
        dob: formData.dob,
        classId: formData.classId,
        className: selectedCls?.name || formData.className,
        arm: selectedCls?.arm || formData.arm,
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        medicalNotes: formData.medicalNotes,
        emergencyContact: {
          name: formData.emergencyName || formData.parentName,
          phone: formData.emergencyPhone || formData.parentPhone,
          relationship: formData.emergencyRelationship,
        },
      };

      if (selectedStudentForEdit) {
        await api.updateStudent(selectedStudentForEdit.id, payload);
      } else {
        await api.createStudent(payload);
      }

      setIsEnrollModalOpen(false);
      setSelectedStudentForEdit(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save student record');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete student ${name}? This action cannot be undone.`)) {
      try {
        await api.deleteStudent(id);
        await loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete student');
      }
    }
  };

  const handlePromoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      alert('Please select at least one student to promote.');
      return;
    }
    const targetCls = classes.find((c) => c.id === targetPromotionClassId);
    if (!targetCls) return;

    try {
      await api.promoteStudents({
        studentIds: selectedStudentIds,
        targetClassId: targetCls.id,
        targetClassName: targetCls.name,
        targetArm: targetCls.arm,
      });
      setIsPromoteModalOpen(false);
      setSelectedStudentIds([]);
      await loadData();
      alert(`Successfully promoted ${selectedStudentIds.length} students to ${targetCls.name} ${targetCls.arm}!`);
    } catch (err: any) {
      alert(err.message || 'Promotion failed');
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      `${s.firstName} ${s.lastName} ${s.otherNames || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
    return matchesSearch && matchesClass;
  });

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Student Information System</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage student admissions, classroom allocation, guardian records, and promotions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Promote Students</span>
          </button>

          <button
            onClick={() => {
              setSelectedStudentForEdit(null);
              setFormData({
                firstName: '',
                lastName: '',
                otherNames: '',
                gender: 'Male',
                dob: '2012-05-15',
                classId: classes[0]?.id || '',
                className: classes[0]?.name || 'JSS 1',
                arm: classes[0]?.arm || 'Gold',
                parentName: '',
                parentEmail: '',
                parentPhone: '',
                address: 'Lekki, Lagos',
                bloodGroup: 'O+',
                medicalNotes: '',
                emergencyName: '',
                emergencyPhone: '',
                emergencyRelationship: 'Parent',
              });
              setIsEnrollModalOpen(true);
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student by name or admission number (e.g. CHIS/2023)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-slate-500 dark:text-slate-400 shrink-0">Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Classes & Arms</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.arm} ({c.level})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length
                    }
                    onChange={selectAllFiltered}
                    className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5">Admission No</th>
                <th className="p-3.5">Full Name</th>
                <th className="p-3.5">Class & Arm</th>
                <th className="p-3.5">Gender</th>
                <th className="p-3.5">Parent / Guardian</th>
                <th className="p-3.5">Emergency Contact</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Loading student directory...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No student records found matching this criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr
                    key={std.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(std.id)}
                        onChange={() => toggleSelectStudent(std.id)}
                        className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-medium">
                      {std.admissionNo}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                      {std.firstName} {std.lastName} {std.otherNames ? `(${std.otherNames})` : ''}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      {std.className} {std.arm}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{std.gender}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      <div>{std.parentName || 'None assigned'}</div>
                      {std.parentPhone && (
                        <div className="text-[11px] text-slate-400">{std.parentPhone}</div>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      <div>{std.emergencyContact?.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {std.emergencyContact?.phone} ({std.emergencyContact?.relationship})
                      </div>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedStudentForView(std)}
                        className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md transition-colors cursor-pointer"
                        title="View Full Profile"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStudentForEdit(std);
                          setFormData({
                            firstName: std.firstName,
                            lastName: std.lastName,
                            otherNames: std.otherNames || '',
                            gender: std.gender,
                            dob: std.dob,
                            classId: std.classId,
                            className: std.className,
                            arm: std.arm,
                            parentName: std.parentName || '',
                            parentEmail: std.parentEmail || '',
                            parentPhone: std.parentPhone || '',
                            address: std.address || '',
                            bloodGroup: std.bloodGroup || 'O+',
                            medicalNotes: std.medicalNotes || '',
                            emergencyName: std.emergencyContact?.name || '',
                            emergencyPhone: std.emergencyContact?.phone || '',
                            emergencyRelationship: std.emergencyContact?.relationship || 'Parent',
                          });
                          setIsEnrollModalOpen(true);
                        }}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                        title="Edit Student Record"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(std.id, `${std.firstName} ${std.lastName}`)}
                        className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer"
                        title="Delete Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enroll / Edit Student Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedStudentForEdit ? 'Edit Student Record' : 'Enroll New Student'}
                </h2>
                <p className="text-xs text-slate-500">
                  Nigerian Primary & Secondary School Enrolment Registry
                </p>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Toluwanimi"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Last Name (Surname) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Adeleke"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Other Names
                  </label>
                  <input
                    type="text"
                    value={formData.otherNames}
                    onChange={(e) => setFormData({ ...formData, otherNames: e.target.value })}
                    placeholder="e.g. Oluwaseun"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Class & Arm Allocation *
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} {cls.arm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                  Parent / Primary Guardian Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Parent Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="e.g. Chief Olatunji Adeleke"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Parent Email
                    </label>
                    <input
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      placeholder="parent@gmail.com"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Parent Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      placeholder="+234 803 123 4567"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                  Emergency Contact & Medical Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                      placeholder="e.g. Mrs. Funke Adeleke"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Emergency Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      placeholder="+234 802 999 8877"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Medical Notes / Allergies
                  </label>
                  <input
                    type="text"
                    value={formData.medicalNotes}
                    onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                    placeholder="e.g. Mild asthma, carries inhaler; allergic to penicillin"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  {selectedStudentForEdit ? 'Save Changes' : 'Confirm Enrolment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                <span>Class Promotion Tool</span>
              </h2>
              <button
                onClick={() => setIsPromoteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Promote selected students to their next academic class for the new term or session.
            </p>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-xs text-blue-800 dark:text-blue-300">
              Students Selected: <span className="font-bold">{selectedStudentIds.length}</span>
            </div>

            <form onSubmit={handlePromoteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Promote To Target Class:
                </label>
                <select
                  value={targetPromotionClassId}
                  onChange={(e) => setTargetPromotionClassId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} {cls.arm} ({cls.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPromoteModalOpen(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedStudentIds.length === 0}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  Execute Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Full Student Profile Modal */}
      {selectedStudentForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                  {selectedStudentForView.admissionNo}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {selectedStudentForView.firstName} {selectedStudentForView.lastName}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedStudentForView.className} {selectedStudentForView.arm} · Status:{' '}
                  <span className="text-emerald-600 font-semibold capitalize">
                    {selectedStudentForView.status}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentForView(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Personal Details
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  <div>Gender: {selectedStudentForView.gender}</div>
                  <div>DOB: {selectedStudentForView.dob}</div>
                  <div>Blood Group: {selectedStudentForView.bloodGroup || 'O+'}</div>
                  <div>Admitted: {selectedStudentForView.admissionDate}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Parent / Guardian Details
                </div>
                <div className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedStudentForView.parentName || 'No parent attached'}
                </div>
                <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400">
                  {selectedStudentForView.parentPhone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedStudentForView.parentPhone}</span>
                    </div>
                  )}
                  {selectedStudentForView.parentEmail && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{selectedStudentForView.parentEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Emergency & Medical
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  Contact: {selectedStudentForView.emergencyContact?.name} (
                  {selectedStudentForView.emergencyContact?.phone})
                </div>
                {selectedStudentForView.medicalNotes && (
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 pt-1">
                    <HeartPulse className="w-3.5 h-3.5 shrink-0" />
                    <span>{selectedStudentForView.medicalNotes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStudentForView(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
