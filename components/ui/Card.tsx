
import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg ${className}`}>
            {children}
        </div>
    );
};

export default Card;
