'use client';

import React from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import {
  History, RotateCcw, CheckCircle2, ShieldCheck, Sparkles, User,
  Clock, ArrowRight
} from 'lucide-react';

export default function PublishHistoryPage() {
  const { publishHistory, restoreVersion, publishedConfig } = useStorefrontCms();

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-1.5">
          <History className="w-3.5 h-3.5" />
          <span>Release Auditing</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#263550] tracking-tight">
          Publish History & Version Rollbacks
        </h1>
        <p className="text-xs text-[#667085] mt-1">
          Every website publication automatically creates a permanent snapshot. You can safely restore any previous version with a single click.
        </p>
      </div>

      {/* History Timeline Cards */}
      <div className="rounded-3xl bg-white border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#F2F3F5] bg-[#F8F8FA]/60 flex items-center justify-between">
          <span className="text-xs font-bold text-[#263550] uppercase tracking-wider">
            Recorded Releases ({publishHistory.length})
          </span>
          <span className="text-xs text-[#027A48] font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Currently Active: Version {publishedConfig.version || 28}</span>
          </span>
        </div>

        <div className="divide-y divide-[#F2F3F5]">
          {publishHistory.map((version, idx) => {
            const isCurrent = version.versionNumber === publishedConfig.version;
            return (
              <div
                key={version.id}
                className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${
                  isCurrent ? 'bg-[#FFF4F8]/40' : 'hover:bg-[#F8F8FA]'
                }`}
              >
                {/* Release Info */}
                <div className="space-y-2.5 max-w-xl">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      isCurrent
                        ? 'bg-[#FF4FA3] text-white'
                        : 'bg-[#263550] text-white'
                    }`}>
                      v{version.versionNumber}
                    </span>
                    <span className="text-xs font-bold text-[#263550]">{version.publishedAt}</span>
                    <span className="text-xs text-[#98A0AE] flex items-center gap-1">
                      <User className="w-3 h-3 text-[#FF4FA3]" /> {version.publishedBy}
                    </span>
                  </div>

                  {/* Changes List */}
                  <div className="space-y-1 pl-1">
                    {version.changeSummary.map((c, cIdx) => (
                      <div key={cIdx} className="text-xs text-[#475467] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4FA3]" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {isCurrent ? (
                    <span className="px-4 py-2 rounded-xl bg-[#ECFDF3] text-[#027A48] font-bold text-xs border border-[#ABEFC6]">
                      ✓ Currently Live
                    </span>
                  ) : (
                    <button
                      onClick={() => restoreVersion(version.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#FF4FA3] text-[#263550] hover:text-white font-bold text-xs border border-[#DDE1E7] hover:border-[#FF4FA3] shadow-xs transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore This Version</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
