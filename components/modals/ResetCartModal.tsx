'use client';

import { AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

type ResetCartModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export default function ResetCartModal({ isOpen, onClose, onConfirm }: ResetCartModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={32} className="text-[#FF6B00]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#212529] mb-2">
                        Start a New Cart?
                    </h2>
                    <p className="text-[#6C757D] mb-6">
                        You have items from another restaurant in your cart. If you continue, your cart will be cleared and this new item will be added.
                    </p>
                    <div className="flex gap-3 w-full">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={onClose}
                        >
                            No
                        </Button>
                        <Button
                            variant="primary"
                            className="flex-1"
                            onClick={onConfirm}
                        >
                            Yes, Start New
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
