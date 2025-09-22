
import React, { FC } from 'react';
import { User } from '../types';
import { AcademicCapIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from './icons';

export const LmsHeader: FC<{ user: User, onLogout: () => void }> = ({ user, onLogout }) => (
    <header className="bg-white dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center space-x-3">
            <AcademicCapIcon className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">AI-LMS</h1>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="h-6 w-6 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                {user.name} ({user.role})
              </span>
            </div>
            <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Logout"
            >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
            </button>
        </div>
    </header>
);
