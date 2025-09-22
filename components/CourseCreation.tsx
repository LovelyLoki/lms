
import React, { FC, useState } from 'react';
import { ArrowLeftIcon, SparklesIcon } from './icons';
import { Spinner } from './Spinner';

export const CourseCreation = ({ setView, onCourseCreate }: { setView: (view: string) => void; onCourseCreate: (topic: string) => Promise<void>;}) => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) return;
        setIsLoading(true); setError('');
        try {
            await onCourseCreate(topic);
            setView('courses');
        } catch (err: any) { setError(err.message || 'An unknown error occurred.');
        } finally { setIsLoading(false); }
    };

    return (
        <div className="p-4 md:p-8">
            <button onClick={() => setView('courses')} className="flex items-center space-x-2 text-primary-600 font-semibold mb-6 hover:underline">
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Courses</span>
            </button>
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto bg-accent-100 dark:bg-accent-900/50 rounded-full flex items-center justify-center">
                      <SparklesIcon className="h-10 w-10 text-accent-500" />
                    </div>
                    <h2 className="text-3xl font-extrabold mt-4">Create a Course with AI</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Just provide a topic, and our AI curriculum designer will do the rest.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Course Topic</label>
                        <input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Introduction to Quantum Physics"
                            className="mt-1 block w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500" required />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={isLoading || !topic} className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
                        {isLoading ? <Spinner /> : <SparklesIcon className="h-5 w-5" />}
                        <span>{isLoading ? 'Generating...' : 'Generate Course'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};
