
import React, { FC, useState } from 'react';
import { Course, Submission, UserRole, User } from '../types';
import { SparklesIcon } from './icons';
import { Card } from './Card';
import { Spinner } from './Spinner';

export const GradesView = ({ courses, submissions, user, onEvaluate, onGenerateReport }: {
    courses: Course[]; submissions: Submission[]; user: User; onEvaluate: (submissionId: string) => Promise<void>; onGenerateReport: () => Promise<string>;
}) => {
    const [report, setReport] = useState('');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [evaluatingId, setEvaluatingId] = useState<string | null>(null);

    const handleGenerateReport = async () => {
        setIsGeneratingReport(true);
        const generatedReport = await onGenerateReport();
        setReport(generatedReport);
        setIsGeneratingReport(false);
    };

    const handleEvaluate = async (submissionId: string) => {
        setEvaluatingId(submissionId);
        await onEvaluate(submissionId);
        setEvaluatingId(null);
    }
    
    const submissionsToDisplay = user.role === UserRole.Student ? submissions.filter(s => s.studentId === user.id) : submissions;

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h2 className="text-3xl font-extrabold tracking-tight">Progress & Grades</h2>
            
            {user.role === UserRole.Student && (
                 <Card className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-bold">Your AI Progress Report</h3>
                            <p className="text-slate-500 text-sm mt-1">Get an AI-generated summary of your performance.</p>
                        </div>
                        <button onClick={handleGenerateReport} disabled={isGeneratingReport} className="flex-shrink-0 flex items-center space-x-2 bg-secondary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary-700 transition-colors disabled:opacity-50">
                             {isGeneratingReport ? <Spinner /> : <SparklesIcon className="h-5 w-5"/>}
                             <span>Generate Report</span>
                        </button>
                    </div>
                    {report && <p className="text-slate-600 dark:text-slate-300 mt-4 whitespace-pre-wrap text-sm p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">{report}</p>}
                 </Card>
            )}

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Assignment</th>
                                {user.role !== UserRole.Student && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Student</th>}
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Grade</th>
                                {user.role !== UserRole.Student && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {submissionsToDisplay.map(sub => {
                                const course = courses.find(c => c.id === sub.courseId);
                                const assignment = course?.modules.flatMap(m => m.assignments).find(a => a.id === sub.assignmentId);
                                const student = user.role !== UserRole.Student ? (submissions.find(s => s.id === sub.id)?.studentId) : null;
                                return (
                                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">{course?.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{assignment?.title}</td>
                                        {user.role !== UserRole.Student && <td className="px-6 py-4 whitespace-nowrap text-sm">{`Student ID: ...${sub.studentId.slice(-4)}`}</td>}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.grade !== null ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>
                                                {sub.grade !== null ? 'Graded' : 'Submitted'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{sub.grade !== null ? `${sub.grade} / 100` : 'N/A'}</td>
                                        {user.role !== UserRole.Student && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {sub.grade === null && (
                                                    <button onClick={() => handleEvaluate(sub.id)} disabled={evaluatingId === sub.id} className="flex items-center space-x-2 bg-primary-600 text-white font-bold py-1.5 px-3 rounded-md hover:bg-primary-700 disabled:opacity-50 text-xs">
                                                        {evaluatingId === sub.id ? <Spinner /> : null}
                                                        <span>Evaluate</span>
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                 {submissionsToDisplay.length === 0 && <p className="text-center py-12 text-slate-500">No submissions to display.</p>}
            </Card>
        </div>
    );
};
