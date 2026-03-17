import React from 'react';

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

export function Card({ className = '', children }: CardProps) {
    return (
        <div className={`rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ className = '', children }: CardProps) {
    return (
        <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ className = '', children }: CardProps) {
    return (
        <h3 className={`font-semibold leading-none tracking-tight text-xl ${className}`}>
            {children}
        </h3>
    );
}

export function CardDescription({ className = '', children }: CardProps) {
    return (
        <p className={`text-sm text-zinc-500 dark:text-zinc-400 ${className}`}>
            {children}
        </p>
    );
}

export function CardContent({ className = '', children }: CardProps) {
    return (
        <div className={`p-6 pt-0 ${className}`}>
            {children}
        </div>
    );
}

export function CardFooter({ className = '', children }: CardProps) {
    return (
        <div className={`flex items-center p-6 pt-0 ${className}`}>
            {children}
        </div>
    );
}
