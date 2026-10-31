import type {
  School,
  User,
  Student,
  Teacher,
  Parent,
  ClassArm,
  Subject,
  AttendanceSheet,
  ReportCard,
  Assignment,
  Submission,
  ClassTimetable,
  Invoice,
  PaymentReceipt,
  Announcement,
  SchoolEvent,
  SchoolMessage,
  AuditLog,
  DashboardSummary,
  UserRole,
} from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let errorMsg = `API Error ${res.status}: ${res.statusText}`;
    try {
      const json = await res.json();
      if (json.error) errorMsg = json.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Reset demo
  resetDemoData: () => request<{ success: boolean; message: string }>('/reset-demo-data', { method: 'POST' }),

  // School
  getSchool: () => request<School>('/school'),
  updateSchool: (data: Partial<School> & { adminId?: string; adminName?: string }) =>
    request<School>('/school', { method: 'PUT', body: JSON.stringify(data) }),

  // Auth
  login: (data: { email?: string; role?: UserRole; targetUserId?: string }) =>
    request<{ success: boolean; user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  register: (data: { name: string; email: string; role: UserRole; phone?: string; inviteCode?: string }) =>
    request<{ success: boolean; user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  resetPassword: (email: string) =>
    request<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Summary
  getDashboardSummary: () => request<DashboardSummary>('/dashboard/summary'),

  // Students
  getStudents: () => request<Student[]>('/students'),
  createStudent: (student: Partial<Student>) => request<Student>('/students', { method: 'POST', body: JSON.stringify(student) }),
  updateStudent: (id: string, student: Partial<Student>) => request<Student>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(student) }),
  deleteStudent: (id: string) => request<{ success: boolean }>(`/students/${id}`, { method: 'DELETE' }),
  promoteStudents: (data: { studentIds: string[]; targetClassId: string; targetClassName: string; targetArm: string }) =>
    request<{ success: boolean; promotedCount: number }>('/students/promote', { method: 'POST', body: JSON.stringify(data) }),

  // Teachers
  getTeachers: () => request<Teacher[]>('/teachers'),
  createTeacher: (teacher: Partial<Teacher>) => request<Teacher>('/teachers', { method: 'POST', body: JSON.stringify(teacher) }),
  updateTeacher: (id: string, teacher: Partial<Teacher>) => request<Teacher>(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(teacher) }),

  // Parents
  getParents: () => request<Parent[]>('/parents'),

  // Classes & Subjects
  getClasses: () => request<ClassArm[]>('/classes'),
  createClass: (cls: Partial<ClassArm>) => request<ClassArm>('/classes', { method: 'POST', body: JSON.stringify(cls) }),
  getSubjects: () => request<Subject[]>('/subjects'),
  createSubject: (sub: Partial<Subject>) => request<Subject>('/subjects', { method: 'POST', body: JSON.stringify(sub) }),

  // Attendance
  getAttendance: (params?: { classId?: string; date?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<AttendanceSheet[]>(`/attendance${q ? `?${q}` : ''}`);
  },
  saveAttendance: (data: Partial<AttendanceSheet>) => request<AttendanceSheet>('/attendance', { method: 'POST', body: JSON.stringify(data) }),

  // Results
  getResults: (params?: { studentId?: string; classId?: string; term?: string; session?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<ReportCard[]>(`/results${q ? `?${q}` : ''}`);
  },
  saveResult: (result: Partial<ReportCard> & { staffId?: string; staffName?: string }) =>
    request<ReportCard>('/results', { method: 'POST', body: JSON.stringify(result) }),
  publishResultsBatch: (data: { classId?: string; term?: string; session?: string }) =>
    request<{ success: boolean; publishedCount: number }>('/results/publish-batch', { method: 'POST', body: JSON.stringify(data) }),

  // Assignments & Submissions
  getAssignments: (classId?: string) => request<Assignment[]>(`/assignments${classId ? `?classId=${classId}` : ''}`),
  createAssignment: (data: Partial<Assignment>) => request<Assignment>('/assignments', { method: 'POST', body: JSON.stringify(data) }),
  getSubmissions: (params?: { assignmentId?: string; studentId?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<Submission[]>(`/submissions${q ? `?${q}` : ''}`);
  },
  submitHomework: (data: Partial<Submission>) => request<Submission>('/submissions', { method: 'POST', body: JSON.stringify(data) }),
  gradeSubmission: (id: string, data: { score: number; feedback: string; teacherName: string; teacherId: string }) =>
    request<Submission>(`/submissions/${id}/grade`, { method: 'PUT', body: JSON.stringify(data) }),

  // Timetables
  getTimetables: (classId?: string) => request<ClassTimetable[]>(`/timetables${classId ? `?classId=${classId}` : ''}`),
  saveTimetable: (data: Partial<ClassTimetable>) => request<ClassTimetable>('/timetables', { method: 'POST', body: JSON.stringify(data) }),

  // Fees & Invoices
  getInvoices: (params?: { studentId?: string; classId?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<Invoice[]>(`/invoices${q ? `?${q}` : ''}`);
  },
  createInvoice: (data: Partial<Invoice> & { bursarId?: string; bursarName?: string }) =>
    request<Invoice>('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  getReceipts: (params?: { studentId?: string; invoiceId?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<PaymentReceipt[]>(`/receipts${q ? `?${q}` : ''}`);
  },
  processPayment: (data: {
    invoiceId: string;
    amount: number;
    paymentMethod: 'Paystack' | 'Flutterwave' | 'Bank Transfer' | 'Cash';
    reference?: string;
    payerName?: string;
    bursarId?: string;
    bursarName?: string;
    notes?: string;
  }) => request<{ success: boolean; message: string; receipt: PaymentReceipt; updatedInvoice: Invoice }>('/payments/process', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Announcements & Events
  getAnnouncements: () => request<Announcement[]>('/announcements'),
  createAnnouncement: (data: Partial<Announcement>) => request<Announcement>('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  getEvents: () => request<SchoolEvent[]>('/events'),
  createEvent: (data: Partial<SchoolEvent>) => request<SchoolEvent>('/events', { method: 'POST', body: JSON.stringify(data) }),

  // Messages
  getMessages: (parentId?: string) => request<SchoolMessage[]>(`/messages${parentId ? `?parentId=${parentId}` : ''}`),
  sendMessage: (data: Partial<SchoolMessage>) => request<SchoolMessage>('/messages', { method: 'POST', body: JSON.stringify(data) }),
  replyMessage: (id: string, data: { reply: string; repliedBy: string }) =>
    request<SchoolMessage>(`/messages/${id}/reply`, { method: 'PUT', body: JSON.stringify(data) }),

  // Audit Logs
  getAuditLogs: () => request<AuditLog[]>('/audit-logs'),
};
