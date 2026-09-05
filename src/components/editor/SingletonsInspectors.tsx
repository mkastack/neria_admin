'use client';

import React from 'react';
import {
  RotateCcw, Bell, Megaphone, LayoutTemplate, Layers, Sparkles,
  Plus, Trash2, Globe, ExternalLink, Smile
} from 'lucide-react';
import type {
  AnnouncementItem,
  FooterConfig,
  NavMenuItem,
  PopupConfig,
  BrandSettingsConfig
} from '@/src/lib/types';

export function NavigationInspector({
  navigation,
  updateNavigation,
  onReset,
}: {
  navigation: {
    logoText: string;
    menuItems: NavMenuItem[];
    searchPlaceholder: string;
  };
  updateNavigation: (updater: (prev: any) => any) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-5 text-xs">
      <div className="p-3.5 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
        <div className="flex items-center gap-2 mb-1">
          <LayoutTemplate className="w-3.5 h-3.5 text-[#FF4FA3]" />
          <h4 className="font-bold text-[#263550]">Header Navigation</h4>
        </div>
        <p className="text-[11px] text-[#667085] leading-relaxed">
          Configure the storefront top navigation bar, brand logo text, search input placeholder, and navigation menu links.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block font-bold text-[#263550] mb-1">Logo Text</label>
          <input
            type="text"
            value={navigation?.logoText || ''}
            onChange={(e) => updateNavigation((prev: any) => ({ ...prev, logoText: e.target.value }))}
            placeholder="Neria Collective"
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550] focus:border-[#FF4FA3] focus:bg-white outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-[#263550] mb-1">Search Placeholder</label>
          <input
            type="text"
            value={navigation?.searchPlaceholder || ''}
            onChange={(e) => updateNavigation((prev: any) => ({ ...prev, searchPlaceholder: e.target.value }))}
            placeholder="Search hoodies, baby tees, sets..."
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550] focus:border-[#FF4FA3] focus:bg-white outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-[#263550]">Menu Links</label>
        </div>
        <div className="space-y-2">
          {(navigation?.menuItems || []).map((item, idx) => (
            <div key={item.id || idx} className="p-2.5 rounded-xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.label || ''}
                  onChange={(e) =>
                    updateNavigation((prev: any) => ({
                      ...prev,
                      menuItems: prev.menuItems.map((m: any, i: number) =>
                        i === idx ? { ...m, label: e.target.value } : m
                      ),
                    }))
                  }
                  placeholder="Label"
                  className="flex-1 px-2 py-1 rounded-lg bg-white border border-[#DDE1E7] text-xs text-[#263550]"
                />
                <input
                  type="text"
                  value={item.url || ''}
                  onChange={(e) =>
                    updateNavigation((prev: any) => ({
                      ...prev,
                      menuItems: prev.menuItems.map((m: any, i: number) =>
                        i === idx ? { ...m, url: e.target.value } : m
                      ),
                    }))
                  }
                  placeholder="/shop"
                  className="w-24 px-2 py-1 rounded-lg bg-white border border-[#DDE1E7] text-xs font-mono text-[#263550]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-[#F2F3F5]">
        <button
          onClick={onReset}
          className="w-full py-2.5 rounded-xl bg-[#F8F8FA] hover:bg-[#FFF4F8] text-[#667085] hover:text-[#FF4FA3] font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Revert Navigation to Published</span>
        </button>
      </div>
    </div>
  );
}

export function AnnouncementsInspector({
  announcements,
  updateAnnouncements,
  openEmojiPicker,
  onReset,
}: {
  announcements: {
    enabled: boolean;
    autoRotate: boolean;
    rotationInterval: number;
    items: AnnouncementItem[];
  };
  updateAnnouncements: (updater: (prev: any) => any) => void;
  openEmojiPicker: (onSelect: (emoji: string) => void) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-5 text-xs">
      <div className="p-3.5 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-3.5 h-3.5 text-[#FF4FA3]" />
          <h4 className="font-bold text-[#263550]">Announcement Bar</h4>
        </div>
        <p className="text-[11px] text-[#667085] leading-relaxed">
          The top promotional ticker visible on every page. Edit messages, rotate timers, background colors, and links.
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#263550]">Show Announcement Bar</span>
          <input
            type="checkbox"
            checked={!!announcements?.enabled}
            onChange={(e) => updateAnnouncements((prev: any) => ({ ...prev, enabled: e.target.checked }))}
            className="w-4 h-4 accent-[#FF4FA3]"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-[#263550]">Auto-Rotate Messages</span>
          <input
            type="checkbox"
            checked={!!announcements?.autoRotate}
            onChange={(e) => updateAnnouncements((prev: any) => ({ ...prev, autoRotate: e.target.checked }))}
            className="w-4 h-4 accent-[#FF4FA3]"
          />
        </div>

        {announcements?.autoRotate && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-[#667085]">Rotation Interval</span>
            <span className="font-mono text-[#263550]">{announcements.rotationInterval || 5}s</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="font-bold text-[#263550] block">Announcement Items</label>
        {(announcements?.items || []).map((item, idx) => (
          <div key={item.id || idx} className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] text-[#263550]">Message #{idx + 1}</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-[#667085]">
                <input
                  type="checkbox"
                  checked={!!item.active}
                  onChange={(e) =>
                    updateAnnouncements((prev: any) => ({
                      ...prev,
                      items: prev.items.map((it: any, i: number) =>
                        i === idx ? { ...it, active: e.target.checked } : it
                      ),
                    }))
                  }
                  className="w-3.5 h-3.5 accent-[#FF4FA3]"
                />
                Active
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={item.message || ''}
                onChange={(e) =>
                  updateAnnouncements((prev: any) => ({
                    ...prev,
                    items: prev.items.map((it: any, i: number) =>
                      i === idx ? { ...it, message: e.target.value } : it
                    ),
                  }))
                }
                placeholder="Free US shipping on all orders over $75"
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#DDE1E7] text-xs text-[#263550]"
              />
              <button
                type="button"
                onClick={() =>
                  openEmojiPicker((emoji) =>
                    updateAnnouncements((prev: any) => ({
                      ...prev,
                      items: prev.items.map((it: any, i: number) =>
                        i === idx ? { ...it, emoji } : it
                      ),
                    }))
                  )
                }
                className="px-2.5 py-1.5 rounded-xl bg-white border border-[#DDE1E7] text-sm hover:border-[#FF4FA3]"
              >
                {item.emoji || '🎀'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#667085] block mb-1">Background</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={item.bgColor || '#FF4FA3'}
                    onChange={(e) =>
                      updateAnnouncements((prev: any) => ({
                        ...prev,
                        items: prev.items.map((it: any, i: number) =>
                          i === idx ? { ...it, bgColor: e.target.value } : it
                        ),
                      }))
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={item.bgColor || ''}
                    onChange={(e) =>
                      updateAnnouncements((prev: any) => ({
                        ...prev,
                        items: prev.items.map((it: any, i: number) =>
                          i === idx ? { ...it, bgColor: e.target.value } : it
                        ),
                      }))
                    }
                    className="flex-1 px-2 py-1 rounded-lg bg-white border border-[#DDE1E7] text-[10px] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#667085] block mb-1">Text Color</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={item.textColor || '#FFFFFF'}
                    onChange={(e) =>
                      updateAnnouncements((prev: any) => ({
                        ...prev,
                        items: prev.items.map((it: any, i: number) =>
                          i === idx ? { ...it, textColor: e.target.value } : it
                        ),
                      }))
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={item.textColor || ''}
                    onChange={(e) =>
                      updateAnnouncements((prev: any) => ({
                        ...prev,
                        items: prev.items.map((it: any, i: number) =>
                          i === idx ? { ...it, textColor: e.target.value } : it
                        ),
                      }))
                    }
                    className="flex-1 px-2 py-1 rounded-lg bg-white border border-[#DDE1E7] text-[10px] font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-[#F2F3F5]">
        <button
          onClick={onReset}
          className="w-full py-2.5 rounded-xl bg-[#F8F8FA] hover:bg-[#FFF4F8] text-[#667085] hover:text-[#FF4FA3] font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Revert Announcements to Published</span>
        </button>
      </div>
    </div>
  );
}

export function PopupInspector({
  popup,
  updatePopup,
  onReset,
}: {
  popup: PopupConfig;
  updatePopup: (updates: Partial<PopupConfig>) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-5 text-xs">
      <div className="p-3.5 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
        <div className="flex items-center gap-2 mb-1">
          <Megaphone className="w-3.5 h-3.5 text-[#FF4FA3]" />
          <h4 className="font-bold text-[#263550]">Promotional Popup</h4>
        </div>
        <p className="text-[11px] text-[#667085] leading-relaxed">
          Modal popup for welcome discount codes, newsletter subscriber acquisition, and seasonal flash promotions.
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] flex items-center justify-between">
        <span className="font-bold text-[#263550]">Enable Promotional Popup</span>
        <input
          type="checkbox"
          checked={!!popup?.active}
          onChange={(e) => updatePopup({ active: e.target.checked })}
          className="w-4 h-4 accent-[#FF4FA3]"
        />
      </div>

      <div className="space-y-3">
        <div>
          <label className="block font-bold text-[#263550] mb-1">Title</label>
          <input
            type="text"
            value={popup?.title || ''}
            onChange={(e) => updatePopup({ title: e.target.value })}
            placeholder="Welcome to Neria Collective"
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#263550] mb-1">Description / Subtitle</label>
          <textarea
            rows={2}
            value={popup?.description || popup?.subtitle || ''}
            onChange={(e) => updatePopup({ description: e.target.value, subtitle: e.target.value })}
            placeholder="Enjoy 15% off your first luxury silk or corset purchase."
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#263550] mb-1">Promo Code</label>
          <input
            type="text"
            value={popup?.promoCode || ''}
            onChange={(e) => updatePopup({ promoCode: e.target.value })}
            placeholder="SWEET15"
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] font-mono text-[#263550]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#263550] mb-1">CTA Button Text</label>
          <input
            type="text"
            value={popup?.primaryButtonText || ''}
            onChange={(e) => updatePopup({ primaryButtonText: e.target.value })}
            placeholder="Claim My 15% Off"
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550]"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-[#F2F3F5]">
        <button
          onClick={onReset}
          className="w-full py-2.5 rounded-xl bg-[#F8F8FA] hover:bg-[#FFF4F8] text-[#667085] hover:text-[#FF4FA3] font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Revert Popup to Published</span>
        </button>
      </div>
    </div>
  );
}

export function FooterInspector({
  footer,
  updateFooter,
  onReset,
}: {
  footer: FooterConfig;
  updateFooter: (updates: Partial<FooterConfig>) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-5 text-xs">
      <div className="p-3.5 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-3.5 h-3.5 text-[#FF4FA3]" />
          <h4 className="font-bold text-[#263550]">Storefront Footer</h4>
        </div>
        <p className="text-[11px] text-[#667085] leading-relaxed">
          Brand biography, copyright notice, customer service links, and social channel toggles.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block font-bold text-[#263550] mb-1">Brand Biography</label>
          <textarea
            rows={3}
            value={footer?.brandBio || ''}
            onChange={(e) => updateFooter({ brandBio: e.target.value })}
            placeholder="Neria Collective is a New York-based soft luxury womenswear label crafting modern silhouettes..."
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#263550] mb-1">Copyright Notice</label>
          <input
            type="text"
            value={footer?.copyrightText || ''}
            onChange={(e) => updateFooter({ copyrightText: e.target.value })}
            placeholder="© 2026 Neria Collective LLC. All rights reserved."
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550]"
          />
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#F8F8FA] border border-[#F2F3F5] space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#263550]">Show Newsletter Signup</span>
          <input
            type="checkbox"
            checked={footer?.showNewsletter ?? true}
            onChange={(e) => updateFooter({ showNewsletter: e.target.checked })}
            className="w-4 h-4 accent-[#FF4FA3]"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-[#263550]">Show Social Links</span>
          <input
            type="checkbox"
            checked={footer?.showSocials ?? true}
            onChange={(e) => updateFooter({ showSocials: e.target.checked })}
            className="w-4 h-4 accent-[#FF4FA3]"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-[#263550]">Show Payment Badges</span>
          <input
            type="checkbox"
            checked={footer?.showPaymentMethods ?? true}
            onChange={(e) => updateFooter({ showPaymentMethods: e.target.checked })}
            className="w-4 h-4 accent-[#FF4FA3]"
          />
        </div>
      </div>

      <div className="pt-2 border-t border-[#F2F3F5]">
        <button
          onClick={onReset}
          className="w-full py-2.5 rounded-xl bg-[#F8F8FA] hover:bg-[#FFF4F8] text-[#667085] hover:text-[#FF4FA3] font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Revert Footer to Published</span>
        </button>
      </div>
    </div>
  );
}

export function BrandInspector({
  brand,
  updateBrand,
}: {
  brand: BrandSettingsConfig;
  updateBrand: (updates: Partial<BrandSettingsConfig>) => void;
}) {
  return (
    <div className="space-y-5 text-xs">
      <div className="p-3.5 rounded-2xl bg-[#FFF4F8] border border-[#FFD8EA]">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#FF4FA3]" />
          <h4 className="font-bold text-[#263550]">Brand Identity</h4>
        </div>
        <p className="text-[11px] text-[#667085] leading-relaxed">
          Brand name, slogan, customer care email, phone, and official social media handles.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block font-bold text-[#263550] mb-1">Brand Name</label>
          <input
            type="text"
            value={brand?.brandName || ''}
            onChange={(e) => updateBrand({ brandName: e.target.value })}
            placeholder="Neria Collective"
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#263550] mb-1">Brand Tagline</label>
          <input
            type="text"
            value={brand?.tagline || ''}
            onChange={(e) => updateBrand({ tagline: e.target.value })}
            placeholder="Soft looks. Loud presence."
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#263550] mb-1">Customer Care Email</label>
          <input
            type="email"
            value={brand?.contactInfo?.email || ''}
            onChange={(e) =>
              updateBrand({
                contactInfo: { ...brand.contactInfo, email: e.target.value },
              })
            }
            placeholder="care@neriacollective.com"
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#263550] mb-1">Instagram Profile</label>
          <input
            type="text"
            value={brand?.socialHandles?.instagram || ''}
            onChange={(e) =>
              updateBrand({
                socialHandles: { ...brand.socialHandles, instagram: e.target.value },
              })
            }
            placeholder="https://instagram.com/neriacollective"
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550]"
          />
        </div>

        <div>
          <label className="block font-bold text-[#263550] mb-1">TikTok Profile</label>
          <input
            type="text"
            value={brand?.socialHandles?.tiktok || ''}
            onChange={(e) =>
              updateBrand({
                socialHandles: { ...brand.socialHandles, tiktok: e.target.value },
              })
            }
            placeholder="https://tiktok.com/@neriacollective"
            className="w-full px-3 py-2 rounded-xl bg-[#F8F8FA] border border-[#DDE1E7] text-[#263550]"
          />
        </div>
      </div>
    </div>
  );
}
