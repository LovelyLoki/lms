
import React, { FC, useState } from 'react';
import { Course, Module, Assignment } from '../types';
import { ArrowLeftIcon, TrashIcon } from './icons';
import { Card } from './Card';

export type ManualCourseCreationData = Omit<Course, 'id' | 'enrolledStudentIds' | 'modules'> & {
    modules: (Omit<Module, 'id' | 'assignments'> & {
        assignments: Omit<Assignment, 'id'>[]
    })[]
};

export const ManualCourseCreation = ({ setView, onCourseCreate }: { setView: (view: string) => void; onCourseCreate: (course: ManualCourseCreationData) => void; }) => {
    const [courseData, setCourseData] = useState<ManualCourseCreationData>({
        title: '',
        description: '',
        modules: [{ title: '', description: '', content: '', assignments: [{ title: '', prompt: '' }] }]
    });

    const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCourseData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleModuleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newModules = courseData.modules.map((mod, i) => i === index ? { ...mod, [name]: value } : mod);
        setCourseData(prev => ({ ...prev, modules: newModules }));
    };

    const handleAssignmentChange = (modIndex: number, assIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newModules = courseData.modules.map((mod, i) => {
            if (i !== modIndex) return mod;
            const newAssignments = mod.assignments.map((ass, j) => j === assIndex ? { ...ass, [name]: value } : ass);
            return { ...mod, assignments: newAssignments };
        });
        setCourseData(prev => ({ ...prev, modules: newModules }));
    };

    const addModule = () => {
        setCourseData(prev => ({
            ...prev,
            modules: [...prev.modules, { title: '', description: '', content: '', assignments: [] }]
        }));
    };

    const removeModule = (index: number) => {
        setCourseData(prev => ({ ...prev, modules: prev.modules.filter((_, i) => i !== index) }));
    };

    const addAssignment = (modIndex: number) => {
        const newModules = courseData.modules.map((mod, i) => {
            if (i === modIndex) {
                return { ...mod, assignments: [...mod.assignments, { title: '', prompt: '' }] };
            }
            return mod;
        });
        setCourseData(prev => ({ ...prev, modules: newModules }));
    };

    const removeAssignment = (modIndex: number, assIndex: number) => {
        const newModules = courseData.modules.map((mod, i) => {
            if (i === modIndex) {
                return { ...mod, assignments: mod.assignments.filter((_, j) => j !== assIndex) };
            }
            return mod;
        });
        setCourseData(prev => ({ ...prev, modules: newModules }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCourseCreate(courseData);
    };

    return (
        <div className="p-4 md:p-8">
            <button onClick={() => setView('courses')} className="flex items-center space-x-2 text-primary-600 font-semibold mb-6 hover:underline">
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Courses</span>
            </button>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                <Card className="p-8">
                    <h2 className="text-3xl font-extrabold mb-6">Create a New Course Manually</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium">Course Title</label>
                            <input type="text" name="title" id="title" value={courseData.title} onChange={handleCourseChange} required className="mt-1 block w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium">Course Description</label>
                            <textarea name="description" id="description" value={courseData.description} onChange={handleCourseChange} required rows={3} className="mt-1 block w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                    </div>
                </Card>

                {courseData.modules.map((module, modIndex) => (
                    <Card key={modIndex} className="p-8 relative">
                        <h3 className="text-xl font-bold mb-4">Module {modIndex + 1}</h3>
                        {courseData.modules.length > 1 && (
                            <button type="button" onClick={() => removeModule(modIndex)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                                <TrashIcon className="h-6 w-6" />
                            </button>
                        )}
                        <div className="space-y-4">
                            <input type="text" name="title" placeholder="Module Title" value={module.title} onChange={(e) => handleModuleChange(modIndex, e)} required className="block w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg" />
                            <textarea name="description" placeholder="Module Description" value={module.description} onChange={(e) => handleModuleChange(modIndex, e)} required rows={2} className="block w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg" />
                            <textarea name="content" placeholder="Module Learning Content" value={module.content} onChange={(e) => handleModuleChange(modIndex, e)} required rows={5} className="block w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg" />
                        </div>

                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">Assignments</h4>
                            {module.assignments.map((assignment, assIndex) => (
                                <div key={assIndex} className="flex items-start space-x-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg mb-2">
                                    <div className="flex-grow space-y-2">
                                        <input type="text" name="title" placeholder="Assignment Title" value={assignment.title} onChange={(e) => handleAssignmentChange(modIndex, assIndex, e)} required className="block w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md" />
                                        <textarea name="prompt" placeholder="Assignment Prompt" value={assignment.prompt} onChange={(e) => handleAssignmentChange(modIndex, assIndex, e)} required rows={3} className="block w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md" />
                                    </div>
                                    <button type="button" onClick={() => removeAssignment(modIndex, assIndex)} className="text-red-500 hover:text-red-700 p-2">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addAssignment(modIndex)} className="text-sm font-semibold text-primary-600 hover:underline mt-2">
                                + Add Assignment
                            </button>
                        </div>
                    </Card>
                ))}

                <button type="button" onClick={addModule} className="w-full py-3 border-2 border-dashed border-slate-400 rounded-lg text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                    + Add Module
                </button>

                <button type="submit" className="w-full py-3 text-white bg-primary-600 rounded-lg font-semibold hover:bg-primary-700">
                    Save Course
                </button>
            </form>
        </div>
    );
};
