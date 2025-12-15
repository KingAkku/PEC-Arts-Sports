
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
};

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
    return (
        <div>
            {label && <label htmlFor={id} className="block text-sm font-medium text-white/70 mb-2">{label}</label>}
            <input
                id={id}
                className="w-full bg-white/5 border border-white/20 rounded-md py-2 px-4 text-white placeholder-white/40 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber focus:outline-none transition-colors"
                {...props}
            />
        </div>
    );
};

export default Input;
