'use client';

import React, { useState } from 'react';
import { PageConfig } from '@/src/lib/types';
import { BunnyMascot } from '../ui/BunnyMascot';
import { ChevronDown, Sparkles, Mail, Phone, MapPin, Clock } from 'lucide-react';

interface StorefrontPagesViewProps {
  page: PageConfig;
  isEditorMode?: boolean;
}

export function StorefrontPagesView({ page, isEditorMode }: StorefrontPagesViewProps) {
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="bg-white min-h-[500px] py-16 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Neria Collective</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#263550] tracking-tight font-sans">
            {page.title}
          </h1>
          {page.description && (
            <p className="text-xs sm:text-sm text-[#667085] mt-3 leading-relaxed">
              {page.description}
            </p>
          )}
        </div>

        {/* Dynamic Blocks Rendering */}
        <div className="space-y-12">
          {page.blocks.map((block, idx) => {
            if (block.type === 'heading') {
              return (
                <div key={block.id || idx} className="border-b border-[#F2F3F5] pb-4">
                  {block.content.subtitle && (
                    <span className="text-[11px] font-bold text-[#FF4FA3] uppercase tracking-wider">
                      {block.content.subtitle}
                    </span>
                  )}
                  <h3 className="text-2xl font-bold text-[#263550] mt-1">
                    {block.content.title}
                  </h3>
                </div>
              );
            }

            if (block.type === 'text') {
              return (
                <div key={block.id || idx} className="text-sm sm:text-base text-[#475467] leading-relaxed">
                  <p>{block.content.text}</p>
                </div>
              );
            }

            if (block.type === 'image_text') {
              const isLeft = block.content.layout === 'image_left';
              return (
                <div key={block.id || idx} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className={`aspect-4/3 rounded-3xl overflow-hidden bg-[#F8F8FA] shadow-md ${isLeft ? 'order-1' : 'order-2'}`}>
                    <img
                      src={block.content.image}
                      alt={block.content.heading}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`space-y-3 ${isLeft ? 'order-2' : 'order-1'}`}>
                    <h4 className="text-xl font-bold text-[#263550]">{block.content.heading}</h4>
                    <p className="text-sm text-[#667085] leading-relaxed">{block.content.text}</p>
                  </div>
                </div>
              );
            }

            if (block.type === 'faq') {
              return (
                <div key={block.id || idx} className="space-y-3">
                  <h4 className="text-sm font-bold text-[#263550] uppercase tracking-wider mb-4">
                    {block.content.category || 'Frequently Asked Questions'}
                  </h4>
                  {block.content.items?.map((item: any, fIdx: number) => {
                    const isOpen = openFaqIndices.includes(fIdx);
                    return (
                      <div
                        key={fIdx}
                        className="rounded-2xl border border-[#F2F3F5] overflow-hidden transition-all bg-[#F8F8FA]/60"
                      >
                        <button
                          onClick={() => toggleFaq(fIdx)}
                          className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#263550] hover:text-[#FF4FA3]"
                        >
                          <span>{item.question}</span>
                          <ChevronDown className={`w-4 h-4 text-[#98A0AE] transition-transform ${isOpen ? 'rotate-180 text-[#FF4FA3]' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs text-[#667085] leading-relaxed border-t border-[#F2F3F5] bg-white">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }

            if (block.type === 'size_guide') {
              return (
                <div key={block.id || idx} className="space-y-4">
                  <h4 className="text-sm font-bold text-[#263550] uppercase tracking-wider">
                    {block.content.category || 'Body Measurement Chart (Inches)'}
                  </h4>
                  <div className="overflow-x-auto rounded-2xl border border-[#F2F3F5] shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FFF4F8] text-[#263550] font-bold">
                        <tr>
                          <th className="p-3.5">Size</th>
                          <th className="p-3.5">Bust</th>
                          <th className="p-3.5">Waist</th>
                          <th className="p-3.5">Hips</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2F3F5] text-[#475467]">
                        {block.content.rows?.map((row: any, rIdx: number) => (
                          <tr key={rIdx} className="hover:bg-[#F8F8FA]">
                            <td className="p-3.5 font-bold text-[#263550]">{row.size}</td>
                            <td className="p-3.5">{row.bust}</td>
                            <td className="p-3.5">{row.waist}</td>
                            <td className="p-3.5">{row.hips}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}
