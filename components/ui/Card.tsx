import React from 'react';

type CardProps = {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
};

export default function Card({ children, className = '', onClick }: CardProps) {
    return (
        <div
            className={`bg-white rounded-2xl shadow-lg overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-2xl transition-all duration-300' : ''
                } ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
