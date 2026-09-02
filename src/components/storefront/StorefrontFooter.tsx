'use client';

import React from 'react';
import { useStorefrontCms } from '@/src/lib/context/StorefrontCmsContext';
import { BunnyMascot } from '../ui/BunnyMascot';
import { Phone, Mail, MapPin, Heart, ShieldCheck, Share2 } from 'lucide-react';

interface StorefrontFooterProps {
  isEditorMode?: boolean;
}

export function StorefrontFooter({ isEditorMode }: StorefrontFooterProps) {
  const { config, setActiveSectionId } = useStorefrontCms();
  const { footer, brand } = config;

  return (
    <footer
      className="bg-[#263550] text-white pt-16 pb-12 select-none"
      onClick={() => isEditorMode && setActiveSectionId('footer')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Bio Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xs">
                <BunnyMascot size="sm" mood="happy" />
              </div>
              <div>
                <span className="font-extrabold tracking-wider text-base uppercase font-sans">
                  {brand.brandName || 'Neria Collective'}
                </span>
                <p className="text-[10px] text-[#FF4FA3] font-bold tracking-widest uppercase">
                  {brand.tagline || 'Soft looks. Loud presence.'}
                </p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              {footer.brandBio}
            </p>

            {/* Social Links */}
            {footer.showSocials && (
              <div className="flex items-center gap-2 pt-2">
                {brand.socialHandles.instagram && (
                  <a
                    href={brand.socialHandles.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF4FA3] flex items-center justify-center text-white text-xs font-bold transition-colors"
                  >
                    IG
                  </a>
                )}
                {brand.socialHandles.tiktok && (
                  <a
                    href={brand.socialHandles.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF4FA3] flex items-center justify-center text-white text-xs font-bold transition-colors"
                  >
                    TT
                  </a>
                )}
                {brand.socialHandles.pinterest && (
                  <a
                    href={brand.socialHandles.pinterest}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#FF4FA3] flex items-center justify-center text-white text-xs font-bold transition-colors"
                  >
                    Pin
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Nav Columns */}
          {footer.columns.map(col => (
            <div key={col.id} className="lg:col-span-2 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                {col.title}
              </h5>
              <ul className="space-y-2 text-xs text-white/70">
                {col.links.map(link => (
                  <li key={link.id}>
                    <span className="hover:text-[#FF4FA3] hover:underline cursor-pointer transition-colors">
                      {link.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Details Column */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">
              Concierge
            </h5>
            <div className="space-y-2 text-xs text-white/70">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF4FA3] shrink-0" />
                <span className="truncate">{brand.contactInfo.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF4FA3] shrink-0" />
                <span>{brand.contactInfo.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF4FA3] shrink-0" />
                <span className="truncate">{brand.contactInfo.location}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Payment Badges & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>{footer.copyrightText}</p>

          {/* Payment Badges */}
          {footer.showPaymentMethods && (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] font-bold">
                MTN MoMo
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] font-bold">
                Telecel Cash
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px] font-bold">
                VISA / Mastercard
              </span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
