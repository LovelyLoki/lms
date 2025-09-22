
import React, { FC } from 'react';
import { Card } from './Card';

export const StatCard: FC<{ icon: React.ElementType, label: string, value: string | number, color: string }> = ({ icon: Icon, label, value, color }) => (
    <Card className="p-6 flex items-start space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</h3>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
        </div>
    </Card>
);
