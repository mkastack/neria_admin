'use client';

import React from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { Drawer } from './Drawer';
import { BookOpen, Command, LifeBuoy, Mail, ExternalLink } from 'lucide-react';
import { BunnyMascot } from './BunnyMascot';

export function HelpDrawer() {
  const { isHelpOpen, setIsHelpOpen } = useAdmin();

  return (
    <Drawer
      isOpen={isHelpOpen}
      onClose={() => setIsHelpOpen(false)}
      title="Admin Knowledge & Support"
      subtitle="Guides, shortcuts and operational support"
      width="md"
    >
      <div className="space-y-6">
        {/* Soft Mascot Note */}
        <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center gap-3.5">
          <BunnyMascot size="sm" mood="happy" className="shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-[#263550]">Neria Admin Hub</h4>
            <p className="text-xs text-[#667085] mt-0.5">Need assistance managing products, fulfilling orders, or configuring settings?</p>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#98A0AE] mb-3 flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5" /> Keyboard Shortcuts
          </h4>
          <div className="space-y-2 text-sm bg-[#F8F8FA] p-3 rounded-2xl border border-[#DDE1E7]">
            <div className="flex items-center justify-between py-1">
              <span className="text-[#344054]">Quick Search</span>
              <kbd className="px-2 py-0.5 bg-white border border-[#DDE1E7] rounded text-xs font-semibold text-[#263550]">Ctrl / ⌘ + K</kbd>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[#344054]">Toggle Sidebar</span>
              <kbd className="px-2 py-0.5 bg-white border border-[#DDE1E7] rounded text-xs font-semibold text-[#263550]">Ctrl / ⌘ + B</kbd>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[#344054]">Close Modal / Drawer</span>
              <kbd className="px-2 py-0.5 bg-white border border-[#DDE1E7] rounded text-xs font-semibold text-[#263550]">Esc</kbd>
            </div>
          </div>
        </div>

        {/* Quick Operations Guide */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#98A0AE] mb-3 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Quick Operations
          </h4>
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl border border-[#F2F3F5] bg-white hover:border-[#FFD8EA] transition-colors">
              <h5 className="text-sm font-semibold text-[#263550]">How to fulfill MoMo & Card orders</h5>
              <p className="text-xs text-[#667085] mt-1">Navigate to Commerce &gt; Orders, select the order, pick the packed items and assign a US courier (USPS, UPS, or FedEx).</p>
            </div>
            <div className="p-3 rounded-xl border border-[#F2F3F5] bg-white hover:border-[#FFD8EA] transition-colors">
              <h5 className="text-sm font-semibold text-[#263550]">Restocking low inventory</h5>
              <p className="text-xs text-[#667085] mt-1">Go to Inventory &gt; Adjust Stock. Enter the added quantity and reason to automatically recalculate available stock.</p>
            </div>
          </div>
        </div>

        {/* Support contacts */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#98A0AE] mb-3 flex items-center gap-1.5">
            <LifeBuoy className="w-3.5 h-3.5" /> Support Channels
          </h4>
          <div className="space-y-2">
            <a
              href="mailto:support@neriacollective.com"
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#F2F3F5] hover:bg-[#FFF4F8] transition-colors text-sm font-medium text-[#263550]"
            >
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF4FA3]" /> Email Admin Support
              </span>
              <ExternalLink className="w-4 h-4 text-[#98A0AE]" />
            </a>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
