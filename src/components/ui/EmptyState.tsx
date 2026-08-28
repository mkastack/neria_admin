'use client';

import React from 'react';
import { BunnyMascot } from './BunnyMascot';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  bunnyMood?: 'happy' | 'celebrate' | 'thinking' | 'sleeping';
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  bunnyMood = 'happy'
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-[#DDE1E7] my-4">
      <div className="p-4 bg-[#FFF4F8] rounded-full mb-4 ring-8 ring-[#FFF4F8]/50">
        <BunnyMascot size="lg" mood={bunnyMood} />
      </div>
      <h3 className="text-lg font-bold text-[#263550]">{title}</h3>
      <p className="text-sm text-[#667085] max-w-md mt-1.5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 neria-btn-primary text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
