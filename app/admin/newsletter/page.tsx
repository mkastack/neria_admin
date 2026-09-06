'use client';

import React, { useMemo } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatCard } from '@/src/components/ui/StatCard';
import { Mail, Users, TrendingUp, Download, CheckCircle2, XCircle } from 'lucide-react';
import { useNewsletterSubscribers } from '@/src/lib/firebase/newsletter';

export default function NewsletterPage() {
  const { addToast } = useAdmin();
  const { subscribers, loading } = useNewsletterSubscribers(500);

  const totalActive = subscribers.length;
  const bySource = useMemo(() => {
    const map: Record<string, number> = {};
    subscribers.forEach((s) => {
      map[s.source] = (map[s.source] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [subscribers]);

  const handleExport = () => {
    const csv =
      'Email,Name,Source,Opted In\n' +
      subscribers
        .map((s) => `${s.email},${s.name || ''},${s.source},${s.optedIn}`)
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neria-newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'info',
      title: 'Subscribers Exported',
      description: `${totalActive} VIP emails exported as CSV.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">VIP Newsletter Club</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Real-time subscriber list from Firestore — sign-ups from{' '}
            <span className="text-[#FF4FA3] font-semibold">neria-commerce.vercel.app</span>{' '}
            appear here instantly.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#667085]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Subscribers"
          value={loading ? '…' : totalActive.toLocaleString()}
          change="Live from Firestore"
          isPositive={true}
          theme="pink"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Sign-up Sources"
          value={loading ? '…' : String(bySource.length)}
          change="Channels tracked"
          isPositive={true}
          theme="blue"
          icon={<Mail className="w-5 h-5" />}
        />
        <StatCard
          title="Top Channel"
          value={loading ? '…' : (bySource[0]?.[0] ?? 'N/A')}
          change={loading ? '' : `${bySource[0]?.[1] ?? 0} sign-ups`}
          isPositive={true}
          theme="white"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Source breakdown */}
      {bySource.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs">
          <h3 className="text-sm font-bold text-[#263550] mb-4">Subscribers by Sign-up Channel</h3>
          <div className="flex flex-wrap gap-2">
            {bySource.map(([src, count]) => (
              <span key={src} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FFF4F8] text-[#FF4FA3] border border-[#FFD8EA]">
                {src}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Subscribers Table */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-xs text-[#98A0AE]">Loading real-time subscribers…</div>
          ) : subscribers.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#98A0AE]">No opted-in subscribers yet.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-4">Email Address</th>
                  <th className="py-4 px-3">Name</th>
                  <th className="py-4 px-3">Channel</th>
                  <th className="py-4 px-3">Since</th>
                  <th className="py-4 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F3F5] text-xs">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#FFF4F8]/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#263550]">{sub.email}</td>
                    <td className="py-3.5 px-3 text-[#263550]">{sub.name || '—'}</td>
                    <td className="py-3.5 px-3 text-[#667085] capitalize">{sub.source}</td>
                    <td className="py-3.5 px-3 text-[#98A0AE]">
                      {sub.updatedAt ? new Date(sub.updatedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {sub.optedIn ? (
                        <span className="inline-flex items-center gap-1 text-[#027A48] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#B42318] font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Opted Out
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
