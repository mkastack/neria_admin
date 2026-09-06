'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/src/lib/context/AdminContext';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { Menu as MenuIcon, Plus, GripVertical, ExternalLink, Save, Loader2, Trash2 } from 'lucide-react';
import { NavMenuItem } from '@/src/lib/types';

export default function NavigationPage() {
  const { addToast } = useAdmin();
  const { config, updateConfig, publishChanges } = useStorefrontCms();
  const [isSaving, setIsSaving] = useState(false);

  const [headerLinks, setHeaderLinks] = useState<Array<{ name: string; url: string }>>([
    { name: 'Shop All', url: '/shop' },
    { name: 'Bunny Love', url: '/collections/bunny-love' },
    { name: 'Strawberry Girl', url: '/collections/strawberry-girl' },
    { name: 'Soft Girl', url: '/collections/soft-girl' },
    { name: 'Bow Obsessed', url: '/collections/bow-obsessed' },
    { name: 'Neria Girls', url: '/community' }
  ]);

  const [footerLinks, setFooterLinks] = useState<Array<{ name: string; url: string }>>([
    { name: 'Our Story', url: '/about' },
    { name: 'Shipping & Delivery', url: '/shipping' },
    { name: 'Returns Policy', url: '/returns-policy' },
    { name: 'Size Chart', url: '/size-guide' },
    { name: 'Contact Care', url: '/contact' }
  ]);

  // Sync from live config when loaded
  useEffect(() => {
    if (config?.navigation?.menuItems?.length) {
      setHeaderLinks(config.navigation.menuItems.map(item => ({
        name: item.label,
        url: item.url
      })));
    }
    const careCol = config?.footer?.columns?.find(c => c.title.toLowerCase().includes('care') || c.title.toLowerCase().includes('help') || c.title.toLowerCase().includes('support'));
    if (careCol?.links?.length) {
      setFooterLinks(careCol.links.map(l => ({ name: l.label, url: l.url })));
    }
  }, [config]);

  const handleSaveMenus = async () => {
    setIsSaving(true);
    try {
      // Build updated NavMenuItems
      const updatedMenuItems: NavMenuItem[] = headerLinks.map((item, idx) => ({
        id: `nav-${idx}-${Date.now()}`,
        label: item.name,
        url: item.url,
      }));

      updateConfig(prev => {
        const columns = prev.footer?.columns ? [...prev.footer.columns] : [];
        if (columns.length > 0) {
          columns[0] = {
            ...columns[0],
            links: footerLinks.map((l, idx) => ({ id: `fl-${idx}`, label: l.name, url: l.url }))
          };
        }
        return {
          ...prev,
          navigation: {
            ...prev.navigation,
            menuItems: updatedMenuItems
          },
          footer: {
            ...prev.footer,
            columns
          }
        };
      }, 'Updated navigation links');

      await publishChanges('Updated storefront navigation menus');

      addToast({
        type: 'success',
        title: 'Navigation Published ♡',
        description: 'Storefront header & footer menus synchronized with live site.',
        crucial: true
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: err.message || 'Could not publish navigation.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddHeaderLink = () => {
    const name = prompt('Link label (e.g. "Summer Collection"):');
    if (!name) return;
    const url = prompt('Link URL (e.g. "/shop" or "/collections/summer"):', '/shop');
    if (!url) return;
    setHeaderLinks(prev => [...prev, { name, url }]);
  };

  const handleAddFooterLink = () => {
    const name = prompt('Footer link label (e.g. "Track Order"):');
    if (!name) return;
    const url = prompt('Link URL (e.g. "/track" or "/faq"):', '/');
    if (!url) return;
    setFooterLinks(prev => [...prev, { name, url }]);
  };

  const removeHeaderLink = (index: number) => {
    setHeaderLinks(prev => prev.filter((_, i) => i !== index));
  };

  const removeFooterLink = (index: number) => {
    setFooterLinks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#263550] flex items-center gap-2">
            <span>Storefront Navigation Menus</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live CMS
            </span>
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Configure header mega-menu categories, mobile navigation links, and footer columns on neria-commerce.vercel.app.
          </p>
        </div>

        <button
          onClick={handleSaveMenus}
          disabled={isSaving}
          className="neria-btn-primary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Publishing…</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Header Menu */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#263550]">Main Header Navigation</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#98A0AE]">{headerLinks.length} Links</span>
              <button
                onClick={handleAddHeaderLink}
                className="px-2.5 py-1 rounded-xl bg-[#FFF4F8] text-[#FF4FA3] hover:bg-[#FFE8F2] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {headerLinks.map((link, idx) => (
              <div key={idx} className="p-3 bg-[#F8F8FA] rounded-2xl flex items-center justify-between text-xs group">
                <div className="flex items-center gap-2.5">
                  <GripVertical className="w-4 h-4 text-[#98A0AE]" />
                  <span className="font-bold text-[#263550]">{link.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#FF4FA3]">{link.url}</span>
                  <button
                    onClick={() => removeHeaderLink(idx)}
                    className="p-1 text-[#98A0AE] hover:text-[#B42318] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Remove link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2F3F5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#263550]">Footer Customer Care Links</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#98A0AE]">{footerLinks.length} Links</span>
              <button
                onClick={handleAddFooterLink}
                className="px-2.5 py-1 rounded-xl bg-[#FFF4F8] text-[#FF4FA3] hover:bg-[#FFE8F2] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {footerLinks.map((link, idx) => (
              <div key={idx} className="p-3 bg-[#F8F8FA] rounded-2xl flex items-center justify-between text-xs group">
                <div className="flex items-center gap-2.5">
                  <GripVertical className="w-4 h-4 text-[#98A0AE]" />
                  <span className="font-bold text-[#263550]">{link.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#FF4FA3]">{link.url}</span>
                  <button
                    onClick={() => removeFooterLink(idx)}
                    className="p-1 text-[#98A0AE] hover:text-[#B42318] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Remove link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
