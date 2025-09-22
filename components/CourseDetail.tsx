
import React, { FC, useState } from 'react';
import { Course, Submission, Assignment, User, UserRole } from '../types';
import { ArrowLeftIcon, QuestionMarkCircleIcon } from './icons';
import { Card } from './Card';
import { Spinner } from './Spinner';

export const CourseDetail = ({ course, submissions, user, setView, onAssignmentSubmit, onShowStudyHelper }: {
    course: Course | undefined; submissions: Submission[]; user: User; setView: (view: string) => void;
    onAssignmentSubmit: (submission: Omit<Submission, 'id' | 'submittedAt' | 'grade' | 'feedback'>) => Promise<void>;
    onShowStudyHelper: (course: Course) => void;
}) => {
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAssignment || !submissionContent) return;

        setIsSubmitting(true); setError('');
        try {
            await onAssignmentSubmit({
                assignmentId: selectedAssignment.id, studentId: user.id,
                courseId: course!.id, content: submissionContent,
            });
            setSubmissionContent(''); setSelectedAssignment(null);
        } catch (err: any) { setError(err.message || "Failed to submit."); } 
        finally { setIsSubmitting(false); }
    };

    if (!course) return <div className="p-8">Course not found.</div>;
    const isEnrolled = course.enrolledStudentIds.includes(user.id);

    return (
        <div className="p-4 md:p-8">
            <button onClick={() => setView('courses')} className="flex items-center space-x-2 text-primary-600 font-semibold mb-6 hover:underline">
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Courses</span>
            </button>
            <div className="flex justify-between items-start gap-4 mb-2">
                <h2 className="text-4xl font-extrabold tracking-tight">{course.title}</h2>
                {user.role === UserRole.Student && isEnrolled && (
                    <button onClick={() => onShowStudyHelper(course)} className="flex-shrink-0 flex items-center space-x-2 bg-secondary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary-700 transition-colors disabled:opacity-50">
                        <QuestionMarkCircleIcon className="h-5 w-5"/>
                        <span>AI Study Assistant</span>
                    </button>
                )}
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-3xl">{course.description}</p>
            
            <div className="space-y-6">
                {course.modules.map(module => (
                    <Card key={module.id} className="p-6">
                        <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">{module.description}</p>
                        
                        <details className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                            <summary className="font-semibold cursor-pointer">View Learning Content</summary>
                            <div className="prose prose-sm dark:prose-invert max-w-none mt-2 whitespace-pre-wrap">{module.content}</div>
                        </details>
                        
                        <div className="space-y-3 mt-4">
                            {module.assignments.map(assignment => {
                                const submission = submissions.find(s => s.assignmentId === assignment.id && s.studentId === user.id);
                                return (
                                    <div key={assignment.id} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-semibold">{assignment.title}</h4>
                                                {submission && <span className={`text-xs font-bold px-2 py-1 rounded-full mt-1 inline-block ${submission.grade !== null ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'}`}>{submission.grade !== null ? `Graded: ${submission.grade}/100` : 'Submitted'}</span>}
                                            </div>
                                            {user.role === UserRole.Student && isEnrolled && !submission && (
                                                <button onClick={() => setSelectedAssignment(assignment)} className="bg-primary-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-primary-700">
                                                    Submit
                                                </button>
                                            )}
                                        </div>
                                        {submission && (
                                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                <p className="text-sm font-semibold">Your Submission:</p>
                                                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap p-3 bg-white dark:bg-slate-800 rounded mt-1">{submission.content}</p>
                                                {submission.feedback && (
                                                   <div className="mt-3">
                                                     <p className="text-sm font-semibold">Feedback:</p>
                                                     <p className="text-sm text-slate-700 dark:text-slate-300 p-3 bg-green-50 dark:bg-green-900/30 rounded mt-1">{submission.feedback}</p>
                                                   </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                ))}
            </div>

            {selectedAssignment && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                    <Card className="p-8 w-full max-w-2xl" role="dialog" aria-modal="true">
                         <h3 className="text-2xl font-bold mb-2">{selectedAssignment.title}</h3>
                         <p className="text-slate-600 dark:text-slate-400 mb-4 whitespace-pre-wrap">{selectedAssignment.prompt}</p>
                         <form onSubmit={handleSubmit}>
                             <textarea value={submissionContent} onChange={(e) => setSubmissionContent(e.target.value)}
                                 className="w-full h-48 p-3 border rounded-md bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                 placeholder="Type your submission here..."/>
                             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                             <div className="flex justify-end space-x-4 mt-6">
                                 <button type="button" onClick={() => setSelectedAssignment(null)} className="py-2 px-5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold">
                                     Cancel
                                 </button>
                                 <button type="submit" disabled={isSubmitting || !submissionContent} className="py-2 px-5 rounded-lg bg-primary-600 text-white flex items-center space-x-2 disabled:bg-opacity-50 font-semibold">
                                     {isSubmitting && <Spinner />}
                                     <span>Submit Assignment</span>
                                 </button>
                             </div>
                         </form>
                     </Card>
                 </div>
            )}
        </div>
    );
};
