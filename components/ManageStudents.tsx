
import React, { FC, useState } from 'react';
import { User } from '../types';
import { Card } from './Card';
import { PlusCircleIcon, UserCircleIcon as UserIcon } from './icons'; // Renamed to avoid conflict

export const ManageStudents: FC<{
    students: User[];
    onAddStudent: (name: string) => void;
}> = ({ students, onAddStudent }) => {
    const [newStudentName, setNewStudentName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStudentName.trim()) {
            onAddStudent(newStudentName.trim());
            setNewStudentName('');
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h2 className="text-3xl font-extrabold tracking-tight">Manage Students</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Add New Student</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="studentName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Student Username</label>
                            <input
                                id="studentName"
                                type="text"
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                                placeholder="e.g., jane.doe"
                                className="mt-1 block w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50" disabled={!newStudentName.trim()}>
                            <PlusCircleIcon className="h-5 w-5" />
                            <span>Add Student</span>
                        </button>
                    </form>
                </Card>
                
                <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Current Students ({students.length})</h3>
                    {students.length > 0 ? (
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
                            {students.map(student => (
                                <li key={student.id} className="py-3 flex items-center space-x-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                                        <UserIcon className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <span className="font-medium text-slate-800 dark:text-slate-200">{student.name}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 text-center py-8">No students have been added yet.</p>
                    )}
                </Card>
            </div>
        </div>
    );
};
