
import React, { FC } from 'react';
import { Course, UserRole, User } from '../types';
import { BookOpenIcon, PlusCircleIcon, SparklesIcon } from './icons';
import { Card } from './Card';

export const CourseList = ({ courses, user, setView, setSelectedCourseId, onEnroll, onUnenroll }: {
    courses: Course[]; user: User; setView: (view: string) => void;
    setSelectedCourseId: (id: string) => void; onEnroll: (courseId: string) => void; onUnenroll: (courseId: string) => void;
}) => (
    <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight">All Courses</h2>
            {user.role !== UserRole.Student && (
                 <div className="flex items-center space-x-2">
                    <button onClick={() => setView('manual-create-course')} className="flex items-center space-x-2 bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors shadow-sm">
                        <PlusCircleIcon className="h-5 w-5" />
                        <span>Create Manually</span>
                    </button>
                    <button onClick={() => setView('create-course')} className="flex items-center space-x-2 bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
                        <SparklesIcon className="h-5 w-5" />
                        <span>Create with AI</span>
                    </button>
                </div>
            )}
        </div>
        {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => {
                    const isEnrolled = course.enrolledStudentIds.includes(user.id);
                    return (
                        <Card key={course.id} className="overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1">
                            <div className="p-6 flex-grow">
                                <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">{course.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">{course.description}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <button onClick={() => { setSelectedCourseId(course.id); setView('course-detail'); }} className="text-sm font-semibold text-primary-600 hover:underline">
                                    View Details
                                </button>
                                {user.role === UserRole.Student && (
                                    isEnrolled ? (
                                        <button onClick={() => onUnenroll(course.id)} className="text-sm font-semibold bg-red-500 text-white py-1.5 px-3 rounded-md hover:bg-red-600">
                                            Unenroll
                                        </button>
                                    ) : (
                                        <button onClick={() => onEnroll(course.id)} className="text-sm font-semibold bg-secondary-600 text-white py-1.5 px-3 rounded-md hover:bg-secondary-700">
                                            Enroll
                                        </button>
                                    )
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
        ) : (
             <div className="text-center py-20 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                <BookOpenIcon className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">There are no available courses.</h3>
            </div>
        )}
    </div>
);
