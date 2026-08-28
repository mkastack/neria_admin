'use client';

import React from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { BunnyMascot } from './BunnyMascot';

export function ToastContainer() {
  const { toasts, removeToast } = useAdmin();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isCelebratory = toast.title.includes('♡') || toast.title.includes('Fulfilled');

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#F2F3F5] shadow-lg shadow-[#263550]/8 transition-all duration-300 animate-in slide-in-from-bottom-3"
          >
            {isCelebratory ? (
              <BunnyMascot size="sm" mood="celebrate" className="shrink-0 -mt-1" />
            ) : toast.type === 'success' ? (
              <div className="p-1 rounded-full bg-[#ECFDF3] text-[#027A48] shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : toast.type === 'error' ? (
              <div className="p-1 rounded-full bg-[#FEF3F2] text-[#B42318] shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
            ) : toast.type === 'warning' ? (
              <div className="p-1 rounded-full bg-[#FFFAEB] text-[#B54708] shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-1 rounded-full bg-[#F0F9FF] text-[#026AA2] shrink-0">
                <Info className="w-5 h-5" />
              </div>
            )}

            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="text-sm font-semibold text-[#263550]">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#98A0AE] hover:text-[#263550] transition-colors p-1 rounded-lg hover:bg-[#F2F3F5]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
