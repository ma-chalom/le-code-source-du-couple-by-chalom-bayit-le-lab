import React from 'react';

const AppLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g transform="translate(10, 0)">
      {/* Code Brackets */}
      <path d="M60 10 L20 50 L60 90" stroke="#06b6d4" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M140 10 L180 50 L140 90" stroke="#ec4899" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      
      {/* Heart */}
      <path 
        d="M100 65 C 85 45, 60 50, 75 70 L100 95 L125 70 C 140 50, 115 45, 100 65 Z" 
        fill="#a855f7" 
        stroke="#a855f7" 
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default AppLogo;