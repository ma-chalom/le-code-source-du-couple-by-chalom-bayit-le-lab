import React from 'react';

const CardBackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 300 420" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid meet">
        {/* The border is handled by CSS, so the background can fill the whole SVG */}
        <rect width="100%" height="100%" fill="#1f2937" />

        <g textAnchor="middle" fontFamily="sans-serif" fill="#d59e0d">
            {/* Main Title */}
            <text x="150" y="140" fontSize="32" fontWeight="bold">LE</text>
            <text x="150" y="190" fontSize="32" fontWeight="bold">CODE SOURCE</text>
            <text x="150" y="240" fontSize="32" fontWeight="bold">DU COUPLE</text>
        </g>
        
        <g textAnchor="middle" fontFamily="sans-serif" fill="#a855f7">
            {/* Subtitle */}
            <text x="150" y="310" fontSize="16" fontWeight="bold">
                <tspan fill="#ec4899">by</tspan> le Chalom Bayit <tspan fill="#06b6d4">LAB</tspan>
            </text>
        </g>
    </svg>
);

export default CardBackIcon;