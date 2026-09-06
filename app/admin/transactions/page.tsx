'use client';

import React, { useState, useMemo } from 'react';
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
  const { orders, addToast } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Derive real-time transactions from live Firestore orders
  const transactions: Transaction[] = useMemo(() => {
    return orders.map((ord) => {
      const fee = Math.round(ord.total * 0.029 * 100) / 100;
      const isRefunded = ord.paymentStatus === 'Refunded';
      const isFailed = ord.paymentStatus === 'Failed';
      const isPending = ord.paymentStatus === 'Pending';

      return {
        id: `tx-${ord.id}`,
        transactionNumber: `TXN-${ord.orderNumber.replace(/[^0-9]/g, '') || ord.id.slice(0, 6)}`,
        orderNumber: ord.orderNumber,
        customerName: ord.customer?.name || 'Customer',
        method: (ord.paymentMethod as any) || 'Paystack',
        type: isRefunded ? 'Refund' : 'Charge',
        amount: ord.total,
        fee: fee,
        net: Math.round((ord.total - fee) * 100) / 100,
        status: isFailed ? 'Failed' : (isPending ? 'Pending' : 'Success'),
        reference: `ch_${ord.id.slice(0, 12)}`,
        date: ord.createdAt || new Date().toISOString(),
      };
    });
  }, [orders]);

  const filteredTx = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return transactions;
    return transactions.filter((t) =>
      t.transactionNumber.toLowerCase().includes(q) ||
      t.orderNumber.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.method.toLowerCase().includes(q)
    );
  }, [transactions, searchQuery]);

  const handleExport = () => {
    if (filteredTx.length === 0) {
      addToast({
        type: 'info',
        title: 'No Data to Export',
        description: 'No transactions found.'
      });
      return;
    }

    const headers = ['Transaction ID', 'Order Number', 'Customer', 'Method', 'Type', 'Gross', 'Fee', 'Net', 'Status', 'Date'];
    const rows = filteredTx.map((t) => [
      t.transactionNumber,
      t.orderNumber,
      `"${t.customerName.replace(/"/g, '""')}"`,
      t.method,
      t.type,
      t.amount,
      t.fee,
      t.net,
      t.status,
      t.date
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `neria_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Transactions Exported',
      description: `${filteredTx.length} live transactions exported to CSV.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Financial Transactions</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Real-time audit trail of all customer charges, fee withholdings, and settlement records.
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
                <th className="py-4 px-3">Fee (2.9%)</th>
                <th className="py-4 px-3">Net Amount</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F3F5] text-xs">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-xs text-[#98A0AE]">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => (
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
                    <td className="py-3.5 px-3 font-bold text-[#263550]">$ {tx.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-[#98A0AE]">$ {tx.fee.toLocaleString()}</td>
                    <td className="py-3.5 px-3 font-bold text-[#FF4FA3]">$ {tx.net.toLocaleString()}</td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#98A0AE]">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
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
              <h2 className="text-2xl font-extrabold text-[#263550] mt-1">$ {selectedTx.net.toLocaleString()}</h2>
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
                <span className="font-bold text-[#263550]">$ {selectedTx.amount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#F2F3F5]">
                <span className="text-[#667085]">Gateway Processing Fee (2.9%)</span>
                <span className="text-[#B42318] font-bold">- $ {selectedTx.fee.toLocaleString()}</span>
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
