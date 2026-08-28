'use client';

import React from 'react';

export type StatusVariant = 
  | 'Paid' | 'Pending' | 'Failed' | 'Refunded'
  | 'Unfulfilled' | 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'
  | 'Active' | 'Draft' | 'Archived' | 'Scheduled' | 'Expired'
  | 'In Stock' | 'Low Stock' | 'Out of Stock'
  | 'VIP' | 'New' | 'Returning' | 'At Risk'
  | 'Approved' | 'Flagged' | 'Hidden' | 'Featured' | 'Requested' | 'Completed' | 'Success';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export function StatusBadge({ status, size = 'sm', showDot = true }: StatusBadgeProps) {
  const getBadgeStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case 'paid':
      case 'delivered':
      case 'active':
      case 'approved':
      case 'completed':
      case 'success':
      case 'in stock':
        return {
          bg: 'bg-[#ECFDF3]',
          text: 'text-[#027A48]',
          border: 'border-[#ABEFC6]',
          dot: 'bg-[#12B76A]'
        };
      case 'pending':
      case 'processing':
      case 'packed':
      case 'scheduled':
      case 'requested':
      case 'invited':
        return {
          bg: 'bg-[#FFFAEB]',
          text: 'text-[#B54708]',
          border: 'border-[#FEDF89]',
          dot: 'bg-[#F79009]'
        };
      case 'shipped':
      case 'in transit':
      case 'returning':
        return {
          bg: 'bg-[#F4F3FF]',
          text: 'text-[#5925DC]',
          border: 'border-[#D9D6FE]',
          dot: 'bg-[#7A5AF8]'
        };
      case 'vip':
      case 'featured':
        return {
          bg: 'bg-[#FFF4F8]',
          text: 'text-[#FF4FA3]',
          border: 'border-[#FFD8EA]',
          dot: 'bg-[#FF4FA3]'
        };
      case 'low stock':
      case 'at risk':
      case 'flagged':
        return {
          bg: 'bg-[#FFF6ED]',
          text: 'text-[#C4320A]',
          border: 'border-[#FECDCA]',
          dot: 'bg-[#F04438]'
        };
      case 'failed':
      case 'cancelled':
      case 'rejected':
      case 'out of stock':
      case 'expired':
      case 'suspended':
        return {
          bg: 'bg-[#FEF3F2]',
          text: 'text-[#B42318]',
          border: 'border-[#FECDCA]',
          dot: 'bg-[#F04438]'
        };
      case 'draft':
      case 'archived':
      case 'unfulfilled':
      case 'refunded':
      case 'returned':
      default:
        return {
          bg: 'bg-[#F8F8FA]',
          text: 'text-[#475467]',
          border: 'border-[#DDE1E7]',
          dot: 'bg-[#98A0AE]'
        };
    }
  };

  const style = getBadgeStyle(status);
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses} whitespace-nowrap select-none transition-colors`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
      <span>{status}</span>
    </span>
  );
}
