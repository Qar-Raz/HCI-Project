'use client';

import { Volume2 } from 'lucide-react';
import { useState } from 'react';

interface SpeakButtonProps {
    text: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function SpeakButton({ text, className = '', size = 'md' }: SpeakButtonProps) {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    return (
        <button
            onClick={speak}
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 z-30 ${isSpeaking
                ? 'bg-[#FF6B00] text-white animate-pulse ring-4 ring-[#FF6B00]/30'
                : 'bg-white text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white border-2 border-[#FF6B00]'
                } ${className}`}
            aria-label={`Listen to: ${text}`}
            title={`Listen to: ${text}`}
        >
            <Volume2 size={iconSizes[size]} />
        </button>
    );
}
