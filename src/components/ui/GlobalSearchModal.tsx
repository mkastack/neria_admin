'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/lib/context/AdminContext';
import {
  Search, ShoppingBag, Receipt, Users, FileText,
  ArrowRight, X, Command, Sparkles, TrendingUp, Clock, Hash
} from 'lucide-react';

const RECENT = [
  { label: 'Pink Bunny Hoodie', type: 'Product', url: '/admin/products' },
  { label: 'NER-2048 — Kofi Mensah', type: 'Order', url: '/admin/orders' },
  { label: 'Low Stock Warning', type: 'Inventory', url: '/admin/inventory' },
];

const QUICK_LINKS = [
  { title: 'Overview Dashboard', url: '/admin', group: 'Navigation', icon: '📊' },
  { title: 'Orders & Shipments', url: '/admin/orders', group: 'Commerce', icon: '📦' },
  { title: 'Products & Lookbooks', url: '/admin/products', group: 'Commerce', icon: '👗' },
  { title: 'Inventory Warehouse', url: '/admin/inventory', group: 'Ops', icon: '🗄️' },
  { title: 'Discounts & Coupons', url: '/admin/discounts', group: 'Commerce', icon: '🏷️' },
  { title: 'Homepage Content', url: '/admin/content/homepage', group: 'Content', icon: '🏠' },
  { title: 'Analytics & Revenue', url: '/admin/analytics', group: 'Business', icon: '📈' },
  { title: 'Store Settings', url: '/admin/settings', group: 'Settings', icon: '⚙️' },
];

