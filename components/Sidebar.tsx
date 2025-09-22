
import React, { FC } from 'react';
import { HomeIcon, BookOpenIcon, ChartBarIcon, UsersIcon } from './icons';
import { UserRole } from '../types';

export const Sidebar: FC<{ view: string; setView: (view: string) => void, userRole: UserRole }> = ({ view, setView, userRole }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, roles: [UserRole.Student, UserRole.Teacher, UserRole.Administrator] },
        { id: 'courses', label: 'Courses', icon: BookOpenIcon, roles: [UserRole.Student, UserRole.Teacher, UserRole.Administrator] },
        { id: 'grades', label: 'Progress', icon: ChartBarIcon, roles: [UserRole.Student, UserRole.Teacher, UserRole.Administrator] },
        { id: 'manage-students', label: 'Manage Students', icon: UsersIcon, roles: [UserRole.Administrator] }
    ];

    const availableNavItems = navItems.filter(item => item.roles.includes(userRole));

    return (
        <aside className="w-64 bg-white dark:bg-slate-900/70 backdrop-blur-lg border-r border-slate-200 dark:border-slate-800 p-4 flex-col hidden md:flex">
            <nav className="mt-8 flex-grow">
                <ul className="space-y-2">
                    {availableNavItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => setView(item.id)}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                                    view === item.id 
                                        ? 'bg-primary-600 text-white shadow-lg' 
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                <item.icon className="h-6 w-6" />
                                <span className="font-semibold">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
