'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Drawer } from '@/src/components/ui/Drawer';
import {
  ArrowLeftRight, Search, Download, Eye, DollarSign,
  CreditCard, Smartphone, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { Transaction } from '@/src/lib/types';

export default function TransactionsPage() {
  const { transactions, addToast } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTx = transactions.filter((t) =>
    t.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    addToast({
      type: 'info',
      title: 'Transactions Exported',
      description: 'Audit log exported as CSV.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Financial Transactions</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Complete audit trail of all charges, fee withholdings, refunds, and adjustments.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="neria-btn-secondary px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#667085]" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#F2F3F5] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#F2F3F5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#98A0AE] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by TX ID, Order, or Name..."
              className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-xs text-[#263550] outline-none"
            />
          </div>
          <span className="text-xs text-[#98A0AE]">{filteredTx.length} transactions logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F8FA] border-b border-[#F2F3F5] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Transaction ID</th>
                <th className="py-4 px-3">Order</th>
                <th className="py-4 px-3">Customer</th>
                <th className="py-4 px-3">Method</th>
                <th className="py-4 px-3">Type</th>
                <th className="py-4 px-3">Gross</th>
                <th className="py-4 px-3">Fee</th>
                <th className="py-4 px-3">Net Amount</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {filteredTx.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-[#FFF4F8]/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#263550] group-hover:text-[#FF4FA3]">
                    {tx.transactionNumber}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#263550]">{tx.orderNumber}</td>
                  <td className="py-3.5 px-3 text-[#263550] font-medium">{tx.customerName}</td>
                  <td className="py-3.5 px-3 text-[#667085]">{tx.method}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      tx.type === 'Charge' ? 'bg-[#ECFDF3] text-[#027A48]' : 'bg-[#FEF3F2] text-[#B42318]'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#263550]">$ {tx.amount}</td>
                  <td className="py-3.5 px-3 text-[#98A0AE]">$ {tx.fee}</td>
                  <td className="py-3.5 px-3 font-bold text-[#FF4FA3]">$ {tx.net}</td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#98A0AE]">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Drawer */}
      {selectedTx && (
        <Drawer
          isOpen={Boolean(selectedTx)}
          onClose={() => setSelectedTx(null)}
          title={`Transaction ${selectedTx.transactionNumber}`}
          subtitle={`Gateway reference ${selectedTx.reference}`}
        >
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] text-center">
              <span className="text-[11px] font-bold text-[#98A0AE] uppercase">Net Settlement Amount</span>
              <h2 className="text-2xl font-extrabold text-[#263550] mt-1">$ {selectedTx.net}</h2>
              <span className="inline-block mt-1">
                <StatusBadge status={selectedTx.status} />
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#F2F3F5]">
                <span className="text-[#667085]">Related Order</span>
                <Link href={`/admin/orders`} className="font-bold text-[#FF4FA3] hover:underline">
                  {selectedTx.orderNumber}
                </Link>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2F3F5]">
                <span className="text-[#667085]">Customer</span>
                <span className="font-bold text-[#263550]">{selectedTx.customerName}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2F3F5]">
                <span className="text-[#667085]">Payment Channel</span>
                <span className="font-bold text-[#263550]">{selectedTx.method}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2F3F5]">
                <span className="text-[#667085]">Gross Amount</span>
                <span className="font-bold text-[#263550]">$ {selectedTx.amount}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2F3F5]">
                <span className="text-[#667085]">Gateway Processing Fee</span>
                <span className="text-[#B42318] font-bold">- $ {selectedTx.fee}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2F3F5]">
                <span className="text-[#667085]">Gateway Reference</span>
                <span className="font-mono text-[#98A0AE]">{selectedTx.reference}</span>
              </div>

              <div className="flex justify-between py-2">
                <span className="text-[#667085]">Recorded Timestamp</span>
                <span className="text-[#263550]">{new Date(selectedTx.date).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
