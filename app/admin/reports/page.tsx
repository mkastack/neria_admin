'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { FileSpreadsheet, Download, Calendar, Filter, Sparkles } from 'lucide-react';

export default function ReportsPage() {
  const { addToast } = useAdmin();

  const reportTypes = [
    { title: 'Sales & Revenue Summary', desc: 'Breakdown of gross sales, net earnings, discounts, and payment gateway fees.', format: 'CSV / PDF' },
    { title: 'Order Fulfillment Audit', desc: 'Order cycle time, courier delivery rates, and courier dispatch telemetry.', format: 'CSV' },
    { title: 'Inventory Valuation Report', desc: 'Current SKU stock levels, warehouse cost bases, and reorder warnings.', format: 'CSV' },
    { title: 'Customer Lifetime Value', desc: 'VIP segment order histories, AOV metrics, and repeat purchase frequencies.', format: 'CSV' },
    { title: 'Returns & Exchange Log', desc: 'Summary of return reasons, sizing complaints, and refund reversals.', format: 'CSV' },
    { title: 'Tax & Compliance Export', desc: 'Ghana GRA tax breakdown and statutory commerce invoices.', format: 'PDF / CSV' }
  ];

  const handleDownload = (title: string) => {
    addToast({
      type: 'success',
      title: 'Export Generated ♡',
      description: `${title} compiled and downloaded.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Reports & Data Exports</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Generate scheduled operations reports, financial spreadsheets, and tax exports.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportTypes.map((rep, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-[#F2F3F5] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF4F8] text-[#FF4FA3] flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#263550]">{rep.title}</h3>
              <p className="text-xs text-[#667085] leading-relaxed">{rep.desc}</p>
            </div>

            <div className="pt-4 border-t border-[#F2F3F5] flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F8F8FA] text-[#667085] border border-[#DDE1E7]">
                {rep.format}
              </span>
              <button
                onClick={() => handleDownload(rep.title)}
                className="neria-btn-primary px-3.5 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
