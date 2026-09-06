'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import {
  Settings, Store, CreditCard, Truck, Palette,
  Shield, Bell, ShoppingBag, Save, Sparkles, Check, RefreshCw
} from 'lucide-react';
import { BunnyMascot } from '@/src/components/ui/BunnyMascot';

export default function SettingsPage() {
  const { addToast } = useAdmin();
  const { config, updateConfig, publishChanges } = useStorefrontCms();
  const [activeTab, setActiveTab] = useState('General');
  const [isSaving, setIsSaving] = useState(false);

  // ── General Settings — synced to CMS config.brand ──
  const [storeName, setStoreName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');

  // Checkout / Security toggles (local-only for now)
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [requirePhone, setRequirePhone] = useState(true);
  const [enableDiscounts, setEnableDiscounts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Bootstrap form from live Firestore config
  useEffect(() => {
    if (config) {
      setStoreName(config.brand?.brandName || 'Neria Collective');
      setSupportEmail(config.brand?.contactInfo?.email || 'care@neriacollective.com');
      setSupportPhone(config.brand?.contactInfo?.phone || '+1 (212) 555-0100');
    }
  }, [config]);

  const tabs = [
    { id: 'General', label: 'General Info', icon: Settings },
    { id: 'Branding', label: 'Branding & Palette', icon: Palette },
    { id: 'Checkout', label: 'Checkout Rules', icon: ShoppingBag },
    { id: 'Notifications', label: 'Alert Preferences', icon: Bell },
    { id: 'Security', label: 'Security & 2FA', icon: Shield }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Persist changes into the CMS config — this writes to Firestore cms/config
      // which the storefront reads in real time.
      updateConfig((prev) => ({
        ...prev,
        brand: {
          ...prev.brand,
          brandName: storeName,
          contactInfo: {
            ...prev.brand.contactInfo,
            email: supportEmail,
            phone: supportPhone,
          },
        },
      }));
      // Publish the change so neria-commerce.vercel.app sees it live
      await publishChanges('Settings updated: brand name & contact info');
      addToast({
        type: 'success',
        title: 'Settings Saved & Published ♡',
        description: 'Brand identity synced to neria-commerce.vercel.app in real time.',
        crucial: true
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: err instanceof Error ? err.message : 'Unknown error.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550]">Store Settings &amp; Preferences</h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Changes saved here publish instantly to{' '}
            <span className="text-[#FF4FA3] font-semibold">neria-commerce.vercel.app</span>.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Publishing…' : 'Save & Publish'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-[#F2F3F5] shadow-xs flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#FF4FA3] text-white shadow-xs'
                  : 'text-[#667085] hover:bg-[#FFF4F8] hover:text-[#FF4FA3]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-6">
        {activeTab === 'General' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-[#263550]">Store Identity &amp; Contact</h3>

            <div>
              <label className="block text-xs font-bold text-[#263550] mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE1E7] text-sm text-[#263550] outline-none focus:border-[#FF4FA3] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#263550] mb-1">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none focus:border-[#FF4FA3] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#263550] mb-1">Support Phone / MoMo</label>
                <input
                  type="tel"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#263550] outline-none focus:border-[#FF4FA3] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#263550] mb-1">Primary Operating Currency</label>
                <input
                  type="text"
                  disabled
                  value="$ (US Dollar)"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#667085] bg-[#F8F8FA] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#263550] mb-1">Store Timezone</label>
                <input
                  type="text"
                  disabled
                  value="GMT-5 (New York / EST)"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDE1E7] text-xs text-[#667085] bg-[#F8F8FA] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Live storefront info banner */}
            <div className="p-3 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-start gap-2 text-xs text-[#667085]">
              <Sparkles className="w-4 h-4 text-[#FF4FA3] mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-[#263550]">Changes publish to your live store</p>
                <p>Clicking "Save & Publish" writes to Firestore and{' '}
                  <a href="https://neria-commerce.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#FF4FA3] underline">
                    neria-commerce.vercel.app
                  </a>{' '}
                  reflects the update in real time — no code deployment needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Branding' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-base font-bold text-[#263550]">Neria Brand Aesthetics &amp; Palette</h3>

            {/* Colors Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] text-center">
                <span className="w-8 h-8 rounded-full bg-[#FF4FA3] inline-block shadow-xs mb-1" />
                <p className="text-xs font-bold text-[#263550]">Main Pink</p>
                <span className="text-[10px] font-mono text-[#98A0AE]">#FF4FA3</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] text-center">
                <span className="w-8 h-8 rounded-full bg-[#FFD8EA] inline-block shadow-xs mb-1" />
                <p className="text-xs font-bold text-[#263550]">Soft Pink</p>
                <span className="text-[10px] font-mono text-[#98A0AE]">#FFD8EA</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F2F8FD] border border-[#CBE7FA] text-center">
                <span className="w-8 h-8 rounded-full bg-[#CBE7FA] inline-block shadow-xs mb-1" />
                <p className="text-xs font-bold text-[#263550]">Powder Blue</p>
                <span className="text-[10px] font-mono text-[#98A0AE]">#CBE7FA</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#DDE1E7] text-center">
                <span className="w-8 h-8 rounded-full bg-[#263550] inline-block shadow-xs mb-1" />
                <p className="text-xs font-bold text-[#263550]">Navy Velvet</p>
                <span className="text-[10px] font-mono text-[#98A0AE]">#263550</span>
              </div>
            </div>

            {/* Full palette editor hint */}
            <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] text-xs text-[#667085]">
              <p className="font-bold text-[#263550] mb-1 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#FF4FA3]" /> Full Color &amp; Theme Editor
              </p>
              <p>
                Go to{' '}
                <a href="/admin/website/editor" className="text-[#FF4FA3] underline font-semibold">
                  Website Editor → Theme Inspector
                </a>{' '}
                to change colors, fonts, and button styles with a live preview of your storefront.
              </p>
            </div>

            {/* Mascot Identity Card */}
            <div className="p-4 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA] flex items-center gap-4">
              <BunnyMascot size="md" mood="happy" className="shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-[#263550]">Official Mascot Guidelines</h4>
                <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">
                  The signature bunny mascot is reserved for subtle celebration moments, empty states, and welcome prompts. Core operational tables remain clean and professional.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Checkout' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-[#263550]">Checkout Experience</h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-[#F2F3F5] hover:bg-[#FFF4F8]/40 cursor-pointer">
                <div>
                  <h4 className="text-xs font-bold text-[#263550]">Allow Guest Checkout</h4>
                  <p className="text-[11px] text-[#98A0AE]">Customers can purchase without creating an account</p>
                </div>
                <input
                  type="checkbox"
                  checked={guestCheckout}
                  onChange={(e) => setGuestCheckout(e.target.checked)}
                  className="accent-[#FF4FA3] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-[#F2F3F5] hover:bg-[#FFF4F8]/40 cursor-pointer">
                <div>
                  <h4 className="text-xs font-bold text-[#263550]">Require Phone Number for MoMo Deliveries</h4>
                  <p className="text-[11px] text-[#98A0AE]">Ensures riders can call recipients on arrival</p>
                </div>
                <input
                  type="checkbox"
                  checked={requirePhone}
                  onChange={(e) => setRequirePhone(e.target.checked)}
                  className="accent-[#FF4FA3] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl border border-[#F2F3F5] hover:bg-[#FFF4F8]/40 cursor-pointer">
                <div>
                  <h4 className="text-xs font-bold text-[#263550]">Enable Promo Coupon Field</h4>
                  <p className="text-[11px] text-[#98A0AE]">Displays discount input on cart drawer &amp; checkout</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableDiscounts}
                  onChange={(e) => setEnableDiscounts(e.target.checked)}
                  className="accent-[#FF4FA3] w-4 h-4"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'Security' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-[#263550]">Admin Security &amp; Authentication</h3>

            <div className="p-4 rounded-2xl border border-[#F2F3F5] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#263550]">Two-Factor Authentication (2FA)</h4>
                <p className="text-[11px] text-[#98A0AE]">Require SMS / Authenticator app token upon login</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => {
                  setTwoFactorAuth(e.target.checked);
                  addToast({
                    type: 'info',
                    title: '2FA Updated',
                    description: e.target.checked ? '2FA enabled.' : '2FA disabled.'
                  });
                }}
                className="accent-[#FF4FA3] w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-[#263550] mb-2">Active Admin Sessions</h4>
              <div className="p-3 bg-[#F8F8FA] rounded-2xl text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#263550]">Current Session</p>
                  <p className="text-[10px] text-[#98A0AE]">Active now</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF3] text-[#027A48]">Active Now</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Notifications' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-[#263550]">Broadcast &amp; System Alerts</h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl border border-[#F2F3F5]">
                <span>Instant MoMo &amp; Card Order Push Alerts</span>
                <input type="checkbox" defaultChecked className="accent-[#FF4FA3]" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-2xl border border-[#F2F3F5]">
                <span>Low Inventory Stock Warning</span>
                <input type="checkbox" defaultChecked className="accent-[#FF4FA3]" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-2xl border border-[#F2F3F5]">
                <span>Customer Return Requests</span>
                <input type="checkbox" defaultChecked className="accent-[#FF4FA3]" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-2xl border border-[#F2F3F5]">
                <span>New Newsletter Sign-ups</span>
                <input type="checkbox" defaultChecked className="accent-[#FF4FA3]" />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
