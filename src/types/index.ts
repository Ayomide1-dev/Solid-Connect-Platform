export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'bursar';

export interface School {
  id: string;
  name: string;
  motto: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  state: string;
  lga: string;
  currentSession: string; // e.g. "2024/2025"
  currentTerm: string; // e.g. "1st Term"
  gradingScale: {
    grade: string;
    minScore: number;
    maxScore: number;
    remark: string;
    points: number;
  }[];
  caWeight: number; // 30 or 40
  examWeight: number; // 70 or 60
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
}

export interface User {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  status: 'active' | 'pending';
  linkedEntityId?: string; // studentId or teacherId or parentId
}

export interface Student {
  id: string;
  schoolId: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  otherNames?: string;
  gender: 'Male' | 'Female';
  dob: string;
  classId: string;
  className: string;
  arm: string;
  parentId?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  address: string;
  bloodGroup?: string;
  medicalNotes?: string;
  admissionDate: string;
  status: 'active' | 'graduated' | 'transferred';
  photoUrl?: string;
}

export interface Teacher {
  id: string;
  schoolId: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  assignedClasses: string[];
  assignedSubjects: string[];
  isClassTeacherOf?: string; // classId
  photoUrl?: string;
}

export interface Parent {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  address: string;
  linkedStudentIds: string[];
}

export interface ClassArm {
  id: string;
  schoolId: string;
  name: string; // e.g. "SSS 2"
  arm: string; // e.g. "Gold", "A"
  level: 'Primary' | 'Junior Secondary' | 'Senior Secondary';
  classTeacherId?: string;
  classTeacherName?: string;
  studentCount: number;
  capacity: number;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  level: 'Primary' | 'Junior Secondary' | 'Senior Secondary';
  category: 'Science' | 'Arts' | 'Commercial' | 'General';
  assignedTeacherId?: string;
  assignedTeacherName?: string;
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  admissionNo: string;
  status: 'present' | 'absent' | 'late';
  reason?: string;
}

export interface AttendanceSheet {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  arm: string;
  date: string;
  term: string;
  session: string;
  records: AttendanceRecord[];
  markedByStaffId: string;
  markedByStaffName: string;
  markedAt: string;
  lastUpdatedAt?: string;
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  ca1: number; // 0-15
  ca2: number; // 0-15
  exam: number; // 0-70
  total: number; // 0-100
  grade: string; // A1, B2, etc.
  remark: string; // Excellent, Good, etc.
  position?: number;
}

export interface AffectiveTraits {
  punctuality: number; // 1-5
  neatness: number;
  honesty: number;
  leadership: number;
  politeness: number;
  sportsmanship: number;
}

export interface ReportCard {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  arm: string;
  term: string;
  session: string;
  subjects: SubjectScore[];
  totalScore: number;
  averageScore: number;
  classPosition: number;
  classTotalStudents: number;
  teacherComment: string;
  principalComment: string;
  affectiveTraits: AffectiveTraits;
  daysPresent: number;
  daysAbsent: number;
  nextTermResumptionDate: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  staffId?: string;
  staffName?: string;
}

export interface Assignment {
  id: string;
  schoolId: string;
  title: string;
  subjectName: string;
  classId: string;
  className: string;
  arm: string;
  teacherId: string;
  teacherName: string;
  description: string;
  dueDate: string;
  maxScore: number;
  attachments?: { name: string; size: string; url?: string }[];
  createdAt: string;
  submissionCount?: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  submissionText: string;
  attachedFile?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'graded';
}

export interface TimetablePeriod {
  periodNumber: number;
  time: string; // e.g. "08:00 - 08:45"
  subjectName: string;
  teacherName: string;
  room?: string;
}

export interface ClassTimetable {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  arm: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  periods: TimetablePeriod[];
}

export interface InvoiceItem {
  title: string;
  amount: number;
}

export interface Invoice {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  term: string;
  session: string;
  items: InvoiceItem[];
  totalAmount: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  status: 'unpaid' | 'partial' | 'paid';
  createdAt: string;
}

export interface PaymentReceipt {
  id: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  amount: number;
  paymentMethod: 'Paystack' | 'Flutterwave' | 'Bank Transfer' | 'Cash';
  reference: string;
  verified: boolean;
  paidAt: string;
  receiptNumber: string;
  verifiedBy?: string;
  notes?: string;
}

export interface Announcement {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  targetRole: 'all' | 'teachers' | 'parents' | 'students' | 'bursar';
  targetClassId?: string;
  priority: 'normal' | 'urgent';
  authorName: string;
  authorRole: string;
  createdAt: string;
}

export interface SchoolEvent {
  id: string;
  schoolId: string;
  title: string;
  date: string;
  time: string;
  category: 'Academic' | 'Sports' | 'Holiday' | 'PTA' | 'Exam';
  description: string;
}

export interface SchoolMessage {
  id: string;
  schoolId: string;
  parentId: string;
  parentName: string;
  studentName: string;
  subject: string;
  message: string;
  reply?: string;
  repliedBy?: string;
  repliedAt?: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DashboardSummary {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendance: {
    totalMarked: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };
  totalPendingFees: number;
  totalCollectedFees: number;
  recentAnnouncements: Announcement[];
  upcomingEvents: SchoolEvent[];
  recentActivities: AuditLog[];
}
