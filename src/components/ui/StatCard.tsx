'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export type CardTheme = 'white' | 'pink' | 'blue' | 'cream';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  comparisonText?: string;
  icon: React.ReactNode;
  theme?: CardTheme;
  sparklineData?: number[];
  onClick?: () => void;
  delay?: number; // stagger entrance delay ms
}

/* ─── Animated counter ─────────────────────────────────────────── */
function AnimatedValue({ value }: { value: string }) {
  const [displayed, setDisplayed] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Match the first number (with optional commas/decimals) in the string
    const match = value.match(/[\d,]+\.?\d*/);
    if (!match || match.index === undefined) return;

    const raw = match[0];                              // e.g. "48,920" or "3.8"
    const target = parseFloat(raw.replace(/,/g, '')); // 48920 or 3.8
    const prefix = value.slice(0, match.index);        // "$"
    const suffix = value.slice(match.index + raw.length); // "%" or ""
    const hasDecimals = raw.includes('.');
    const decimals = hasDecimals ? (raw.split('.')[1]?.length ?? 1) : 0;
    const useCommas = target >= 1000;

    const duration = 1000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      // Ease-out quart
      const eased = 1 - Math.pow(1 - t, 4);
      const current = target * eased;

      let formatted: string;
      if (hasDecimals) {
        formatted = current.toFixed(decimals);
      } else if (useCommas) {
        formatted = Math.round(current).toLocaleString('en-US');
      } else {
        formatted = String(Math.round(current));
      }

      setDisplayed(`${prefix}${formatted}${suffix}`);
      if (t < 1) requestAnimationFrame(tick);
    };

    // Small delay so the card entrance animation plays first
    setTimeout(() => requestAnimationFrame(tick), 180);
  }, [value]);

  return <span>{displayed}</span>;
}

