'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Drawer } from '@/src/components/ui/Drawer';
import { Star, CheckCircle2, MessageSquare, ShieldAlert, Send } from 'lucide-react';
import { Review } from '@/src/lib/types';

import { updateReviewInDB } from '@/src/lib/firebase/reviews';

export default function ReviewsPage() {
  const { reviews, addToast } = useAdmin();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyInput, setReplyInput] = useState('');

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview || !replyInput.trim()) return;

    try {
      await updateReviewInDB(selectedReview.id, { adminReply: replyInput.trim() });
      setReplyInput('');
      setSelectedReview(null);
      addToast({
        type: 'success',
        title: 'Reply Published ♡',
        description: 'Official brand response posted under customer review in Firestore.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Reply Failed',
        description: err instanceof Error ? err.message : 'Please try again.'
      });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateReviewInDB(id, { status: 'Approved' });
      addToast({
        type: 'success',
        title: 'Review Approved ♡',
        description: 'Review is now visible on the live storefront product page.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Approval Failed',
        description: err instanceof Error ? err.message : 'Please try again.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Customer Reviews & Ratings</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Moderate verified customer testimonials, star ratings, and publish brand replies.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Average Store Rating"
          value={`${avgRating} ★`}
          change="From 142 Reviews"
          isPositive={true}
          theme="pink"
          icon={<Star className="w-5 h-5" />}
        />
        <StatCard
          title="Approved Reviews"
          value={`${reviews.filter(r => r.status === 'Approved').length} Live`}
          change="Publicly visible"
          isPositive={true}
          theme="white"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <StatCard
          title="Featured Testimonials"
          value={`${reviews.filter(r => r.featured).length} Featured`}
          change="Homepage lookbook"
          isPositive={true}
          theme="cream"
          icon={<MessageSquare className="w-5 h-5" />}
        />
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Rating</th>
                <th className="py-4 px-3">Product</th>
                <th className="py-4 px-3">Customer</th>
                <th className="py-4 px-3">Review & Comment</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#FF4FA3]">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FF4FA3] text-[#FF4FA3]" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#263550]">{rev.productName}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <img src={rev.customerAvatar} alt={rev.customerName} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-semibold text-[#263550]">{rev.customerName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 max-w-xs">
                    <p className="font-bold text-[#263550] truncate">{rev.title}</p>
                    <p className="text-[#667085] text-[11px] line-clamp-1">{rev.content}</p>
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={rev.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedReview(rev);
                        setReplyInput(rev.adminReply || '');
                      }}
                      className="px-3 py-1.5 rounded-xl border border-[#DDE1E7] hover:border-[#FFD8EA] hover:bg-[#FFF4F8] text-[#263550] text-xs font-semibold cursor-pointer"
                    >
                      Reply / Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Reply Drawer */}
      {selectedReview && (
        <Drawer
          isOpen={Boolean(selectedReview)}
          onClose={() => setSelectedReview(null)}
          title="Review Moderation & Reply"
          subtitle={`By ${selectedReview.customerName} on ${selectedReview.productName}`}
        >
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] space-y-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: selectedReview.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FF4FA3] text-[#FF4FA3]" />
                ))}
              </div>
              <h4 className="text-sm font-bold text-[#263550]">{selectedReview.title}</h4>
              <p className="text-xs text-[#667085] leading-relaxed">{selectedReview.content}</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3">
              <label className="block text-xs font-bold text-[#263550]">Brand Response</label>
              <textarea
                rows={3}
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Thank you darling! We hope it keeps you extra cozy ♡"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none"
              />
              <button
                type="submit"
                className="w-full neria-btn-primary py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Reply ♡</span>
              </button>
            </form>
          </div>
        </Drawer>
      )}
    </div>
  );
}
