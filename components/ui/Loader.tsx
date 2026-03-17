interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Loader({ size = 'md', className = '' }: LoaderProps) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size]} border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin`}
                role="status"
                aria-label="Loading"
            />
        </div>
    );
}

// Full page loader utility component
export function FullPageLoader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-50">
            <Loader size="lg" />
        </div>
    );
}
