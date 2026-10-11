import React from 'react';
import Image from 'next/image';

interface LogoProps {
  showText?: boolean;
  className?: string;
  iconSize?: number; 
}

export default function Logo({ 
  showText = true, 
  className = "", 
  // Bumped this up from 32 to 40 (or 48 if you need it bigger)
  iconSize = 40 
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      
      <Image 
        src="/logo.png" 
        alt="SupaPing Logo" 
        width={iconSize} 
        height={iconSize}
        // Added object-contain so it scales correctly
        className="rounded-lg shadow-sm object-contain" 
      />
      
      {showText && (
        <span className="text-xl font-bold tracking-tight text-base-dark">
          SupaPing
        </span>
      )}
    </div>
  );
}