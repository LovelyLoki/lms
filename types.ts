
export enum UserRole {
  Student = 'Student',
  Teacher = 'Teacher',
  Administrator = 'Administrator',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Assignment {
  id: string;
  title: string;
  prompt: string;
}

export interface Module {
  id:string;
  title: string;
  description: string;
  content: string;
  assignments: Assignment[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  enrolledStudentIds: string[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  courseId: string;
  content: string;
  grade: number | null;
  feedback: string | null;
  submittedAt: Date;
}
