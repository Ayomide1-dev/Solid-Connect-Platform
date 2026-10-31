export const ASSETS = {
  logo: '/src/assets/images/sch_connect_logo_1793451675033.jpg',
  studentsHero: '/src/assets/images/nigerian_students_learning_1793451677259.jpg',
  campusExterior: '/src/assets/images/school_campus_exterior_1793451677088.jpg',
  teacherClassroom: '/src/assets/images/teacher_in_classroom_1793451677471.jpg',
};

export const NIGERIAN_CURRENCY = '₦';

export const formatNaira = (amount: number): string => {
  return `${NIGERIAN_CURRENCY}${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const SESSIONS = ['2023/2024', '2024/2025', '2025/2026'];
export const TERMS = ['1st Term', '2nd Term', '3rd Term'];

export const WAEC_GRADING_SCALE = [
  { grade: 'A1', minScore: 75, maxScore: 100, remark: 'Distinction', points: 9 },
  { grade: 'B2', minScore: 70, maxScore: 74, remark: 'Very Good', points: 8 },
  { grade: 'B3', minScore: 65, maxScore: 69, remark: 'Good', points: 7 },
  { grade: 'C4', minScore: 60, maxScore: 64, remark: 'Credit', points: 6 },
  { grade: 'C5', minScore: 55, maxScore: 59, remark: 'Credit', points: 5 },
  { grade: 'C6', minScore: 50, maxScore: 54, remark: 'Credit', points: 4 },
  { grade: 'D7', minScore: 45, maxScore: 49, remark: 'Pass', points: 3 },
  { grade: 'E8', minScore: 40, maxScore: 44, remark: 'Pass', points: 2 },
  { grade: 'F9', minScore: 0, maxScore: 39, remark: 'Fail', points: 0 },
];

export const calculateGrade = (score: number) => {
  const rounded = Math.round(score);
  for (const item of WAEC_GRADING_SCALE) {
    if (rounded >= item.minScore && rounded <= item.maxScore) {
      return item;
    }
  }
  return WAEC_GRADING_SCALE[WAEC_GRADING_SCALE.length - 1];
};

export const DEFAULT_NIGERIAN_CLASSES = [
  { name: 'JSS 1', arm: 'Gold', level: 'Junior Secondary' as const },
  { name: 'JSS 1', arm: 'Diamond', level: 'Junior Secondary' as const },
  { name: 'JSS 2', arm: 'Gold', level: 'Junior Secondary' as const },
  { name: 'JSS 2', arm: 'Diamond', level: 'Junior Secondary' as const },
  { name: 'JSS 3', arm: 'Gold', level: 'Junior Secondary' as const },
  { name: 'SSS 1', arm: 'Science', level: 'Senior Secondary' as const },
  { name: 'SSS 1', arm: 'Arts', level: 'Senior Secondary' as const },
  { name: 'SSS 2', arm: 'Science', level: 'Senior Secondary' as const },
  { name: 'SSS 2', arm: 'Commercial', level: 'Senior Secondary' as const },
  { name: 'SSS 3', arm: 'General', level: 'Senior Secondary' as const },
];

export const DEFAULT_SUBJECTS = [
  { name: 'Mathematics', code: 'MTH', category: 'General' as const, level: 'Junior Secondary' as const },
  { name: 'English Language', code: 'ENG', category: 'General' as const, level: 'Junior Secondary' as const },
  { name: 'Basic Science & Technology', code: 'BST', category: 'Science' as const, level: 'Junior Secondary' as const },
  { name: 'Civic Education', code: 'CVE', category: 'General' as const, level: 'Junior Secondary' as const },
  { name: 'Agricultural Science', code: 'AGR', category: 'Science' as const, level: 'Junior Secondary' as const },
  { name: 'Business Studies', code: 'BUS', category: 'Commercial' as const, level: 'Junior Secondary' as const },
  { name: 'Physics', code: 'PHY', category: 'Science' as const, level: 'Senior Secondary' as const },
  { name: 'Chemistry', code: 'CHM', category: 'Science' as const, level: 'Senior Secondary' as const },
  { name: 'Biology', code: 'BIO', category: 'Science' as const, level: 'Senior Secondary' as const },
  { name: 'Economics', code: 'ECO', category: 'Commercial' as const, level: 'Senior Secondary' as const },
  { name: 'Government', code: 'GOV', category: 'Arts' as const, level: 'Senior Secondary' as const },
  { name: 'Literature in English', code: 'LIT', category: 'Arts' as const, level: 'Senior Secondary' as const },
];