export function GlobalSearchModal() {
  const { isSearchOpen, setIsSearchOpen, products, orders, customers } = useAdmin();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setActiveIdx(-1);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isSearchOpen]);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredProducts = q
    ? products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)).slice(0, 4)
    : products.slice(0, 3);

  const filteredOrders = q
    ? orders.filter(o => o.orderNumber.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q)).slice(0, 3)
    : orders.slice(0, 2);

  const filteredCustomers = q
    ? customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 3)
    : customers.slice(0, 2);

  const filteredPages = q
    ? QUICK_LINKS.filter(p => p.title.toLowerCase().includes(q) || p.group.toLowerCase().includes(q))
    : QUICK_LINKS.slice(0, 4);

  const hasResults = filteredProducts.length + filteredOrders.length + filteredCustomers.length + filteredPages.length > 0;

  const navigateTo = (url: string) => {
    setIsSearchOpen(false);
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-20">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0"
        style={{
          background: 'rgba(15,20,36,0.48)',
          backdropFilter: 'blur(8px)',
          animation: 'search-fade-in 0.15s ease',
        }}
      />

      {/* Modal Panel */}
      <div
        className="relative w-full max-w-2xl z-10 overflow-hidden flex flex-col"
        style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255,216,234,0.6)',
          boxShadow: '0 32px 80px -12px rgba(15,20,36,0.24), 0 0 0 1px rgba(255,216,234,0.4)',
          animation: 'search-slide-in 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          maxHeight: '80vh',
        }}
      >
        <style>{`
          @keyframes search-fade-in {
            from { opacity:0; }
            to   { opacity:1; }
          }
          @keyframes search-slide-in {
            from { opacity:0; transform: scale(0.94) translateY(-10px); }
            to   { opacity:1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* ── Search Input ── */}
        <div
          className="flex items-center gap-3.5 px-5 py-4"
          style={{ borderBottom: '1px solid #F5F6F8' }}
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
            style={{ background: 'linear-gradient(135deg,#FFF4F8,#FFE8F2)', border: '1px solid #FFD8EA' }}
          >
            <Search className="w-4.5 h-4.5 text-[#FF4FA3]" />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, customers, pages…"
            className="flex-1 text-[15px] text-[#263550] placeholder-[#C0C8D4] bg-transparent outline-none font-medium"
          />

          {/* Clear / ESC */}
          <div className="flex items-center gap-2 shrink-0">
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 rounded-lg text-[#B0B8C5] hover:text-[#263550] hover:bg-[#F8F8FA] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd
              onClick={() => setIsSearchOpen(false)}
              className="hidden sm:flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-[#667085] cursor-pointer hover:bg-[#FFF4F8] hover:text-[#FF4FA3] transition-colors"
              style={{ background: '#F2F3F5', border: '1px solid #E4E7EC' }}
            >
              ESC
            </kbd>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="overflow-y-auto flex-1 p-3 space-y-1.5 custom-scroll">
          {/* ── Empty (no query) – show recent + quick links ── */}
          {!q && (
            <>
              {/* AI prompt hint */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl mb-2"
                style={{ background: 'linear-gradient(135deg,#FFF4F8,#FDEEF6)', border: '1px solid #FFD8EA' }}
              >
                <Sparkles className="w-4 h-4 text-[#FF4FA3] shrink-0" />
                <p className="text-xs text-[#667085]">
                  <span className="font-bold text-[#FF4FA3]">Tip: </span>
                  Try "orders today", "low stock", "VIP customers", or any product name for instant results.
                </p>
              </div>

              {/* Recent searches */}
              <div className="mb-1">
                <p className="text-[10px] font-bold text-[#B0B8C5] uppercase tracking-widest px-3 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Recent Searches
                </p>
                {RECENT.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => navigateTo(item.url)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#FFF4F8] group transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 text-sm text-left">
                      <div className="w-7 h-7 rounded-lg bg-[#F8F8FA] flex items-center justify-center">
                        <Hash className="w-3 h-3 text-[#98A0AE]" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#344054] group-hover:text-[#FF4FA3] transition-colors">{item.label}</span>
                        <span className="ml-2 text-[11px] text-[#98A0AE]">{item.type}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C8D0DC] group-hover:text-[#FF4FA3] group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>

              {/* Quick navigation */}
              <div>
                <p className="text-[10px] font-bold text-[#B0B8C5] uppercase tracking-widest px-3 mb-1.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> Quick Navigation
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {QUICK_LINKS.slice(0, 6).map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigateTo(page.url)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#FFF4F8] group transition-colors cursor-pointer text-left"
                    >
                      <span className="text-base leading-none">{page.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#344054] group-hover:text-[#FF4FA3] transition-colors truncate">{page.title}</p>
                        <p className="text-[10px] text-[#98A0AE]">{page.group}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Live search results ── */}
          {q && (
            <>
              {/* Products */}
              {filteredProducts.length > 0 && (
                <ResultSection label="Products" icon={<ShoppingBag className="w-3 h-3" />} count={filteredProducts.length}>
                  {filteredProducts.map((prod) => (
                    <ResultRow
                      key={prod.id}
                      onClick={() => navigateTo('/admin/products')}
                      left={<img src={prod.images[0]} alt={prod.name} className="w-9 h-9 rounded-xl object-cover border border-[#F2F3F5]" />}
                      title={prod.name}
                      subtitle={`${prod.sku} • GH₵ ${prod.price}`}
                      query={q}
                    />
                  ))}
                </ResultSection>
              )}

              {/* Orders */}
              {filteredOrders.length > 0 && (
                <ResultSection label="Orders" icon={<Receipt className="w-3 h-3" />} count={filteredOrders.length}>
                  {filteredOrders.map((ord) => (
                    <ResultRow
                      key={ord.id}
                      onClick={() => navigateTo(`/admin/orders/${ord.id}`)}
                      left={
                        <div className="w-9 h-9 rounded-xl bg-[#FFF4F8] text-[#FF4FA3] flex items-center justify-center text-[9px] font-black border border-[#FFD8EA]">
                          ORD
                        </div>
                      }
                      title={`${ord.orderNumber} — ${ord.customer.name}`}
                      subtitle={`GH₵ ${ord.total} • ${ord.paymentStatus} • ${ord.fulfillmentStatus}`}
                      query={q}
                    />
                  ))}
                </ResultSection>
              )}

              {/* Customers */}
              {filteredCustomers.length > 0 && (
                <ResultSection label="Customers" icon={<Users className="w-3 h-3" />} count={filteredCustomers.length}>
                  {filteredCustomers.map((cust) => (
                    <ResultRow
                      key={cust.id}
                      onClick={() => navigateTo(`/admin/customers/${cust.id}`)}
                      left={<img src={cust.avatar} alt={cust.name} className="w-9 h-9 rounded-full object-cover border border-[#F2F3F5]" />}
                      title={cust.name}
                      subtitle={`${cust.email} • ${cust.segment}`}
                      query={q}
                    />
                  ))}
                </ResultSection>
              )}

              {/* Pages */}
              {filteredPages.length > 0 && (
                <ResultSection label="Pages & Actions" icon={<FileText className="w-3 h-3" />} count={filteredPages.length}>
                  {filteredPages.map((page, idx) => (
                    <ResultRow
                      key={idx}
                      onClick={() => navigateTo(page.url)}
                      left={
                        <div className="w-9 h-9 rounded-xl bg-[#F8F8FA] flex items-center justify-center text-base border border-[#F2F3F5]">
                          {page.icon}
                        </div>
                      }
                      title={page.title}
                      subtitle={page.group}
                      query={q}
                      badge={page.group}
                    />
                  ))}
                </ResultSection>
              )}

              {/* No results */}
              {!hasResults && (
                <div className="py-12 text-center">
                  <div className="text-4xl mb-3">🐰</div>
                  <p className="text-sm font-bold text-[#263550]">No results for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-[#98A0AE] mt-1">Try another keyword or browse via the sidebar</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="flex items-center justify-between px-5 py-3 text-[11px] text-[#B0B8C5]"
          style={{ borderTop: '1px solid #F5F6F8', background: '#FAFAFA' }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E4E7EC] text-[10px] font-bold text-[#667085]">↵</kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#E4E7EC] text-[10px] font-bold text-[#667085]">ESC</kbd>
              <span>to close</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FF4FA3]" />
            <span>Neria Admin Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */
function ResultSection({ label, icon, count, children }: {
  label: string; icon: React.ReactNode; count: number; children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold text-[#B0B8C5] uppercase tracking-widest px-3 py-1.5 flex items-center gap-1.5">
        {icon} {label}
        <span className="ml-auto text-[#DDE1E7]">{count} found</span>
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function ResultRow({ onClick, left, title, subtitle, query, badge }: {
  onClick: () => void;
  left: React.ReactNode;
  title: string;
  subtitle: string;
  query: string;
  badge?: string;
}) {
  // Highlight matching query text
  const highlight = (text: string, q: string) => {
    if (!q) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-[#FFF4F8] text-[#FF4FA3] font-bold rounded px-0.5" style={{ textDecoration: 'none' }}>
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#FFF4F8] group transition-all cursor-pointer text-left"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0">{left}</div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#263550] group-hover:text-[#FF4FA3] transition-colors truncate">
            {highlight(title, query)}
          </p>
          <p className="text-[11px] text-[#98A0AE] truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {badge && (
          <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F2F3F5] text-[#667085]">
            {badge}
          </span>
        )}
        <ArrowRight className="w-4 h-4 text-[#C8D0DC] group-hover:text-[#FF4FA3] group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  );
}
