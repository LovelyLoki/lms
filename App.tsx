
import React, { useState, useCallback, FC, useEffect } from 'react';
import { UserRole, Course, Submission, User } from './types';
import { generateCourse, evaluateSubmission, generateProgressReport, getAiStudyHelp } from './services/geminiService';

import { Login } from './components/Login';
import { LmsHeader } from './components/LmsHeader';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CourseList } from './components/CourseList';
import { CourseDetail } from './components/CourseDetail';
import { CourseCreation } from './components/CourseCreation';
import { ManualCourseCreation, ManualCourseCreationData } from './components/ManualCourseCreation';
import { GradesView } from './components/GradesView';
import { StudyHelperModal } from './components/StudyHelperModal';
import { ManageStudents } from './components/ManageStudents';

const LmsApp: FC<{
    user: User;
    onLogout: () => void;
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    submissions: Submission[];
    setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
    allUsers: User[];
    onAddStudent: (name: string) => void;
}> = ({ user, onLogout, courses, setCourses, submissions, setSubmissions, allUsers, onAddStudent }) => {
    const [view, setView] = useState('dashboard');
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [studyHelperCourse, setStudyHelperCourse] = useState<Course | null>(null);

    const handleAICourseCreate = useCallback(async (topic: string) => {
        const newCourseData = await generateCourse(topic);
        const newCourse: Course = { ...newCourseData, id: `course-${Date.now()}`, enrolledStudentIds: [] };
        setCourses(prev => [...prev, newCourse]);
    }, [setCourses]);

    const handleManualCourseCreate = useCallback((courseData: ManualCourseCreationData) => {
        const newCourse: Course = {
            ...courseData,
            id: `course-${Date.now()}`,
            enrolledStudentIds: [],
            modules: courseData.modules.map(mod => ({
                ...mod,
                id: `mod-${Date.now()}-${Math.random()}`,
                assignments: mod.assignments.map(ass => ({
                    ...ass,
                    id: `ass-${Date.now()}-${Math.random()}`
                }))
            }))
        };
        setCourses(prev => [...prev, newCourse]);
        setView('courses');
    }, [setCourses]);

    const handleEnroll = useCallback((courseId: string) => {
        setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolledStudentIds: [...c.enrolledStudentIds, user.id] } : c));
    }, [user.id, setCourses]);

    const handleUnenroll = useCallback((courseId: string) => {
        setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolledStudentIds: c.enrolledStudentIds.filter(id => id !== user.id) } : c));
    }, [user.id, setCourses]);

    const handleAssignmentSubmit = useCallback(async (submissionData: Omit<Submission, 'id' | 'submittedAt' | 'grade' | 'feedback'>) => {
        const newSubmission: Submission = { ...submissionData, id: `sub-${Date.now()}`, submittedAt: new Date(), grade: null, feedback: null };
        setSubmissions(prev => [...prev, newSubmission]);
    }, [setSubmissions]);

    const handleEvaluate = useCallback(async (submissionId: string) => {
        const submission = submissions.find(s => s.id === submissionId);
        if (!submission) return;
        const course = courses.find(c => c.id === submission.courseId);
        const assignment = course?.modules.flatMap(m => m.assignments).find(a => a.id === submission.assignmentId);
        if (!assignment) return;

        const { grade, feedback } = await evaluateSubmission(assignment, submission);
        setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, grade, feedback } : s));
    }, [submissions, courses, setSubmissions]);

    const handleGenerateReport = useCallback(async () => {
        return await generateProgressReport(user.name, courses, submissions.filter(s => s.studentId === user.id));
    }, [courses, submissions, user.id, user.name]);

    const handleGetStudyHelp = useCallback(async (course: Course, question: string): Promise<string> => {
        return await getAiStudyHelp(course, question);
    }, []);

    const renderView = () => {
        const selectedCourse = courses.find(c => c.id === selectedCourseId);

        switch (view) {
            case 'dashboard': return <Dashboard user={user} courses={courses} submissions={submissions} setView={setView} setSelectedCourseId={setSelectedCourseId} />;
            case 'courses': return <CourseList courses={courses} user={user} setView={setView} setSelectedCourseId={setSelectedCourseId} onEnroll={handleEnroll} onUnenroll={handleUnenroll} />;
            case 'course-detail': return <CourseDetail course={selectedCourse} submissions={submissions} user={user} setView={setView} onAssignmentSubmit={handleAssignmentSubmit} onShowStudyHelper={setStudyHelperCourse} />;
            case 'create-course': return <CourseCreation setView={setView} onCourseCreate={handleAICourseCreate} />;
            case 'manual-create-course': return <ManualCourseCreation setView={setView} onCourseCreate={handleManualCourseCreate} />;
            case 'grades': return <GradesView courses={courses} submissions={submissions} user={user} onEvaluate={handleEvaluate} onGenerateReport={handleGenerateReport} />;
            case 'manage-students':
                if (user.role !== UserRole.Administrator) return <div>Access Denied</div>;
                return <ManageStudents students={allUsers.filter(u => u.role === UserRole.Student)} onAddStudent={onAddStudent} />;
            default: return <Dashboard user={user} courses={courses} submissions={submissions} setView={setView} setSelectedCourseId={setSelectedCourseId} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-light dark:bg-dark text-slate-800 dark:text-slate-200">
            <LmsHeader user={user} onLogout={onLogout} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar view={view} setView={setView} userRole={user.role} />
                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
                    <div className="max-w-7xl mx-auto">
                        {renderView()}
                    </div>
                </main>
            </div>
            {studyHelperCourse && (
                <StudyHelperModal
                    course={studyHelperCourse}
                    onClose={() => setStudyHelperCourse(null)}
                    onAskAI={handleGetStudyHelp}
                />
            )}
        </div>
    );
};

