'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityUGCPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/reviews');
  }, [router]);

  return (
    <div className="p-8 text-center text-sm text-[#667085]">
      Redirecting to Customer Reviews...
    </div>
  );
}
