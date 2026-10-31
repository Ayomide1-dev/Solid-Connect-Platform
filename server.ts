import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'sch_connect_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Nigerian School Seed Data
function getInitialSeedData() {
  const schoolId = 'sch_chis_01';
  return {
    school: {
      id: schoolId,
      name: 'Crown Heights International School',
      motto: 'Knowledge, Character and Excellence',
      logo: '/src/assets/images/sch_connect_logo_1793451675033.jpg',
      address: 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos State, Nigeria',
      phone: '+234 803 456 7890',
      email: 'admissions@crownheights.sch.ng',
      state: 'Lagos',
      lga: 'Eti-Osa',
      currentSession: '2024/2025',
      currentTerm: '1st Term',
      caWeight: 30,
      examWeight: 70,
      bankName: 'Zenith Bank PLC',
      bankAccountName: 'Crown Heights Int School - Tuition Collection',
      bankAccountNumber: '1014829384',
      gradingScale: [
        { grade: 'A1', minScore: 75, maxScore: 100, remark: 'Distinction', points: 9 },
        { grade: 'B2', minScore: 70, maxScore: 74, remark: 'Very Good', points: 8 },
        { grade: 'B3', minScore: 65, maxScore: 69, remark: 'Good', points: 7 },
        { grade: 'C4', minScore: 60, maxScore: 64, remark: 'Credit', points: 6 },
        { grade: 'C5', minScore: 55, maxScore: 59, remark: 'Credit', points: 5 },
        { grade: 'C6', minScore: 50, maxScore: 54, remark: 'Credit', points: 4 },
        { grade: 'D7', minScore: 45, maxScore: 49, remark: 'Pass', points: 3 },
        { grade: 'E8', minScore: 40, maxScore: 44, remark: 'Pass', points: 2 },
        { grade: 'F9', minScore: 0, maxScore: 39, remark: 'Fail', points: 0 },
      ],
    },
    users: [
      {
        id: 'usr_admin',
        schoolId,
        name: 'Dr. Babatunde Alabi',
        email: 'principal@crownheights.sch.ng',
        role: 'admin',
        phone: '+234 802 111 2233',
        status: 'active',
      },
      {
        id: 'usr_tch_1',
        schoolId,
        name: 'Mr. Chinedu Okafor',
        email: 'c.okafor@crownheights.sch.ng',
        role: 'teacher',
        phone: '+234 803 222 3344',
        status: 'active',
        linkedEntityId: 'tch_1',
      },
      {
        id: 'usr_tch_2',
        schoolId,
        name: 'Mrs. Folashade Adeyemi',
        email: 'f.adeyemi@crownheights.sch.ng',
        role: 'teacher',
        phone: '+234 805 333 4455',
        status: 'active',
        linkedEntityId: 'tch_2',
      },
      {
        id: 'usr_std_1',
        schoolId,
        name: 'Toluwanimi Adeleke',
        email: 't.adeleke@student.crownheights.sch.ng',
        role: 'student',
        phone: '+234 810 555 6677',
        status: 'active',
        linkedEntityId: 'std_1',
      },
      {
        id: 'usr_std_2',
        schoolId,
        name: 'Emeka Eze',
        email: 'e.eze@student.crownheights.sch.ng',
        role: 'student',
        phone: '+234 811 666 7788',
        status: 'active',
        linkedEntityId: 'std_2',
      },
      {
        id: 'usr_par_1',
        schoolId,
        name: 'Chief Olatunji Adeleke',
        email: 'tunji.adeleke@gmail.com',
        role: 'parent',
        phone: '+234 803 777 8899',
        status: 'active',
        linkedEntityId: 'par_1',
      },
      {
        id: 'usr_bur_1',
        schoolId,
        name: 'Mrs. Ngozi Obi (ACA)',
        email: 'bursar@crownheights.sch.ng',
        role: 'bursar',
        phone: '+234 806 888 9900',
        status: 'active',
      },
    ],
    classes: [
      {
        id: 'cls_jss1_a',
        schoolId,
        name: 'JSS 1',
        arm: 'Gold',
        level: 'Junior Secondary',
        classTeacherId: 'tch_1',
        classTeacherName: 'Mr. Chinedu Okafor',
        studentCount: 32,
        capacity: 35,
      },
      {
        id: 'cls_jss2_a',
        schoolId,
        name: 'JSS 2',
        arm: 'Gold',
        level: 'Junior Secondary',
        classTeacherId: 'tch_2',
        classTeacherName: 'Mrs. Folashade Adeyemi',
        studentCount: 30,
        capacity: 35,
      },
      {
        id: 'cls_jss3_a',
        schoolId,
        name: 'JSS 3',
        arm: 'Gold',
        level: 'Junior Secondary',
        studentCount: 28,
        capacity: 35,
      },
      {
        id: 'cls_sss1_sci',
        schoolId,
        name: 'SSS 1',
        arm: 'Science',
        level: 'Senior Secondary',
        studentCount: 26,
        capacity: 30,
      },
      {
        id: 'cls_sss2_sci',
        schoolId,
        name: 'SSS 2',
        arm: 'Science',
        level: 'Senior Secondary',
        classTeacherId: 'tch_1',
        classTeacherName: 'Mr. Chinedu Okafor',
        studentCount: 25,
        capacity: 30,
      },
      {
        id: 'cls_sss3_sci',
        schoolId,
        name: 'SSS 3',
        arm: 'Science',
        level: 'Senior Secondary',
        studentCount: 24,
        capacity: 30,
      },
    ],
    subjects: [
      { id: 'sub_mth', schoolId, name: 'Mathematics', code: 'MTH 201', level: 'Junior Secondary', category: 'General', assignedTeacherId: 'tch_1', assignedTeacherName: 'Mr. Chinedu Okafor' },
      { id: 'sub_eng', schoolId, name: 'English Language', code: 'ENG 201', level: 'Junior Secondary', category: 'General', assignedTeacherId: 'tch_2', assignedTeacherName: 'Mrs. Folashade Adeyemi' },
      { id: 'sub_bst', schoolId, name: 'Basic Science & Technology', code: 'BST 201', level: 'Junior Secondary', category: 'Science', assignedTeacherId: 'tch_3', assignedTeacherName: 'Dr. Aminu Garba' },
      { id: 'sub_cve', schoolId, name: 'Civic Education', code: 'CVE 201', level: 'Junior Secondary', category: 'General', assignedTeacherId: 'tch_2', assignedTeacherName: 'Mrs. Folashade Adeyemi' },
      { id: 'sub_phy', schoolId, name: 'Physics', code: 'PHY 301', level: 'Senior Secondary', category: 'Science', assignedTeacherId: 'tch_3', assignedTeacherName: 'Dr. Aminu Garba' },
      { id: 'sub_chm', schoolId, name: 'Chemistry', code: 'CHM 301', level: 'Senior Secondary', category: 'Science', assignedTeacherId: 'tch_3', assignedTeacherName: 'Dr. Aminu Garba' },
      { id: 'sub_bio', schoolId, name: 'Biology', code: 'BIO 301', level: 'Senior Secondary', category: 'Science', assignedTeacherId: 'tch_1', assignedTeacherName: 'Mr. Chinedu Okafor' },
      { id: 'sub_eco', schoolId, name: 'Economics', code: 'ECO 301', level: 'Senior Secondary', category: 'Commercial', assignedTeacherId: 'tch_2', assignedTeacherName: 'Mrs. Folashade Adeyemi' },
    ],
    teachers: [
      {
        id: 'tch_1',
        schoolId,
        staffId: 'TCH/CHIS/012',
        name: 'Mr. Chinedu Okafor',
        email: 'c.okafor@crownheights.sch.ng',
        phone: '+234 803 222 3344',
        qualification: 'B.Sc (Ed) Mathematics, University of Lagos',
        assignedClasses: ['cls_jss1_a', 'cls_jss2_a', 'cls_sss2_sci'],
        assignedSubjects: ['Mathematics', 'Biology'],
        isClassTeacherOf: 'cls_jss1_a',
      },
      {
        id: 'tch_2',
        schoolId,
        staffId: 'TCH/CHIS/018',
        name: 'Mrs. Folashade Adeyemi',
        email: 'f.adeyemi@crownheights.sch.ng',
        phone: '+234 805 333 4455',
        qualification: 'B.A (Ed) English Literature, Obafemi Awolowo University',
        assignedClasses: ['cls_jss2_a', 'cls_sss2_sci'],
        assignedSubjects: ['English Language', 'Civic Education', 'Economics'],
        isClassTeacherOf: 'cls_jss2_a',
      },
      {
        id: 'tch_3',
        schoolId,
        staffId: 'TCH/CHIS/025',
        name: 'Dr. Aminu Garba',
        email: 'a.garba@crownheights.sch.ng',
        phone: '+234 809 444 5566',
        qualification: 'Ph.D Physics, Ahmadu Bello University, Zaria',
        assignedClasses: ['cls_jss2_a', 'cls_sss1_sci', 'cls_sss2_sci'],
        assignedSubjects: ['Basic Science & Technology', 'Physics', 'Chemistry'],
      },
    ],
    students: [
      {
        id: 'std_1',
        schoolId,
        admissionNo: 'CHIS/2023/042',
        firstName: 'Toluwanimi',
        lastName: 'Adeleke',
        otherNames: 'Oluwaseun',
        gender: 'Female',
        dob: '2011-04-18',
        classId: 'cls_jss2_a',
        className: 'JSS 2',
        arm: 'Gold',
        parentId: 'par_1',
        parentName: 'Chief Olatunji Adeleke',
        parentPhone: '+234 803 777 8899',
        parentEmail: 'tunji.adeleke@gmail.com',
        emergencyContact: {
          name: 'Mrs. Funke Adeleke',
          phone: '+234 802 333 7788',
          relationship: 'Mother',
        },
        address: '12 Victoria Garden City (VGC), Lekki, Lagos',
        bloodGroup: 'O+',
        medicalNotes: 'Mild asthma, carries inhaler',
        admissionDate: '2023-09-11',
        status: 'active',
      },
      {
        id: 'std_2',
        schoolId,
        admissionNo: 'CHIS/2022/019',
        firstName: 'Emeka',
        lastName: 'Eze',
        otherNames: 'Kelechi',
        gender: 'Male',
        dob: '2009-08-24',
        classId: 'cls_sss2_sci',
        className: 'SSS 2',
        arm: 'Science',
        parentId: 'par_2',
        parentName: 'Mr. Jude Eze',
        parentPhone: '+234 803 999 0011',
        parentEmail: 'jude.eze@yahoo.com',
        emergencyContact: {
          name: 'Mr. Jude Eze',
          phone: '+234 803 999 0011',
          relationship: 'Father',
        },
        address: '8 Chevron Drive, Lekki, Lagos',
        bloodGroup: 'A+',
        medicalNotes: 'No known allergies',
        admissionDate: '2022-09-12',
        status: 'active',
      },
      {
        id: 'std_3',
        schoolId,
        admissionNo: 'CHIS/2023/058',
        firstName: 'Zainab',
        lastName: 'Danjuma',
        otherNames: 'Fatima',
        gender: 'Female',
        dob: '2011-11-05',
        classId: 'cls_jss2_a',
        className: 'JSS 2',
        arm: 'Gold',
        parentId: 'par_3',
        parentName: 'Hajiya Maryam Danjuma',
        parentPhone: '+234 808 123 9876',
        parentEmail: 'maryam.danjuma@gmail.com',
        emergencyContact: {
          name: 'Hajiya Maryam Danjuma',
          phone: '+234 808 123 9876',
          relationship: 'Mother',
        },
        address: '4 Ikate Elegushi, Lekki, Lagos',
        bloodGroup: 'B+',
        medicalNotes: 'Allergic to penicillin',
        admissionDate: '2023-09-11',
        status: 'active',
      },
      {
        id: 'std_4',
        schoolId,
        admissionNo: 'CHIS/2022/031',
        firstName: 'Blessing',
        lastName: 'Okon',
        otherNames: 'Aniekan',
        gender: 'Female',
        dob: '2009-03-14',
        classId: 'cls_sss2_sci',
        className: 'SSS 2',
        arm: 'Science',
        parentId: 'par_4',
        parentName: 'Elder Bassey Okon',
        parentPhone: '+234 802 444 6688',
        parentEmail: 'bassey.okon@gmail.com',
        emergencyContact: {
          name: 'Elder Bassey Okon',
          phone: '+234 802 444 6688',
          relationship: 'Father',
        },
        address: '22 Agungi Road, Lekki, Lagos',
        bloodGroup: 'O+',
        medicalNotes: 'None',
        admissionDate: '2022-09-12',
        status: 'active',
      },
    ],
    parents: [
      {
        id: 'par_1',
        schoolId,
        name: 'Chief Olatunji Adeleke',
        email: 'tunji.adeleke@gmail.com',
        phone: '+234 803 777 8899',
        occupation: 'Civil Engineer & Consultant',
        relationship: 'Father',
        address: '12 Victoria Garden City (VGC), Lekki, Lagos',
        linkedStudentIds: ['std_1'],
      },
      {
        id: 'par_2',
        schoolId,
        name: 'Mr. Jude Eze',
        email: 'jude.eze@yahoo.com',
        phone: '+234 803 999 0011',
        occupation: 'Chartered Accountant',
        relationship: 'Father',
        address: '8 Chevron Drive, Lekki, Lagos',
        linkedStudentIds: ['std_2'],
      },
      {
        id: 'par_3',
        schoolId,
        name: 'Hajiya Maryam Danjuma',
        email: 'maryam.danjuma@gmail.com',
        phone: '+234 808 123 9876',
        occupation: 'Business Executive',
        relationship: 'Mother',
        address: '4 Ikate Elegushi, Lekki, Lagos',
        linkedStudentIds: ['std_3'],
      },
      {
        id: 'par_4',
        schoolId,
        name: 'Elder Bassey Okon',
        email: 'bassey.okon@gmail.com',
        phone: '+234 802 444 6688',
        occupation: 'Maritime Logistics Director',
        relationship: 'Father',
        address: '22 Agungi Road, Lekki, Lagos',
        linkedStudentIds: ['std_4'],
      },
    ],
    attendance: [
      {
        id: 'att_2025_02_20_jss2',
        schoolId,
        classId: 'cls_jss2_a',
        className: 'JSS 2',
        arm: 'Gold',
        date: new Date().toISOString().split('T')[0],
        term: '1st Term',
        session: '2024/2025',
        markedByStaffId: 'tch_2',
        markedByStaffName: 'Mrs. Folashade Adeyemi',
        markedAt: new Date().toISOString(),
        records: [
          { studentId: 'std_1', studentName: 'Toluwanimi Adeleke', admissionNo: 'CHIS/2023/042', status: 'present' },
          { studentId: 'std_3', studentName: 'Zainab Danjuma', admissionNo: 'CHIS/2023/058', status: 'present' },
        ],
      },
      {
        id: 'att_2025_02_20_sss2',
        schoolId,
        classId: 'cls_sss2_sci',
        className: 'SSS 2',
        arm: 'Science',
        date: new Date().toISOString().split('T')[0],
        term: '1st Term',
        session: '2024/2025',
        markedByStaffId: 'tch_1',
        markedByStaffName: 'Mr. Chinedu Okafor',
        markedAt: new Date().toISOString(),
        records: [
          { studentId: 'std_2', studentName: 'Emeka Eze', admissionNo: 'CHIS/2022/019', status: 'present' },
          { studentId: 'std_4', studentName: 'Blessing Okon', admissionNo: 'CHIS/2022/031', status: 'late', reason: 'Heavy traffic at Ajah roundabout' },
        ],
      },
    ],
    reportCards: [
      {
        id: 'rep_std_1_2024_term1',
        schoolId,
        studentId: 'std_1',
        studentName: 'Toluwanimi Adeleke',
        admissionNo: 'CHIS/2023/042',
        classId: 'cls_jss2_a',
        className: 'JSS 2',
        arm: 'Gold',
        term: '1st Term',
        session: '2024/2025',
        totalScore: 442,
        averageScore: 88.4,
        classPosition: 1,
        classTotalStudents: 30,
        teacherComment: 'Toluwanimi is an exceptionally hardworking and disciplined student. She participates actively in all lessons.',
        principalComment: 'Outstanding academic excellence. Maintain this exemplary standard.',
        affectiveTraits: {
          punctuality: 5,
          neatness: 5,
          honesty: 5,
          leadership: 4,
          politeness: 5,
          sportsmanship: 4,
        },
        daysPresent: 58,
        daysAbsent: 2,
        nextTermResumptionDate: '2025-01-13',
        status: 'published',
        publishedAt: '2024-12-16T10:00:00.000Z',
        subjects: [
          { subjectId: 'sub_mth', subjectName: 'Mathematics', ca1: 14, ca2: 15, exam: 63, total: 92, grade: 'A1', remark: 'Distinction', position: 1 },
          { subjectId: 'sub_eng', subjectName: 'English Language', ca1: 13, ca2: 14, exam: 58, total: 85, grade: 'A1', remark: 'Distinction', position: 2 },
          { subjectId: 'sub_bst', subjectName: 'Basic Science & Technology', ca1: 14, ca2: 14, exam: 61, total: 89, grade: 'A1', remark: 'Distinction', position: 1 },
          { subjectId: 'sub_cve', subjectName: 'Civic Education', ca1: 15, ca2: 15, exam: 60, total: 90, grade: 'A1', remark: 'Distinction', position: 1 },
          { subjectId: 'sub_bio', subjectName: 'Agricultural Science', ca1: 13, ca2: 13, exam: 60, total: 86, grade: 'A1', remark: 'Distinction', position: 2 },
        ],
      },
      {
        id: 'rep_std_2_2024_term1',
        schoolId,
        studentId: 'std_2',
        studentName: 'Emeka Eze',
        admissionNo: 'CHIS/2022/019',
        classId: 'cls_sss2_sci',
        className: 'SSS 2',
        arm: 'Science',
        term: '1st Term',
        session: '2024/2025',
        totalScore: 421,
        averageScore: 84.2,
        classPosition: 2,
        classTotalStudents: 25,
        teacherComment: 'Emeka displays keen aptitude for physics and analytical thinking. Very focused in class.',
        principalComment: 'A very commendable term. Keep striving for distinction in all subjects.',
        affectiveTraits: {
          punctuality: 4,
          neatness: 5,
          honesty: 5,
          leadership: 5,
          politeness: 5,
          sportsmanship: 5,
        },
        daysPresent: 59,
        daysAbsent: 1,
        nextTermResumptionDate: '2025-01-13',
        status: 'published',
        publishedAt: '2024-12-16T10:00:00.000Z',
        subjects: [
          { subjectId: 'sub_mth', subjectName: 'Mathematics', ca1: 14, ca2: 14, exam: 60, total: 88, grade: 'A1', remark: 'Distinction', position: 2 },
          { subjectId: 'sub_phy', subjectName: 'Physics', ca1: 15, ca2: 14, exam: 64, total: 93, grade: 'A1', remark: 'Distinction', position: 1 },
          { subjectId: 'sub_chm', subjectName: 'Chemistry', ca1: 13, ca2: 13, exam: 57, total: 83, grade: 'A1', remark: 'Distinction', position: 3 },
          { subjectId: 'sub_bio', subjectName: 'Biology', ca1: 12, ca2: 13, exam: 55, total: 80, grade: 'A1', remark: 'Distinction', position: 2 },
          { subjectId: 'sub_eng', subjectName: 'English Language', ca1: 12, ca2: 12, exam: 53, total: 77, grade: 'A1', remark: 'Distinction', position: 4 },
        ],
      },
    ],
    assignments: [
      {
        id: 'asg_mth_jss2_01',
        schoolId,
        title: 'Quadratic Algebraic Expansions & Word Problems',
        subjectName: 'Mathematics',
        classId: 'cls_jss2_a',
        className: 'JSS 2',
        arm: 'Gold',
        teacherId: 'tch_1',
        teacherName: 'Mr. Chinedu Okafor',
        description: 'Complete Exercise 4.2 in New General Mathematics (pages 48-50), numbers 1 to 15. Show full steps in your submission.',
        dueDate: '2025-02-28',
        maxScore: 20,
        createdAt: '2025-02-18T09:00:00.000Z',
        submissionCount: 2,
        attachments: [
          { name: 'Mathematics_Exercise_Guideline.pdf', size: '1.2 MB' },
        ],
      },
      {
        id: 'asg_phy_sss2_01',
        schoolId,
        title: 'Projectile Motion & Trajectory Calculation Lab Report',
        subjectName: 'Physics',
        classId: 'cls_sss2_sci',
        className: 'SSS 2',
        arm: 'Science',
        teacherId: 'tch_3',
        teacherName: 'Dr. Aminu Garba',
        description: 'Write a comprehensive laboratory report on horizontal and angular projectile experiments conducted in the school physics lab.',
        dueDate: '2025-03-05',
        maxScore: 30,
        createdAt: '2025-02-19T11:00:00.000Z',
        submissionCount: 1,
        attachments: [
          { name: 'Physics_Lab_Manual_SSS2.pdf', size: '2.4 MB' },
        ],
      },
    ],
    submissions: [
      {
        id: 'subm_1',
        assignmentId: 'asg_mth_jss2_01',
        studentId: 'std_1',
        studentName: 'Toluwanimi Adeleke',
        admissionNo: 'CHIS/2023/042',
        submissionText: 'Dear Mr. Okafor, please find attached my solutions to Exercise 4.2. I checked all quadratic factors using expansion verification.',
        attachedFile: 'Toluwanimi_Adeleke_Maths_HW4.pdf',
        submittedAt: '2025-02-22T14:20:00.000Z',
        score: 19,
        feedback: 'Excellent work, Toluwanimi. Neat algebraic presentation and correct signs throughout.',
        status: 'graded',
      },
      {
        id: 'subm_2',
        assignmentId: 'asg_phy_sss2_01',
        studentId: 'std_2',
        studentName: 'Emeka Eze',
        admissionNo: 'CHIS/2022/019',
        submissionText: 'Lab Report on Projectile Motion. Includes graphs of range vs projection angle theta plotted using experimental trials.',
        attachedFile: 'Emeka_Eze_Physics_Lab_Projectile.pdf',
        submittedAt: '2025-02-24T18:00:00.000Z',
        score: 28,
        feedback: 'Very thorough analysis of air resistance limitations and clear graphical deduction.',
        status: 'graded',
      },
    ],
    timetables: [
      {
        id: 'tt_jss2_mon',
        schoolId,
        classId: 'cls_jss2_a',
        className: 'JSS 2',
        arm: 'Gold',
        day: 'Monday',
        periods: [
          { periodNumber: 1, time: '08:00 - 08:45', subjectName: 'Mathematics', teacherName: 'Mr. Chinedu Okafor', room: 'Room 204' },
          { periodNumber: 2, time: '08:45 - 09:30', subjectName: 'Mathematics', teacherName: 'Mr. Chinedu Okafor', room: 'Room 204' },
          { periodNumber: 3, time: '09:30 - 10:15', subjectName: 'English Language', teacherName: 'Mrs. Folashade Adeyemi', room: 'Room 204' },
          { periodNumber: 4, time: '10:45 - 11:30', subjectName: 'Basic Science & Tech', teacherName: 'Dr. Aminu Garba', room: 'Science Lab 1' },
          { periodNumber: 5, time: '11:30 - 12:15', subjectName: 'Civic Education', teacherName: 'Mrs. Folashade Adeyemi', room: 'Room 204' },
          { periodNumber: 6, time: '01:00 - 01:45', subjectName: 'Agricultural Science', teacherName: 'Mr. Chinedu Okafor', room: 'School Farm' },
        ],
      },
      {
        id: 'tt_sss2_mon',
        schoolId,
        classId: 'cls_sss2_sci',
        className: 'SSS 2',
        arm: 'Science',
        day: 'Monday',
        periods: [
          { periodNumber: 1, time: '08:00 - 08:45', subjectName: 'Physics', teacherName: 'Dr. Aminu Garba', room: 'Physics Lab' },
          { periodNumber: 2, time: '08:45 - 09:30', subjectName: 'Chemistry', teacherName: 'Dr. Aminu Garba', room: 'Chemistry Lab' },
          { periodNumber: 3, time: '09:30 - 10:15', subjectName: 'Mathematics', teacherName: 'Mr. Chinedu Okafor', room: 'Room 302' },
          { periodNumber: 4, time: '10:45 - 11:30', subjectName: 'English Language', teacherName: 'Mrs. Folashade Adeyemi', room: 'Room 302' },
          { periodNumber: 5, time: '11:30 - 12:15', subjectName: 'Biology', teacherName: 'Mr. Chinedu Okafor', room: 'Biology Lab' },
        ],
      },
    ],
    invoices: [
      {
        id: 'inv_2024_01_std1',
        schoolId,
        studentId: 'std_1',
        studentName: 'Toluwanimi Adeleke',
        admissionNo: 'CHIS/2023/042',
        classId: 'cls_jss2_a',
        className: 'JSS 2 Gold',
        term: '1st Term',
        session: '2024/2025',
        totalAmount: 385000,
        amountPaid: 385000,
        balance: 0,
        dueDate: '2024-10-15',
        status: 'paid',
        createdAt: '2024-09-02T08:00:00.000Z',
        items: [
          { title: 'Tuition & Academic Services', amount: 260000 },
          { title: 'ICT & STEM Laboratory Levy', amount: 45000 },
          { title: 'Textbooks, Stationery & Workbooks', amount: 50000 },
          { title: 'PTA Development Levy', amount: 15000 },
          { title: 'School Clubs & Sports Activity', amount: 15000 },
        ],
      },
      {
        id: 'inv_2024_01_std2',
        schoolId,
        studentId: 'std_2',
        studentName: 'Emeka Eze',
        admissionNo: 'CHIS/2022/019',
        classId: 'cls_sss2_sci',
        className: 'SSS 2 Science',
        term: '1st Term',
        session: '2024/2025',
        totalAmount: 420000,
        amountPaid: 250000,
        balance: 170000,
        dueDate: '2024-10-15',
        status: 'partial',
        createdAt: '2024-09-02T08:00:00.000Z',
        items: [
          { title: 'Senior Secondary Tuition & Practical Lab Fee', amount: 290000 },
          { title: 'WAEC / NECO Science Preparatory Practical', amount: 50000 },
          { title: 'ICT & E-Learning Portal Access', amount: 45000 },
          { title: 'PTA Levy', amount: 15000 },
          { title: 'Medical & Healthcare Retainer', amount: 20000 },
        ],
      },
      {
        id: 'inv_2024_01_std3',
        schoolId,
        studentId: 'std_3',
        studentName: 'Zainab Danjuma',
        admissionNo: 'CHIS/2023/058',
        classId: 'cls_jss2_a',
        className: 'JSS 2 Gold',
        term: '1st Term',
        session: '2024/2025',
        totalAmount: 385000,
        amountPaid: 0,
        balance: 385000,
        dueDate: '2024-10-15',
        status: 'unpaid',
        createdAt: '2024-09-02T08:00:00.000Z',
        items: [
          { title: 'Tuition & Academic Services', amount: 260000 },
          { title: 'ICT & STEM Laboratory Levy', amount: 45000 },
          { title: 'Textbooks, Stationery & Workbooks', amount: 50000 },
          { title: 'PTA Development Levy', amount: 15000 },
          { title: 'School Clubs & Sports Activity', amount: 15000 },
        ],
      },
    ],
    receipts: [
      {
        id: 'rcpt_001_2024',
        invoiceId: 'inv_2024_01_std1',
        studentId: 'std_1',
        studentName: 'Toluwanimi Adeleke',
        admissionNo: 'CHIS/2023/042',
        className: 'JSS 2 Gold',
        amount: 385000,
        paymentMethod: 'Paystack',
        reference: 'PSTK_REF_9812480123',
        verified: true,
        paidAt: '2024-09-10T10:14:00.000Z',
        receiptNumber: 'CHIS-REC-2024-0491',
        verifiedBy: 'Mrs. Ngozi Obi (ACA)',
        notes: 'Full payment confirmed via Paystack gateway.',
      },
      {
        id: 'rcpt_002_2024',
        invoiceId: 'inv_2024_01_std2',
        studentId: 'std_2',
        studentName: 'Emeka Eze',
        admissionNo: 'CHIS/2022/019',
        className: 'SSS 2 Science',
        amount: 250000,
        paymentMethod: 'Bank Transfer',
        reference: 'ZENITH_NIP_TRF_4901284',
        verified: true,
        paidAt: '2024-09-18T16:32:00.000Z',
        receiptNumber: 'CHIS-REC-2024-0518',
        verifiedBy: 'Mrs. Ngozi Obi (ACA)',
        notes: 'First instalment received in Zenith Bank collection account.',
      },
    ],
    announcements: [
      {
        id: 'ann_01',
        schoolId,
        title: 'Mid-Term Break & Open Day Exhibition Schedule',
        content: 'Dear Parents and Guardians, please be informed that our Open Day and Mid-Term academic consultation will hold this Thursday from 9:00 AM to 2:00 PM. The Mid-Term break commences on Friday. Classes resume the following Monday.',
        targetRole: 'all',
        priority: 'urgent',
        authorName: 'Dr. Babatunde Alabi',
        authorRole: 'School Administrator',
        createdAt: '2025-02-15T08:00:00.000Z',
      },
      {
        id: 'ann_02',
        schoolId,
        title: 'Submission of Continuous Assessment (CA 2) Test Scores',
        content: 'All teachers are kindly requested to complete the entry of Continuous Assessment (CA 2) scores into the Sch Connect portal before Friday close of business. Result collation for termly report cards will commence immediately.',
        targetRole: 'teachers',
        priority: 'normal',
        authorName: 'Dr. Babatunde Alabi',
        authorRole: 'School Administrator',
        createdAt: '2025-02-17T12:00:00.000Z',
      },
      {
        id: 'ann_03',
        schoolId,
        title: 'Annual Inter-House Athletics & Sports Fiesta 2025',
        content: 'Crown Heights International School invites all students, parents, and friends to our 14th Annual Inter-House Sports Fiesta at the school sports complex. Blue House, Green House, Yellow House, and Red House will compete for the overall championship shield.',
        targetRole: 'all',
        priority: 'normal',
        authorName: 'Sports Department',
        authorRole: 'Staff Coordinator',
        createdAt: '2025-02-19T14:30:00.000Z',
      },
    ],
    events: [
      {
        id: 'evt_01',
        schoolId,
        title: 'Parents-Teachers Association (PTA) General Meeting',
        date: '2025-03-08',
        time: '10:00 AM - 1:00 PM',
        category: 'PTA',
        description: 'Deliberations on school infrastructure enhancements, student bus routes, and end-of-year graduation arrangements.',
      },
      {
        id: 'evt_02',
        schoolId,
        title: 'First Term Final Examinations Begin',
        date: '2025-03-24',
        time: '08:30 AM Daily',
        category: 'Exam',
        description: 'Comprehensive examinations across all classes. Timetable published in Sch Connect portal.',
      },
      {
        id: 'evt_03',
        schoolId,
        title: 'Inter-House Sports Heat Trials',
        date: '2025-03-12',
        time: '01:00 PM - 04:00 PM',
        category: 'Sports',
        description: 'Track and field preliminary heats for junior and senior categories.',
      },
    ],
    messages: [
      {
        id: 'msg_01',
        schoolId,
        parentId: 'par_1',
        parentName: 'Chief Olatunji Adeleke',
        studentName: 'Toluwanimi Adeleke',
        subject: 'Enquiry Regarding Inter-School Robotics & STEM Competition',
        message: 'Good day administration, I would like to know if Toluwanimi has been selected as part of the school team representing Crown Heights at the Lagos State Robotics Olympiad.',
        reply: 'Good day Chief Adeleke. Yes, Toluwanimi demonstrated top analytical scores in her STEM tests and is part of the 5-student team representing the school. Preparations commence next Wednesday after school.',
        repliedBy: 'Dr. Babatunde Alabi',
        repliedAt: '2025-02-16T11:20:00.000Z',
        status: 'resolved',
        createdAt: '2025-02-15T15:10:00.000Z',
      },
    ],
    auditLogs: [
      {
        id: 'aud_01',
        schoolId,
        userId: 'usr_admin',
        userName: 'Dr. Babatunde Alabi',
        userRole: 'Administrator',
        action: 'Term Configuration',
        details: 'Configured 2024/2025 academic calendar and published 1st term timetable.',
        timestamp: '2024-09-01T08:30:00.000Z',
      },
      {
        id: 'aud_02',
        schoolId,
        userId: 'usr_bur_1',
        userName: 'Mrs. Ngozi Obi (ACA)',
        userRole: 'Bursar',
        action: 'Fee Verification',
        details: 'Verified receipt CHIS-REC-2024-0491 for student Toluwanimi Adeleke (₦385,000.00).',
        timestamp: '2024-09-10T10:15:00.000Z',
      },
    ],
  };
}

