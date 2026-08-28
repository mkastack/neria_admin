'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { HeartHandshake, Sparkles, Check, X, Star, Heart } from 'lucide-react';
import { CommunityPost } from '@/src/lib/types';

export default function CommunityUGCPage() {
  const { communityPosts, setCommunityPosts, addToast } = useAdmin();

  const handleFeature = (id: string) => {
    setCommunityPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'Featured' } : p));
    addToast({
      type: 'success',
      title: 'Featured on Homepage ♡',
      description: 'Customer outfit photo pinned to #NeriaGirls feed.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Neria Girls (UGC Community)</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Moderate customer outfit photos, tag featured apparel, and curate the social lookbook wall.
          </p>
        </div>
      </div>

      {/* Grid of Community Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {communityPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl border border-[#F2F3F5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="relative aspect-4/5 w-full bg-[#F8F8FA] overflow-hidden">
                <img src={post.image} alt={post.username} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={post.status} />
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-[#FF4FA3] text-[#FF4FA3]" />
                  <span>{post.likesCount}</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <img src={post.avatar} alt={post.username} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-bold text-[#263550]">{post.username}</span>
                </div>

                <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">{post.caption}</p>

                <div className="pt-2 border-t border-[#F2F3F5] space-y-1">
                  <span className="text-[10px] text-[#98A0AE] font-bold uppercase">Tagged Outfits:</span>
                  <div className="flex flex-wrap gap-1">
                    {post.taggedProducts.map((p, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FFF4F8] text-[#FF4FA3]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 border-t border-[#F2F3F5] bg-[#F8F8FA] flex items-center justify-between gap-2">
              {post.status !== 'Featured' ? (
                <button
                  onClick={() => handleFeature(post.id)}
                  className="w-full neria-btn-primary py-1.5 text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Feature on Lookbook</span>
                </button>
              ) : (
                <span className="w-full py-1 text-center text-xs font-bold text-[#027A48]">
                  ✓ Featured on Storefront
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
