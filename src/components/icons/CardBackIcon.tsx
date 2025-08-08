import React from 'react';

const CardBackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid meet">
        {/* The border is handled by CSS, so the background can fill the whole SVG */}
        <rect width="100%" height="100%" fill="#1f2937" />

        <g textAnchor="middle" fontFamily="sans-serif" fill="#d59e0d">
            {/* Main Title, simplified and centered */}
            <text x="150" y="195" fontSize="34" fontWeight="bold">Le Code Source</text>
            <text x="150" y="240" fontSize="34" fontWeight="bold">du Couple</text>
        </g>
    </svg>
);

export default CardBackIcon;