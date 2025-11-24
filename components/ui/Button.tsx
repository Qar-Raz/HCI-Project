import React from 'react';

type ButtonProps = {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    disabled = false,
    type = 'button'
}: ButtonProps) {
    const baseStyles = 'font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'bg-[#FF6B00] text-white hover:bg-[#E55F00] active:bg-[#CC5500]',
        secondary: 'border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white',
        ghost: 'text-[#6C757D] hover:text-[#212529] hover:bg-gray-100',
        danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-5 py-2.5 text-base rounded-lg',
        lg: 'px-6 py-3 text-lg rounded-xl'
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