// Database Helper
let dbCache: any;

function loadDb(): any {
  if (dbCache) return dbCache;
  if (!fs.existsSync(DB_FILE)) {
    dbCache = getInitialSeedData();
    saveDb(dbCache);
    return dbCache;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    dbCache = JSON.parse(raw);
    return dbCache;
  } catch (err) {
    console.error('Error loading DB file, reinitializing seed data:', err);
    dbCache = getInitialSeedData();
    saveDb(dbCache);
    return dbCache;
  }
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    dbCache = data;
  } catch (err) {
    console.error('Failed to write to DB file:', err);
  }
}

function logAudit(db: any, userId: string, userName: string, userRole: string, action: string, details: string) {
  const newLog = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    schoolId: db.school.id,
    userId,
    userName,
    userRole,
    action,
    details,
    timestamp: new Date().toISOString(),
  };
  db.auditLogs.unshift(newLog);
  if (db.auditLogs.length > 200) db.auditLogs.pop();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // ---------------- API ROUTES ----------------

  // Reset Demo Data
  app.post('/api/reset-demo-data', (req, res) => {
    const fresh = getInitialSeedData();
    saveDb(fresh);
    res.json({ success: true, message: 'Database reset to Nigerian school demo defaults.' });
  });

  // School Profile & Settings
  app.get('/api/school', (req, res) => {
    const db = loadDb();
    res.json(db.school);
  });

  app.put('/api/school', (req, res) => {
    const db = loadDb();
    db.school = { ...db.school, ...req.body };
    logAudit(db, req.body.adminId || 'admin', req.body.adminName || 'Admin', 'Administrator', 'School Profile Update', 'Updated school contact and session settings.');
    saveDb(db);
    res.json(db.school);
  });

  // Auth: Login / Switch Role
  app.post('/api/auth/login', (req, res) => {
    const { email, role, targetUserId } = req.body;
    const db = loadDb();

    // If targetUserId or role is passed for quick-switching
    let user = null;
    if (targetUserId) {
      user = db.users.find((u: any) => u.id === targetUserId);
    } else if (email) {
      user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    } else if (role) {
      user = db.users.find((u: any) => u.role === role);
    }

    if (!user) {
      // Find fallback user by role or first user
      user = db.users.find((u: any) => u.role === (role || 'admin')) || db.users[0];
    }

    res.json({
      success: true,
      user,
      token: `sch_token_${user.id}_${Date.now()}`,
    });
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { name, email, role, phone, inviteCode } = req.body;
    const db = loadDb();

    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required.' });
    }

    // Check if user already exists
    const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      schoolId: db.school.id,
      name,
      email,
      role,
      phone: phone || '',
      status: 'active' as const,
    };

    db.users.push(newUser);
    logAudit(db, newUser.id, name, role, 'User Registration', `New user registered as ${role}.`);
    saveDb(db);

    res.json({
      success: true,
      user: newUser,
      token: `sch_token_${newUser.id}_${Date.now()}`,
    });
  });

  // Auth: Password Reset
  app.post('/api/auth/reset-password', (req, res) => {
    const { email } = req.body;
    const db = loadDb();
    const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'Account not found with this email address.' });
    }
    res.json({
      success: true,
      message: `Password reset verification link and token sent to ${email}. Check your inbox.`,
    });
  });

  // Dashboard Overview Summary
  app.get('/api/dashboard/summary', (req, res) => {
    const db = loadDb();
    const totalStudents = db.students.filter((s: any) => s.status === 'active').length;
    const totalTeachers = db.teachers.length;
    const totalClasses = db.classes.length;

    // Today's attendance stats
    let totalMarked = 0;
    let present = 0;
    let absent = 0;
    let late = 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const todaySheets = db.attendance.filter((a: any) => a.date === todayStr);

    todaySheets.forEach((sheet: any) => {
      sheet.records.forEach((r: any) => {
        totalMarked++;
        if (r.status === 'present') present++;
        else if (r.status === 'absent') absent++;
        else if (r.status === 'late') late++;
      });
    });

    const percentage = totalMarked > 0 ? Math.round(((present + late) / totalMarked) * 100) : 96;

    // Fees calculations
    let totalPendingFees = 0;
    let totalCollectedFees = 0;

    db.invoices.forEach((inv: any) => {
      totalCollectedFees += inv.amountPaid || 0;
      totalPendingFees += inv.balance || 0;
    });

    res.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      todayAttendance: {
        totalMarked: totalMarked || totalStudents,
        present: present || Math.floor(totalStudents * 0.92),
        absent: absent || Math.ceil(totalStudents * 0.05),
        late: late || Math.ceil(totalStudents * 0.03),
        percentage,
      },
      totalPendingFees,
      totalCollectedFees,
      recentAnnouncements: db.announcements.slice(0, 5),
      upcomingEvents: db.events.slice(0, 5),
      recentActivities: db.auditLogs.slice(0, 8),
    });
  });

  // Students CRUD
  app.get('/api/students', (req, res) => {
    const db = loadDb();
    res.json(db.students);
  });

  app.post('/api/students', (req, res) => {
    const db = loadDb();
    const data = req.body;

    const newId = `std_${Date.now()}`;
    const nextAdmissionNo = `CHIS/${new Date().getFullYear()}/${String(db.students.length + 1).padStart(3, '0')}`;

    const newStudent = {
      id: newId,
      schoolId: db.school.id,
      admissionNo: data.admissionNo || nextAdmissionNo,
      firstName: data.firstName,
      lastName: data.lastName,
      otherNames: data.otherNames || '',
      gender: data.gender || 'Male',
      dob: data.dob || '2012-01-01',
      classId: data.classId,
      className: data.className || 'JSS 1',
      arm: data.arm || 'Gold',
      parentId: data.parentId || '',
      parentName: data.parentName || '',
      parentPhone: data.parentPhone || '',
      parentEmail: data.parentEmail || '',
      emergencyContact: data.emergencyContact || {
        name: data.parentName || 'Parent',
        phone: data.parentPhone || '',
        relationship: 'Parent',
      },
      address: data.address || 'Lagos, Nigeria',
      bloodGroup: data.bloodGroup || 'O+',
      medicalNotes: data.medicalNotes || '',
      admissionDate: data.admissionDate || new Date().toISOString().split('T')[0],
      status: 'active',
    };

    db.students.unshift(newStudent);

    // Also create or link parent if provided
    if (data.parentName && data.parentEmail && !data.parentId) {
      const parentId = `par_${Date.now()}`;
      newStudent.parentId = parentId;
      db.parents.push({
        id: parentId,
        schoolId: db.school.id,
        name: data.parentName,
        email: data.parentEmail,
        phone: data.parentPhone || '',
        occupation: 'Parent / Guardian',
        relationship: 'Father',
        address: data.address || '',
        linkedStudentIds: [newStudent.id],
      });
    }

    logAudit(db, req.body.operatorId || 'admin', req.body.operatorName || 'Admin', 'Administrator', 'Student Registration', `Enrolled student ${newStudent.firstName} ${newStudent.lastName} (${newStudent.admissionNo}).`);
    saveDb(db);
    res.json(newStudent);
  });

  app.put('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDb();
    const idx = db.students.findIndex((s: any) => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Student not found.' });

    db.students[idx] = { ...db.students[idx], ...req.body };
    logAudit(db, req.body.operatorId || 'admin', req.body.operatorName || 'Admin', 'Administrator', 'Student Record Update', `Updated details for ${db.students[idx].firstName} ${db.students[idx].lastName}.`);
    saveDb(db);
    res.json(db.students[idx]);
  });

  app.delete('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDb();
    const student = db.students.find((s: any) => s.id === id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    db.students = db.students.filter((s: any) => s.id !== id);
    logAudit(db, 'admin', 'Admin', 'Administrator', 'Student Deletion', `Removed student record ${student.firstName} ${student.lastName} (${student.admissionNo}).`);
    saveDb(db);
    res.json({ success: true, message: 'Student removed successfully.' });
  });

  // Promote Students
  app.post('/api/students/promote', (req, res) => {
    const { studentIds, targetClassId, targetClassName, targetArm } = req.body;
    const db = loadDb();

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'Please select students to promote.' });
    }

    let count = 0;
    db.students.forEach((s: any) => {
      if (studentIds.includes(s.id)) {
        s.classId = targetClassId;
        s.className = targetClassName;
        s.arm = targetArm;
        count++;
      }
    });

    logAudit(db, 'admin', 'Admin', 'Administrator', 'Student Promotion', `Promoted ${count} students to ${targetClassName} ${targetArm}.`);
    saveDb(db);
    res.json({ success: true, promotedCount: count });
  });

  // Teachers CRUD
  app.get('/api/teachers', (req, res) => {
    const db = loadDb();
    res.json(db.teachers);
  });

  app.post('/api/teachers', (req, res) => {
    const db = loadDb();
    const data = req.body;

    const newTeacher = {
      id: `tch_${Date.now()}`,
      schoolId: db.school.id,
      staffId: data.staffId || `TCH/CHIS/${String(db.teachers.length + 1).padStart(3, '0')}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      qualification: data.qualification || 'B.Ed, University of Lagos',
      assignedClasses: data.assignedClasses || [],
      assignedSubjects: data.assignedSubjects || [],
      isClassTeacherOf: data.isClassTeacherOf || undefined,
    };

    db.teachers.push(newTeacher);

    // Create user login account for teacher
    db.users.push({
      id: `usr_${newTeacher.id}`,
      schoolId: db.school.id,
      name: newTeacher.name,
      email: newTeacher.email,
      role: 'teacher',
      phone: newTeacher.phone,
      status: 'active',
      linkedEntityId: newTeacher.id,
    });

    logAudit(db, 'admin', 'Admin', 'Administrator', 'Staff Appointment', `Registered new teacher ${newTeacher.name} (${newTeacher.staffId}).`);
    saveDb(db);
    res.json(newTeacher);
  });

  app.put('/api/teachers/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDb();
    const idx = db.teachers.findIndex((t: any) => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Teacher not found.' });

    db.teachers[idx] = { ...db.teachers[idx], ...req.body };
    logAudit(db, 'admin', 'Admin', 'Administrator', 'Staff Record Update', `Updated teacher record for ${db.teachers[idx].name}.`);
    saveDb(db);
    res.json(db.teachers[idx]);
  });

  // Parents
  app.get('/api/parents', (req, res) => {
    const db = loadDb();
    res.json(db.parents);
  });

  // Classes & Subjects
  app.get('/api/classes', (req, res) => {
    const db = loadDb();
    res.json(db.classes);
  });

  app.post('/api/classes', (req, res) => {
    const db = loadDb();
    const data = req.body;
    const newClass = {
      id: `cls_${Date.now()}`,
      schoolId: db.school.id,
      name: data.name,
      arm: data.arm,
      level: data.level || 'Junior Secondary',
      classTeacherId: data.classTeacherId || '',
      classTeacherName: data.classTeacherName || '',
      studentCount: 0,
      capacity: data.capacity || 35,
    };
    db.classes.push(newClass);
    logAudit(db, 'admin', 'Admin', 'Administrator', 'Class Setup', `Created new class ${newClass.name} ${newClass.arm}.`);
    saveDb(db);
    res.json(newClass);
  });

  app.get('/api/subjects', (req, res) => {
    const db = loadDb();
    res.json(db.subjects);
  });

  app.post('/api/subjects', (req, res) => {
    const db = loadDb();
    const data = req.body;
    const newSubject = {
      id: `sub_${Date.now()}`,
      schoolId: db.school.id,
      name: data.name,
      code: data.code,
      level: data.level || 'Junior Secondary',
      category: data.category || 'General',
      assignedTeacherId: data.assignedTeacherId || '',
      assignedTeacherName: data.assignedTeacherName || '',
    };
    db.subjects.push(newSubject);
    logAudit(db, 'admin', 'Admin', 'Administrator', 'Subject Setup', `Added curriculum subject ${newSubject.name} (${newSubject.code}).`);
    saveDb(db);
    res.json(newSubject);
  });

  // Attendance
  app.get('/api/attendance', (req, res) => {
    const { classId, date } = req.query;
    const db = loadDb();

    let list = db.attendance;
    if (classId) {
      list = list.filter((a: any) => a.classId === classId);
    }
    if (date) {
      list = list.filter((a: any) => a.date === date);
    }
    res.json(list);
  });

  app.post('/api/attendance', (req, res) => {
    const { classId, className, arm, date, term, session, records, markedByStaffId, markedByStaffName } = req.body;
    const db = loadDb();

    // Check if attendance already recorded for this class and date
    const existingIdx = db.attendance.findIndex((a: any) => a.classId === classId && a.date === date);

    const sheetData = {
      id: existingIdx !== -1 ? db.attendance[existingIdx].id : `att_${Date.now()}`,
      schoolId: db.school.id,
      classId,
      className,
      arm,
      date,
      term: term || db.school.currentTerm,
      session: session || db.school.currentSession,
      records,
      markedByStaffId,
      markedByStaffName,
      markedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      db.attendance[existingIdx] = sheetData;
    } else {
      db.attendance.push(sheetData);
    }

    logAudit(db, markedByStaffId, markedByStaffName, 'Teacher', 'Attendance Submission', `Recorded daily attendance for ${className} ${arm} on ${date}.`);
    saveDb(db);
    res.json(sheetData);
  });

  // Results & Report Cards
  app.get('/api/results', (req, res) => {
    const { studentId, classId, term, session } = req.query;
    const db = loadDb();

    let list = db.reportCards;
    if (studentId) {
      list = list.filter((r: any) => r.studentId === studentId);
    }
    if (classId) {
      list = list.filter((r: any) => r.classId === classId);
    }
    if (term) {
      list = list.filter((r: any) => r.term === term);
    }
    if (session) {
      list = list.filter((r: any) => r.session === session);
    }
    res.json(list);
  });

  app.post('/api/results', (req, res) => {
    const data = req.body;
    const db = loadDb();

    // Find if report card exists for this student, term and session
    const existingIdx = db.reportCards.findIndex(
      (r: any) => r.studentId === data.studentId && r.term === data.term && r.session === data.session
    );

    const reportCard = {
      id: existingIdx !== -1 ? db.reportCards[existingIdx].id : `rep_${Date.now()}`,
      schoolId: db.school.id,
      studentId: data.studentId,
      studentName: data.studentName,
      admissionNo: data.admissionNo,
      classId: data.classId,
      className: data.className,
      arm: data.arm,
      term: data.term || db.school.currentTerm,
      session: data.session || db.school.currentSession,
      subjects: data.subjects || [],
      totalScore: data.totalScore || 0,
      averageScore: data.averageScore || 0,
      classPosition: data.classPosition || 1,
      classTotalStudents: data.classTotalStudents || 30,
      teacherComment: data.teacherComment || 'Satisfactory academic effort.',
      principalComment: data.principalComment || 'Promising result. Keep up the high standard.',
      affectiveTraits: data.affectiveTraits || {
        punctuality: 5,
        neatness: 5,
        honesty: 5,
        leadership: 4,
        politeness: 5,
        sportsmanship: 4,
      },
      daysPresent: data.daysPresent || 58,
      daysAbsent: data.daysAbsent || 2,
      nextTermResumptionDate: data.nextTermResumptionDate || '2025-01-13',
      status: data.status || 'draft',
      publishedAt: data.status === 'published' ? new Date().toISOString() : undefined,
    };

    if (existingIdx !== -1) {
      db.reportCards[existingIdx] = reportCard;
    } else {
      db.reportCards.push(reportCard);
    }

    logAudit(db, data.staffId || 'admin', data.staffName || 'Staff', 'Staff', 'Result Update', `Recorded academic scores for ${reportCard.studentName} (${reportCard.className}).`);
    saveDb(db);
    res.json(reportCard);
  });

  app.post('/api/results/publish-batch', (req, res) => {
    const { classId, term, session } = req.body;
    const db = loadDb();

    let publishedCount = 0;
    db.reportCards.forEach((r: any) => {
      if ((!classId || r.classId === classId) && (!term || r.term === term) && (!session || r.session === session)) {
        r.status = 'published';
        r.publishedAt = new Date().toISOString();
        publishedCount++;
      }
    });

    logAudit(db, 'admin', 'Admin', 'Administrator', 'Results Publication', `Published ${publishedCount} report cards for ${term} ${session}.`);
    saveDb(db);
    res.json({ success: true, publishedCount });
  });

  // Assignments & Submissions
  app.get('/api/assignments', (req, res) => {
    const { classId } = req.query;
    const db = loadDb();
    let list = db.assignments;
    if (classId) {
      list = list.filter((a: any) => a.classId === classId);
    }
    res.json(list);
  });

  app.post('/api/assignments', (req, res) => {
    const db = loadDb();
    const data = req.body;

    const newAssignment = {
      id: `asg_${Date.now()}`,
      schoolId: db.school.id,
      title: data.title,
      subjectName: data.subjectName,
      classId: data.classId,
      className: data.className,
      arm: data.arm,
      teacherId: data.teacherId,
      teacherName: data.teacherName,
      description: data.description,
      dueDate: data.dueDate,
      maxScore: data.maxScore || 20,
      createdAt: new Date().toISOString(),
      submissionCount: 0,
      attachments: data.attachments || [],
    };

    db.assignments.unshift(newAssignment);
    logAudit(db, data.teacherId, data.teacherName, 'Teacher', 'Assignment Created', `Posted new assignment "${newAssignment.title}" for ${newAssignment.className}.`);
    saveDb(db);
    res.json(newAssignment);
  });

  app.get('/api/submissions', (req, res) => {
    const { assignmentId, studentId } = req.query;
    const db = loadDb();
    let list = db.submissions;
    if (assignmentId) {
      list = list.filter((s: any) => s.assignmentId === assignmentId);
    }
    if (studentId) {
      list = list.filter((s: any) => s.studentId === studentId);
    }
    res.json(list);
  });

  app.post('/api/submissions', (req, res) => {
    const db = loadDb();
    const data = req.body;

    const newSubm = {
      id: `subm_${Date.now()}`,
      assignmentId: data.assignmentId,
      studentId: data.studentId,
      studentName: data.studentName,
      admissionNo: data.admissionNo,
      submissionText: data.submissionText,
      attachedFile: data.attachedFile || '',
      submittedAt: new Date().toISOString(),
      status: 'submitted' as const,
    };

    db.submissions.unshift(newSubm);

    // Update assignment submission count
    const asg = db.assignments.find((a: any) => a.id === data.assignmentId);
    if (asg) {
      asg.submissionCount = (asg.submissionCount || 0) + 1;
    }

    logAudit(db, data.studentId, data.studentName, 'Student', 'Homework Submission', `Submitted answers for assignment: ${asg?.title || ''}.`);
    saveDb(db);
    res.json(newSubm);
  });

  app.put('/api/submissions/:id/grade', (req, res) => {
    const { id } = req.params;
    const { score, feedback, teacherName, teacherId } = req.body;
    const db = loadDb();

    const subm = db.submissions.find((s: any) => s.id === id);
    if (!subm) return res.status(404).json({ error: 'Submission not found.' });

    subm.score = score;
    subm.feedback = feedback;
    subm.status = 'graded';

    logAudit(db, teacherId || 'teacher', teacherName || 'Teacher', 'Teacher', 'Homework Grading', `Graded submission by ${subm.studentName} (Score: ${score}).`);
    saveDb(db);
    res.json(subm);
  });

  // Timetables
  app.get('/api/timetables', (req, res) => {
    const { classId } = req.query;
    const db = loadDb();
    let list = db.timetables;
    if (classId) {
      list = list.filter((t: any) => t.classId === classId);
    }
    res.json(list);
  });

  app.post('/api/timetables', (req, res) => {
    const db = loadDb();
    const data = req.body;

    // Check collision or existing
    const existingIdx = db.timetables.findIndex(
      (t: any) => t.classId === data.classId && t.day === data.day
    );

    const entry = {
      id: existingIdx !== -1 ? db.timetables[existingIdx].id : `tt_${Date.now()}`,
      schoolId: db.school.id,
      classId: data.classId,
      className: data.className,
      arm: data.arm,
      day: data.day,
      periods: data.periods,
    };

    if (existingIdx !== -1) {
      db.timetables[existingIdx] = entry;
    } else {
      db.timetables.push(entry);
    }

    logAudit(db, 'admin', 'Admin', 'Administrator', 'Timetable Schedule', `Updated timetable for ${entry.className} on ${entry.day}.`);
    saveDb(db);
    res.json(entry);
  });

  // Fees, Invoices & Payments
  app.get('/api/invoices', (req, res) => {
    const { studentId, classId } = req.query;
    const db = loadDb();
    let list = db.invoices;
    if (studentId) {
      list = list.filter((i: any) => i.studentId === studentId);
    }
    if (classId) {
      list = list.filter((i: any) => i.classId === classId);
    }
    res.json(list);
  });

  app.post('/api/invoices', (req, res) => {
    const db = loadDb();
    const data = req.body;

    const totalAmount = (data.items || []).reduce((acc: number, item: any) => acc + (Number(item.amount) || 0), 0);

    const newInvoice = {
      id: `inv_${Date.now()}`,
      schoolId: db.school.id,
      studentId: data.studentId,
      studentName: data.studentName,
      admissionNo: data.admissionNo,
      classId: data.classId,
      className: data.className,
      term: data.term || db.school.currentTerm,
      session: data.session || db.school.currentSession,
      items: data.items || [],
      totalAmount,
      amountPaid: 0,
      balance: totalAmount,
      dueDate: data.dueDate || '2025-04-15',
      status: 'unpaid' as const,
      createdAt: new Date().toISOString(),
    };

    db.invoices.unshift(newInvoice);
    logAudit(db, req.body.bursarId || 'bursar', req.body.bursarName || 'Bursar', 'Bursar', 'Invoice Issued', `Issued term invoice of ₦${totalAmount.toLocaleString()} to ${newInvoice.studentName}.`);
    saveDb(db);
    res.json(newInvoice);
  });

  app.get('/api/receipts', (req, res) => {
    const { studentId, invoiceId } = req.query;
    const db = loadDb();
    let list = db.receipts;
    if (studentId) {
      list = list.filter((r: any) => r.studentId === studentId);
    }
    if (invoiceId) {
      list = list.filter((r: any) => r.invoiceId === invoiceId);
    }
    res.json(list);
  });

  // Process Fee Payment (Paystack / Flutterwave / Bank Transfer simulation with instant verified receipt)
  app.post('/api/payments/process', (req, res) => {
    const { invoiceId, amount, paymentMethod, reference, payerName, bursarId, bursarName, notes } = req.body;
    const db = loadDb();

    const invoice = db.invoices.find((i: any) => i.id === invoiceId);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found.' });

    const payAmount = Number(amount);
    if (payAmount <= 0) return res.status(400).json({ error: 'Payment amount must be greater than zero.' });

    const generatedRef = reference || `PSTK_TRX_${Date.now()}_${Math.floor(Math.random() * 899999 + 100000)}`;
    const receiptNum = `CHIS-REC-${new Date().getFullYear()}-${String(db.receipts.length + 500).padStart(4, '0')}`;

    // Update invoice figures
    invoice.amountPaid = (invoice.amountPaid || 0) + payAmount;
    invoice.balance = Math.max(0, invoice.totalAmount - invoice.amountPaid);
    if (invoice.balance === 0) {
      invoice.status = 'paid';
    } else {
      invoice.status = 'partial';
    }

    const newReceipt = {
      id: `rcpt_${Date.now()}`,
      invoiceId: invoice.id,
      studentId: invoice.studentId,
      studentName: invoice.studentName,
      admissionNo: invoice.admissionNo,
      className: invoice.className,
      amount: payAmount,
      paymentMethod: paymentMethod || 'Paystack',
      reference: generatedRef,
      verified: true,
      paidAt: new Date().toISOString(),
      receiptNumber: receiptNum,
      verifiedBy: bursarName || 'Sch Connect Automated Gateway',
      notes: notes || `Payment confirmed for ${invoice.term} school fees.`,
    };

    db.receipts.unshift(newReceipt);

    logAudit(
      db,
      bursarId || 'system',
      payerName || bursarName || 'Payer',
      'Payment Gateway',
      'School Fee Payment',
      `Processed payment of ₦${payAmount.toLocaleString()} for ${invoice.studentName} (${newReceipt.receiptNumber}).`
    );

    saveDb(db);
    res.json({
      success: true,
      message: 'Payment successfully processed and verified.',
      receipt: newReceipt,
      updatedInvoice: invoice,
    });
  });

  // Announcements
  app.get('/api/announcements', (req, res) => {
    const db = loadDb();
    res.json(db.announcements);
  });

  app.post('/api/announcements', (req, res) => {
    const db = loadDb();
    const data = req.body;

    const newAnn = {
      id: `ann_${Date.now()}`,
      schoolId: db.school.id,
      title: data.title,
      content: data.content,
      targetRole: data.targetRole || 'all',
      targetClassId: data.targetClassId || undefined,
      priority: data.priority || 'normal',
      authorName: data.authorName || 'School Administration',
      authorRole: data.authorRole || 'Administrator',
      createdAt: new Date().toISOString(),
    };

    db.announcements.unshift(newAnn);
    logAudit(db, data.authorId || 'admin', newAnn.authorName, newAnn.authorRole, 'Announcement Broadcast', `Published notice: "${newAnn.title}".`);
    saveDb(db);
    res.json(newAnn);
  });

  // School Events & Calendar
  app.get('/api/events', (req, res) => {
    const db = loadDb();
    res.json(db.events);
  });

  app.post('/api/events', (req, res) => {
    const db = loadDb();
    const data = req.body;

    const newEvent = {
      id: `evt_${Date.now()}`,
      schoolId: db.school.id,
      title: data.title,
      date: data.date,
      time: data.time || '09:00 AM',
      category: data.category || 'Academic',
      description: data.description || '',
    };

    db.events.push(newEvent);
    logAudit(db, 'admin', 'Admin', 'Administrator', 'Event Calendar Update', `Scheduled event "${newEvent.title}" on ${newEvent.date}.`);
    saveDb(db);
    res.json(newEvent);
  });

  // Parent Messages & Enquiries
  app.get('/api/messages', (req, res) => {
    const { parentId } = req.query;
    const db = loadDb();
    let list = db.messages;
    if (parentId) {
      list = list.filter((m: any) => m.parentId === parentId);
    }
    res.json(list);
  });

  app.post('/api/messages', (req, res) => {
    const db = loadDb();
    const data = req.body;

    const newMsg = {
      id: `msg_${Date.now()}`,
      schoolId: db.school.id,
      parentId: data.parentId,
      parentName: data.parentName,
      studentName: data.studentName,
      subject: data.subject,
      message: data.message,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    db.messages.unshift(newMsg);
    saveDb(db);
    res.json(newMsg);
  });

  app.put('/api/messages/:id/reply', (req, res) => {
    const { id } = req.params;
    const { reply, repliedBy } = req.body;
    const db = loadDb();

    const msg = db.messages.find((m: any) => m.id === id);
    if (!msg) return res.status(404).json({ error: 'Message not found.' });

    msg.reply = reply;
    msg.repliedBy = repliedBy || 'School Administration';
    msg.repliedAt = new Date().toISOString();
    msg.status = 'resolved';

    saveDb(db);
    res.json(msg);
  });

  // Audit Logs
  app.get('/api/audit-logs', (req, res) => {
    const db = loadDb();
    res.json(db.auditLogs);
  });

  // ---------------- VITE / STATIC SERVING ----------------
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sch Connect server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
