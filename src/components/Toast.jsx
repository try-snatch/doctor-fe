import React, { useState } from 'react';

const Icons = {
    success: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                fill="currentColor"
            />
        </svg>
    ),
    error: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                fill="currentColor"
            />
        </svg>
    ),
    warning: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z"
                fill="currentColor"
            />
        </svg>
    ),
    info: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
                fill="currentColor"
            />
        </svg>
    ),
};

const CloseIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
            fill="currentColor"
        />
    </svg>
);

const toastStyles = {
    success: {
        container: 'bg-white border-l-4 border-green-500',
        icon: 'text-green-500',
        title: 'text-green-800',
    },
    error: {
        container: 'bg-white border-l-4 border-red-500',
        icon: 'text-red-500',
        title: 'text-red-800',
    },
    warning: {
        container: 'bg-white border-l-4 border-amber-500',
        icon: 'text-amber-500',
        title: 'text-amber-800',
    },
    info: {
        container: 'bg-white border-l-4 border-primary-500',
        icon: 'text-primary-500',
        title: 'text-primary-800',
    },
};

const ToastItem = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);
    const styles = toastStyles[toast.type] || toastStyles.info;

    const handleRemove = () => {
        setIsExiting(true);
        setTimeout(() => {
            onRemove(toast.id);
        }, 300);
    };

    return (
        <div
            className={`
                ${styles.container}
                ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}
                flex items-start gap-3 p-4 rounded-xl shadow-toast
                min-w-[300px] max-w-[400px]
            `}
            role="alert"
        >
            <span className={`${styles.icon} shrink-0 mt-0.5`}>
                {Icons[toast.type]}
            </span>
            <p className={`${styles.title} flex-1 text-sm font-medium leading-5`}>
                {toast.message}
            </p>
            <button
                onClick={handleRemove}
                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-0.5 -m-0.5 rounded cursor-pointer"
                aria-label="Close"
            >
                <CloseIcon />
            </button>
        </div>
    );
};

const Toast = ({ toasts, removeToast }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-3 px-4 w-full max-w-[420px]"
             style={{ top: 'calc(0.75rem + env(safe-area-inset-top, 0px))' }}>
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

export default Toast;