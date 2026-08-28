'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'md',
  footer
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-[#101828]/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen ${widthClasses[width]} bg-white shadow-2xl flex flex-col border-l border-[#F2F3F5] animate-in slide-in-from-right duration-300`}>
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#F2F3F5] flex items-center justify-between bg-[#FFF4F8]/50">
            <div>
              <h3 className="text-lg font-bold text-[#263550]">{title}</h3>
              {subtitle && <p className="text-xs text-[#667085] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#98A0AE] hover:text-[#263550] hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div className="p-4 sm:p-6 border-t border-[#F2F3F5] bg-[#F8F8FA]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
