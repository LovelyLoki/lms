
import React, { FC, PropsWithChildren } from 'react';

export const Card: FC<PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = ({ children, className = '', ...props }) => (
    <div className={`bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm transition-all duration-300 ${className}`} {...props}>
        {children}
    </div>
);
