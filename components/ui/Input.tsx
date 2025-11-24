import React, { forwardRef } from 'react';

type InputProps = {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    type?: string;
    className?: string;
    icon?: React.ReactNode;
    id?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-expanded'?: boolean;
    'aria-controls'?: string;
    'aria-autocomplete'?: 'list' | 'none' | 'inline' | 'both';
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
    placeholder,
    value,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    type = 'text',
    className = '',
    icon,
    id,
    ...ariaProps
}, ref) => {
    return (
        <div className="relative">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    {icon}
                </div>
            )}
            <input
                ref={ref}
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
                className={`w-full px-4 py-2.5 ${icon ? 'pl-10' : ''
                    } bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all duration-300 placeholder:text-[#6C757D] text-sm ${className}`}
                {...ariaProps}
            />
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
