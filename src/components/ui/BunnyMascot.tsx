'use client';

import React from 'react';
import { BunnyMood } from '@/src/lib/types';

interface BunnyMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: BunnyMood | 'happy' | 'celebrate' | 'celebration' | 'thinking' | 'sleeping' | string;
  className?: string;
}

export function BunnyMascot({ size = 'md', mood = 'happy', className = '' }: BunnyMascotProps) {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36'
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        {/* Soft Background Glow */}
        <circle cx="60" cy="60" r="54" fill="#FFF4F8" />
        
        {/* Left Ear */}
        <path 
          d="M44 48C38 32 36 12 45 10C54 8 55 28 50 48" 
          fill="#FFD8EA" 
          stroke="#FF4FA3" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M43 38C40 28 39 18 44 16C49 14 50 25 47 38" 
          fill="#FF4FA3" 
          opacity="0.35" 
        />

        {/* Right Ear */}
        <path 
          d="M76 48C82 32 84 12 75 10C66 8 65 28 70 48" 
          fill="#FFD8EA" 
          stroke="#FF4FA3" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M77 38C80 28 81 18 76 16C71 14 70 25 73 38" 
          fill="#FF4FA3" 
          opacity="0.35" 
        />

        {/* Head / Body */}
        <ellipse cx="60" cy="68" rx="36" ry="32" fill="#FFFFFF" stroke="#FF4FA3" strokeWidth="2.5" />

        {/* Cheeks Blush */}
        <circle cx="42" cy="72" r="5.5" fill="#FF80BF" opacity="0.4" />
        <circle cx="78" cy="72" r="5.5" fill="#FF80BF" opacity="0.4" />

        {/* Eyes based on mood */}
        {mood === 'happy' || mood === 'celebrate' ? (
          <>
            {/* Happy Curved Eyes */}
            <path d="M44 63C47 60 51 60 54 63" stroke="#263550" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M66 63C69 60 73 60 76 63" stroke="#263550" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : mood === 'sleeping' ? (
          <>
            {/* Sleeping flat line eyes */}
            <path d="M43 65H53" stroke="#263550" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M67 65H77" stroke="#263550" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Round open eyes */}
            <circle cx="48" cy="63" r="3" fill="#263550" />
            <circle cx="72" cy="63" r="3" fill="#263550" />
          </>
        )}

        {/* Nose & Mouth */}
        <path d="M58 68C59 67 61 67 62 68L60 70L58 68Z" fill="#FF4FA3" />
        <path d="M60 70V73M60 73C58 75 56 74 55 73M60 73C62 75 64 74 65 73" stroke="#263550" strokeWidth="1.8" strokeLinecap="round" />

        {/* Satin Bow on Left Ear */}
        <g transform="translate(38, 42)">
          <path d="M-6 -4C-2 -2 -2 2 -6 4C-9 2 -9 -2 -6 -4Z" fill="#FF4FA3" />
          <path d="M6 -4C2 -2 2 2 6 4C9 2 9 -2 6 -4Z" fill="#FF4FA3" />
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" stroke="#FF4FA3" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}
