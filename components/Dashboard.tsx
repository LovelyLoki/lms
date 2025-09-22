
import React, { FC, useMemo } from 'react';
import { Course, Submission, UserRole, User } from '../types';
import { AcademicCapIcon, BookOpenIcon, DocumentDuplicateIcon, SparklesIcon, UsersIcon } from './icons';
import { Card } from './Card';
import { StatCard } from './StatCard';

export const Dashboard = ({ user, courses, submissions, setView, setSelectedCourseId } : {
    user: User;
    courses: Course[];
    submissions: Submission[];
    setView: (view: string) => void;
    setSelectedCourseId: (id: string) => void;
}) => {
    const studentCourses = useMemo(() => courses.filter(c => c.enrolledStudentIds.includes(user.id)), [courses, user.id]);

    const summary = useMemo(() => {
        const totalCourses = courses.length;
        const totalSubmissions = submissions.length;
        const totalStudents = new Set(courses.flatMap(c => c.enrolledStudentIds)).size;

        switch(user.role) {
            case UserRole.Student:
                return {
                    title: `Welcome, ${user.name}!`, message: "Your learning journey starts here. Let's make progress today!",
                    stats: [
                        { label: 'Enrolled Courses', value: studentCourses.length, icon: BookOpenIcon, color: 'bg-blue-500' },
                        { label: 'Submitted Work', value: submissions.filter(s => s.studentId === user.id).length, icon: DocumentDuplicateIcon, color: 'bg-amber-500' },
                        { label: 'Graded Assignments', value: submissions.filter(s => s.studentId === user.id && s.grade !== null).length, icon: AcademicCapIcon, color: 'bg-green-500' },
                    ]
                };
            case UserRole.Teacher:
                return {
                    title: "Teacher Dashboard", message: "Manage courses, evaluate submissions, and guide your students.",
                     stats: [
                        { label: 'Total Courses', value: totalCourses, icon: BookOpenIcon, color: 'bg-blue-500' },
                        { label: 'Total Submissions', value: totalSubmissions, icon: DocumentDuplicateIcon, color: 'bg-amber-500' },
                        { label: 'Awaiting Grading', value: submissions.filter(s => s.grade === null).length, icon: SparklesIcon, color: 'bg-pink-500' },
                    ]
                };
            case UserRole.Administrator:
                return {
                    title: "Admin Dashboard", message: "Oversee all platform activity from a bird's-eye view.",
                     stats: [
                        { label: 'Total Courses', value: totalCourses, icon: BookOpenIcon, color: 'bg-blue-500' },
                        { label: 'Total Students', value: totalStudents, icon: UsersIcon, color: 'bg-purple-500' },
                        { label: 'Total Submissions', value: totalSubmissions, icon: DocumentDuplicateIcon, color: 'bg-amber-500' },
                    ]
                };
        }
    }, [user, courses, studentCourses, submissions]);

    const coursesToShow = user.role === UserRole.Student ? studentCourses : courses;

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{summary.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{summary.message}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {summary.stats.map(stat => <StatCard key={stat.label} {...stat} />)}
            </div>

            <div>
                <h3 className="text-2xl font-bold tracking-tight mb-4">Your Courses</h3>
                {coursesToShow.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coursesToShow.map(course => (
                            <Card key={course.id} className="p-6 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                                 onClick={() => { setSelectedCourseId(course.id); setView('course-detail'); }}>
                                <h4 className="font-bold text-lg text-primary-600 dark:text-primary-400 mb-2">{course.title}</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{course.description}</p>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                        <BookOpenIcon className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{user.role === UserRole.Student ? "You are not enrolled in any courses." : "No courses available"}</h3>
                         {user.role !== UserRole.Student && (
                            <button onClick={() => setView('create-course')} className="mt-4 bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                                Create a Course
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
