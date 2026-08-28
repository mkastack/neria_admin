'use client';

import React, { useEffect, useState } from 'react';

interface LogoLoaderProps {
  isVisible: boolean;
  message?: string;
}

/**
 * Full-screen frosted-glass logo loader overlay.
 * Shown during crucial async actions (uploads, publishes, saves).
 * Features: animated bunny SVG, spinning ring, orbiting particles,
 * pulse glow, and a smooth fade-in/fade-out.
 */
export function LogoLoader({ isVisible, message = 'Saving your changes…' }: LogoLoaderProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setOpacity(1)));
    } else {
      setOpacity(0);
      const t = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(t);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        opacity,
        transition: 'opacity 0.45s cubic-bezier(0.4,0,0.2,1)',
        background: 'rgba(255, 244, 248, 0.72)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      }}
    >
      {/* Card */}
      <div
        className="relative flex flex-col items-center gap-6 px-10 py-10 rounded-[2rem]"
        style={{
          background: 'rgba(255,255,255,0.85)',
          boxShadow: '0 24px 80px -8px rgba(255,79,163,0.22), 0 0 0 1px rgba(255,216,234,0.7)',
          transform: opacity === 1 ? 'scale(1) translateY(0)' : 'scale(0.88) translateY(12px)',
          transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* === Spinning outer ring === */}
        <div className="relative w-32 h-32">
          {/* Slow outer spin ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '3px solid transparent',
              borderTopColor: '#FF4FA3',
              borderRightColor: '#FFD8EA',
              animation: 'logo-spin 1.4s linear infinite',
            }}
          />

          {/* Fast inner ring (opposite direction) */}
          <div
            className="absolute inset-3 rounded-full"
            style={{
              border: '2px solid transparent',
              borderTopColor: '#CBE7FA',
              borderLeftColor: '#0284C7',
              animation: 'logo-spin-rev 1s linear infinite',
            }}
          />

          {/* Center glow disc */}
          <div
            className="absolute inset-6 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 40% 35%, #FFF4F8, #FFE0EE)',
              boxShadow: '0 0 24px 8px rgba(255,79,163,0.20)',
              animation: 'logo-pulse 2s ease-in-out infinite',
            }}
          >
            {/* Bunny SVG */}
            <svg
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-14 drop-shadow-md"
              style={{ animation: 'logo-bounce 1.8s ease-in-out infinite' }}
            >
              {/* Soft BG circle */}
              <circle cx="60" cy="60" r="54" fill="#FFF4F8" />

              {/* Left Ear */}
              <path d="M44 48C38 32 36 12 45 10C54 8 55 28 50 48" fill="#FFD8EA" stroke="#FF4FA3" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M43 38C40 28 39 18 44 16C49 14 50 25 47 38" fill="#FF4FA3" opacity="0.35" />

              {/* Right Ear */}
              <path d="M76 48C82 32 84 12 75 10C66 8 65 28 70 48" fill="#FFD8EA" stroke="#FF4FA3" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M77 38C80 28 81 18 76 16C71 14 70 25 73 38" fill="#FF4FA3" opacity="0.35" />

              {/* Head */}
              <ellipse cx="60" cy="68" rx="36" ry="32" fill="#FFFFFF" stroke="#FF4FA3" strokeWidth="2.5" />

              {/* Cheeks */}
              <circle cx="42" cy="72" r="5.5" fill="#FF80BF" opacity="0.4" />
              <circle cx="78" cy="72" r="5.5" fill="#FF80BF" opacity="0.4" />

              {/* Sparkle eyes (celebrate) */}
              <path d="M44 63C47 60 51 60 54 63" stroke="#263550" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M66 63C69 60 73 60 76 63" stroke="#263550" strokeWidth="2.5" strokeLinecap="round" />

              {/* Nose & Mouth */}
              <path d="M58 68C59 67 61 67 62 68L60 70L58 68Z" fill="#FF4FA3" />
              <path d="M60 70V73M60 73C58 75 56 74 55 73M60 73C62 75 64 74 65 73" stroke="#263550" strokeWidth="1.8" strokeLinecap="round" />

              {/* Bow */}
              <g transform="translate(38, 42)">
                <path d="M-6 -4C-2 -2 -2 2 -6 4C-9 2 -9 -2 -6 -4Z" fill="#FF4FA3" />
                <path d="M6 -4C2 -2 2 2 6 4C9 2 9 -2 6 -4Z" fill="#FF4FA3" />
                <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" stroke="#FF4FA3" strokeWidth="1" />
              </g>

              {/* Sparkle stars around the bunny */}
              <g style={{ animation: 'logo-sparkle 1.6s ease-in-out infinite' }}>
                <circle cx="18" cy="30" r="2.5" fill="#FF4FA3" opacity="0.8" />
                <circle cx="102" cy="28" r="1.8" fill="#CBE7FA" opacity="0.9" />
                <circle cx="20" cy="90" r="2" fill="#FFD8EA" opacity="0.7" />
                <circle cx="100" cy="95" r="2.5" fill="#FF4FA3" opacity="0.6" />
              </g>
            </svg>
          </div>

          {/* Orbiting dot 1 */}
          <div
            className="absolute w-3 h-3 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              marginTop: '-6px',
              marginLeft: '-6px',
              background: '#FF4FA3',
              boxShadow: '0 0 8px 3px rgba(255,79,163,0.5)',
              animation: 'orbit-1 2.2s linear infinite',
              transformOrigin: '6px 6px',
            }}
          />
          {/* Orbiting dot 2 */}
          <div
            className="absolute w-2 h-2 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              marginTop: '-4px',
              marginLeft: '-4px',
              background: '#CBE7FA',
              boxShadow: '0 0 6px 2px rgba(2,132,199,0.4)',
              animation: 'orbit-2 1.7s linear infinite reverse',
              transformOrigin: '4px 4px',
            }}
          />
        </div>

        {/* Brand wordmark */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-2xl font-black tracking-widest text-[#263550] uppercase"
              style={{ letterSpacing: '0.18em', fontFamily: 'Outfit, sans-serif' }}
            >
              Neria
            </span>
            <span
              className="text-2xl font-black tracking-widest text-[#FF4FA3] uppercase"
              style={{ letterSpacing: '0.18em', fontFamily: 'Outfit, sans-serif' }}
            >
              Collective
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#98A0AE]">
            Admin Console
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-56 h-1.5 bg-[#FFD8EA] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #FF4FA3, #FF80BF, #CBE7FA, #FF4FA3)',
              backgroundSize: '300% 100%',
              animation: 'progress-slide 1.8s linear infinite',
            }}
          />
        </div>

        {/* Message text */}
        <p
          className="text-sm font-semibold text-[#667085] tracking-wide"
          style={{ animation: 'text-fade 1.8s ease-in-out infinite' }}
        >
          {message}
        </p>
      </div>

      {/* ===== Global keyframe styles ===== */}
      <style>{`
        @keyframes logo-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes logo-spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes logo-pulse {
          0%, 100% { box-shadow: 0 0 18px 6px rgba(255,79,163,0.18); }
          50%       { box-shadow: 0 0 32px 12px rgba(255,79,163,0.34); }
        }
        @keyframes logo-bounce {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50%       { transform: translateY(-4px) rotate(1deg); }
        }
        @keyframes logo-sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.3; transform: scale(0.5); }
        }
        @keyframes orbit-1 {
          0%   { transform: rotate(0deg)   translateX(52px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(52px) rotate(-360deg); }
        }
        @keyframes orbit-2 {
          0%   { transform: rotate(0deg)   translateX(44px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(44px) rotate(-360deg); }
        }
        @keyframes progress-slide {
          0%   { background-position: 0% 0; }
          100% { background-position: 300% 0; }
        }
        @keyframes text-fade {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        @keyframes pulse-dot {
          0%, 100% { r: 3; opacity: 1; }
          50%       { r: 4.5; opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