/* ─── Animated sparkline ───────────────────────────────────────── */
function AnimatedSparkline({ data, stroke }: { data: number[]; stroke: string }) {
  const lineRef = useRef<SVGPolylineElement>(null);
  const [len, setLen] = useState(0);
  const [drawn, setDrawn] = useState(false);

  const W = 88, H = 38;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 10) - 5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const fillPts = `0,${H} ${pts} ${W},${H}`;
  const gradId = `sg-${stroke.replace('#', '')}`;

  useEffect(() => {
    if (!lineRef.current) return;
    const l = lineRef.current.getTotalLength?.() ?? 200;
    setLen(l);
    const raf = requestAnimationFrame(() =>
      setTimeout(() => setDrawn(true), 200)
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  // last point for the pulsing dot
  const lastV = data[data.length - 1];
  const dotX = W;
  const dotY = H - ((lastV - min) / range) * (H - 10) - 5;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <polygon
        points={fillPts}
        fill={`url(#${gradId})`}
        style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.5s ease 0.4s' }}
      />

      {/* Animated stroke */}
      <polyline
        ref={lineRef}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
        style={{
          strokeDasharray: len || 200,
          strokeDashoffset: drawn ? 0 : len || 200,
          transition: `stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1) 0.1s`,
        }}
      />

      {/* Pulsing end dot */}
      {drawn && (
        <>
          <circle cx={dotX} cy={dotY} r="5" fill={stroke} opacity="0.18" />
          <circle
            cx={dotX}
            cy={dotY}
            r="3"
            fill={stroke}
            style={{
              filter: `drop-shadow(0 0 4px ${stroke}aa)`,
              animation: 'sc-pulse 2.2s ease-in-out infinite',
            }}
          />
        </>
      )}

      <style>{`
        @keyframes sc-pulse {
          0%,100% { r: 3; }
          50% { r: 4.5; }
        }
      `}</style>
    </svg>
  );
}

/* ─── Theme map ────────────────────────────────────────────────── */
const THEMES: Record<CardTheme, {
  card: string;
  border: string;
  glow: string;
  iconRing: string;
  iconColor: string;
  stroke: string;
  orb: string;
}> = {
  pink: {
    card: 'bg-gradient-to-br from-[#fff4f8] via-[#fff0f5] to-[#ffe8f2]',
    border: 'border-[#ffd8ea]',
    glow: '0 12px 40px -8px rgba(255,79,163,0.22)',
    iconRing: 'bg-white ring-1 ring-[#ffd8ea]',
    iconColor: 'text-[#FF4FA3]',
    stroke: '#FF4FA3',
    orb: '#FF4FA3',
  },
  blue: {
    card: 'bg-gradient-to-br from-[#f2f8fd] via-[#edf5fb] to-[#deeef8]',
    border: 'border-[#cbe7fa]',
    glow: '0 12px 40px -8px rgba(2,132,199,0.18)',
    iconRing: 'bg-white ring-1 ring-[#cbe7fa]',
    iconColor: 'text-[#026AA2]',
    stroke: '#0284C7',
    orb: '#0284C7',
  },
  cream: {
    card: 'bg-gradient-to-br from-[#fffaf5] via-[#fff7ee] to-[#fff0db]',
    border: 'border-[#fedf89]/70',
    glow: '0 12px 40px -8px rgba(247,144,9,0.18)',
    iconRing: 'bg-white ring-1 ring-[#fedf89]/60',
    iconColor: 'text-[#B54708]',
    stroke: '#F79009',
    orb: '#F79009',
  },
  white: {
    card: 'bg-white',
    border: 'border-[#f2f3f5]',
    glow: '0 8px 28px -6px rgba(38,53,80,0.10)',
    iconRing: 'bg-[#fff4f8] ring-1 ring-[#ffd8ea]/60',
    iconColor: 'text-[#FF4FA3]',
    stroke: '#FF4FA3',
    orb: '#FF4FA3',
  },
};

/* ─── StatCard ─────────────────────────────────────────────────── */
export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  comparisonText = 'vs previous period',
  icon,
  theme = 'white',
  sparklineData = [28, 38, 32, 52, 45, 68, 60, 80, 74, 92],
  onClick,
  delay = 0,
}: StatCardProps) {
  const t = THEMES[theme];
  const [entered, setEntered] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 60 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative overflow-hidden rounded-[1.6rem] border
        ${t.card} ${t.border}
        p-5 flex flex-col gap-3
        ${onClick ? 'cursor-pointer' : ''}
      `}
      style={{
        boxShadow: hovered
          ? t.glow.replace(/-8px/, '-2px').replace(/0\.\d+\)/, '0.32)')
          : t.glow,
        transform: entered
          ? hovered
            ? 'translateY(-4px) scale(1.018)'
            : 'translateY(0) scale(1)'
          : 'translateY(14px) scale(0.97)',
        opacity: entered ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, opacity 0.4s ease',
      }}
    >
      {/* Shimmer sweep on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.6rem] overflow-hidden"
        aria-hidden
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(110deg, transparent 30%, ${t.orb}12 50%, transparent 70%)`,
            transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
            transition: hovered ? 'transform 0.65s ease' : 'none',
          }}
        />
      </div>

      {/* Corner glow orb */}
      <div
        className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl"
        style={{
          background: t.orb,
          opacity: hovered ? 0.28 : 0.12,
          transition: 'opacity 0.35s ease',
        }}
        aria-hidden
      />

      {/* ── Row 1: Label + Icon ── */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <span className="text-[10.5px] font-bold text-[#98A0AE] tracking-[0.12em] uppercase leading-tight">
          {title}
        </span>

        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${t.iconRing} ${t.iconColor}`}
          style={{
            boxShadow: `0 4px 16px -4px ${t.orb}44`,
            transform: hovered ? 'scale(1.12) rotate(4deg)' : 'scale(1) rotate(0)',
            transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {icon}
        </div>
      </div>

      {/* ── Row 2: Big value ── */}
      <div className="relative z-10">
        <h3
          className="text-[1.72rem] font-extrabold text-[#263550] leading-none tracking-tight"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          <AnimatedValue value={value} />
        </h3>
      </div>

      {/* ── Row 3: Badge + Sparkline ── */}
      <div className="flex items-end justify-between gap-2 relative z-10 mt-auto">
        <div className="flex flex-col gap-0.5">
          <span
            className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-full
              text-[11px] font-bold w-fit
              ${isPositive
                ? 'bg-[#ecfdf3] text-[#027A48]'
                : 'bg-[#fef3f2] text-[#B42318]'
              }
            `}
          >
            {isPositive
              ? <TrendingUp className="w-3 h-3 shrink-0" />
              : <TrendingDown className="w-3 h-3 shrink-0" />
            }
            {change}
          </span>
          <span className="text-[10px] text-[#B0B8C5] font-medium ml-0.5 leading-tight">
            {comparisonText}
          </span>
        </div>

        <div className="shrink-0 w-[88px] h-[38px]">
          <AnimatedSparkline data={sparklineData} stroke={t.stroke} />
        </div>
      </div>
    </div>
  );
}
