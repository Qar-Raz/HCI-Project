import React, { useEffect, useState } from 'react';
import { X, Check, Info, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastProps {
    toasts: ToastMessage[];
    removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastProps) {
    return (
        <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        pointer-events-auto
                        flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out
                        ${toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : ''}
                        ${toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : ''}
                        ${toast.type === 'info' ? 'bg-blue-50 border border-blue-200 text-blue-800' : ''}
                        animate-in slide-in-from-right-full fade-in
                    `}
                >
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center shrink-0
                        ${toast.type === 'success' ? 'bg-green-100 text-green-600' : ''}
                        ${toast.type === 'error' ? 'bg-red-100 text-red-600' : ''}
                        ${toast.type === 'info' ? 'bg-blue-100 text-blue-600' : ''}
                    `}>
                        {toast.type === 'success' && <Check className="w-4 h-4" />}
                        {toast.type === 'error' && <AlertCircle className="w-4 h-4" />}
                        {toast.type === 'info' && <Info className="w-4 h-4" />}
                    </div>
                    <p className="font-medium text-sm">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 opacity-50" />
                    </button>
                </div>
            ))}
        </div>
    );
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = (message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return { toasts, addToast, removeToast };
}
