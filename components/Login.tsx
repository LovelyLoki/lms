
import React, { FC, useState } from 'react';
import { User } from '../types';
import { AcademicCapIcon } from './icons';
import { Card } from './Card';

export const Login: FC<{ users: User[], onLogin: (user: User) => void }> = ({ users, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== 'password') {
            setError('Invalid password. Hint: it\'s "password"');
            return;
        }

        const foundUser = users.find(u => u.name.toLowerCase() === username.toLowerCase());

        if (foundUser) {
            onLogin(foundUser);
        } else {
            setError('User not found. Try "student", "teacher", or "admin".');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <AcademicCapIcon className="h-16 w-16 text-primary-600 mx-auto" />
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight mt-4">AI-LMS Login</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to access your dashboard.</p>
                </div>
                <Card className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="student, teacher, or admin"
                                className="mt-1 block w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                                className="mt-1 block w-full px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Sign In
                        </button>
                    </form>
                </Card>
            </div>
        </div>
    );
};