const defaultUsers: User[] = [
    { id: 'admin-01', name: 'admin', role: UserRole.Administrator },
    { id: 'teacher-01', name: 'teacher', role: UserRole.Teacher },
    { id: 'student-01', name: 'student', role: UserRole.Student },
];

export default function App() {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(() => {
        try {
            const savedUser = localStorage.getItem('lms_loggedInUser');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch { return null; }
    });

    const [users, setUsers] = useState<User[]>(() => {
        try {
            const savedUsers = localStorage.getItem('lms_users');
            return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
        } catch { return defaultUsers; }
    });

    const [courses, setCourses] = useState<Course[]>(() => {
        try {
            const savedCourses = localStorage.getItem('lms_courses');
            return savedCourses ? JSON.parse(savedCourses) : [];
        } catch { return []; }
    });

    const [submissions, setSubmissions] = useState<Submission[]>(() => {
        try {
            const savedSubmissions = localStorage.getItem('lms_submissions');
            return savedSubmissions ? JSON.parse(savedSubmissions, (key, value) => {
                if (key === 'submittedAt' && typeof value === 'string') return new Date(value);
                return value;
            }) : [];
        } catch { return []; }
    });
    
    useEffect(() => {
        if (loggedInUser) {
            localStorage.setItem('lms_loggedInUser', JSON.stringify(loggedInUser));
        } else {
            localStorage.removeItem('lms_loggedInUser');
        }
    }, [loggedInUser]);
    
    useEffect(() => { localStorage.setItem('lms_users', JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem('lms_courses', JSON.stringify(courses)); }, [courses]);
    useEffect(() => { localStorage.setItem('lms_submissions', JSON.stringify(submissions)); }, [submissions]);

    const handleLogin = (user: User) => { setLoggedInUser(user); };
    const handleLogout = () => { setLoggedInUser(null); };

    const handleAddStudent = useCallback((name: string) => {
        const newStudent: User = { id: `student-${Date.now()}`, name, role: UserRole.Student };
        setUsers(prev => [...prev, newStudent]);
    }, []);

    if (!loggedInUser) {
        return <Login users={users} onLogin={handleLogin} />;
    }

    return <LmsApp
        user={loggedInUser}
        onLogout={handleLogout}
        courses={courses}
        setCourses={setCourses}
        submissions={submissions}
        setSubmissions={setSubmissions}
        allUsers={users}
        onAddStudent={handleAddStudent}
    />;
}
