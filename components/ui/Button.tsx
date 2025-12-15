
import React from 'react';

// FIX: Added 'as' prop to allow rendering the button as a different element.
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: React.ElementType;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    // FIX: Destructure 'as' prop and set 'button' as the default component.
    as: Component = 'button',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'bg-brand-amber text-brand-dark hover:bg-amber-400 focus:ring-brand-amber',
        secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 focus:ring-white/50',
        ghost: 'bg-transparent text-brand-amber hover:bg-brand-amber/10 focus:ring-brand-amber',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    };
    
    return (
        // FIX: Render the component specified by the 'as' prop.
        <Component
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : children}
        </Component>
    );
};

export default Button;
