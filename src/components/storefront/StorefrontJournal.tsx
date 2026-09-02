'use client';

import React from 'react';
import { JournalSectionContent } from '@/src/lib/types';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BookOpen, ArrowUpRight, Clock, User } from 'lucide-react';

interface StorefrontJournalProps {
  content: JournalSectionContent;
  isEditorMode?: boolean;
}

export function StorefrontJournal({ content, isEditorMode }: StorefrontJournalProps) {
  const { journalArticles } = useStorefrontCms();

  const articles = content.articleIds
    ?.map(id => journalArticles.find(a => a.id === id))
    .filter(Boolean) as typeof journalArticles || journalArticles.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4F8] border border-[#FFD8EA] text-[#FF4FA3] text-[11px] font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3 h-3" />
              <span>Editorial Musings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#263550] tracking-tight">
              {content.heading || 'The Neria Journal ✍️'}
            </h2>
            {content.subtitle && (
              <p className="text-xs sm:text-sm text-[#667085] mt-1">{content.subtitle}</p>
            )}
          </div>

          <span className="text-xs font-bold text-[#FF4FA3] hover:underline cursor-pointer flex items-center gap-1">
            Read All Stories <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(article => (
            <article
              key={article.id}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#F2F3F5] hover:border-[#FFD8EA] hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Cover Image */}
              <div className="aspect-16/10 overflow-hidden relative bg-[#F8F8FA]">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-[#263550] shadow-xs">
                  {article.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-[#98A0AE]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                    <span>•</span>
                    <span>{article.publishDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#263550] group-hover:text-[#FF4FA3] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F8F8FA] flex items-center justify-between text-xs font-semibold text-[#FF4FA3]">
                  <span>Read Article</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
