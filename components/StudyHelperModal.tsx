
import React, { FC, useState } from 'react';
import { Course } from '../types';
import { SparklesIcon } from './icons';
import { Card } from './Card';
import { Spinner } from './Spinner';

export const StudyHelperModal = ({ course, onClose, onAskAI }: { course: Course, onClose: () => void, onAskAI: (course: Course, question: string) => Promise<string> }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question) return;
        setIsLoading(true);
        setError('');
        setAnswer('');
        try {
            const response = await onAskAI(course, question);
            setAnswer(response);
        } catch (err: any) {
            setError(err.message || 'Failed to get an answer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50" onClick={onClose}>
            <Card className="p-8 w-full max-w-2xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-2xl font-bold">AI Study Assistant</h3>
                        <p className="text-sm text-slate-500">Ask about "{course.title}"</p>
                    </div>
                     <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">&times;</button>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
                    {answer && (
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg whitespace-pre-wrap">{answer}</div>
                    )}
                     {isLoading && (
                        <div className="p-4 flex items-center space-x-2 text-slate-500">
                           <Spinner /><span>Thinking...</span>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <form onSubmit={handleSubmit} className="flex-shrink-0">
                    <textarea value={question} onChange={(e) => setQuestion(e.target.value)}
                        className="w-full h-24 p-3 border rounded-md bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        placeholder="e.g., Can you summarize the first module?" />
                    <div className="flex justify-end mt-4">
                        <button type="submit" disabled={isLoading || !question} className="py-2 px-5 rounded-lg bg-secondary-600 text-white flex items-center space-x-2 disabled:bg-opacity-50 font-semibold">
                            {isLoading ? <Spinner /> : <SparklesIcon className="h-5 w-5"/>}
                            <span>Ask AI</span>
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
