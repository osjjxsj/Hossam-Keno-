import React, { useState } from 'react';
import { Camera, Calendar, Lock, ShieldCheck, Instagram, Phone, MessageCircle, Menu, X, Settings } from 'lucide-react';
import { StudioConfig } from '../types';

interface NavbarProps {
  studioConfig: StudioConfig;
  onOpenBooking: () => void;
  onOpenPrivateAlbum: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  studioConfig,
  onOpenBooking,
  onOpenPrivateAlbum,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-amber-500/25 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-3">
          
          {/* Brand Logo Zone */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-white font-cairo">
                  حسام <span className="gold-gradient-text">كينو</span>
                </span>
                <span className="text-[9px] sm:text-[11px] text-amber-400/80 font-cinzel tracking-widest uppercase">
                  Photography Sessions
                </span>
              </div>
            </a>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-300">
            <a href="#gallery" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              معرض الصور
            </a>
            <a href="#categories" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              تصنيفات الجلسات
            </a>
            <a href="#packages" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              باقات الأسعار
            </a>
            <a href="#testimonials" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              آراء العملاء
            </a>
          </nav>

          {/* Quick Social & Action Zone (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Social Icons */}
            <div className="flex items-center gap-1 pl-2 border-l border-zinc-800">
              <a
                href={studioConfig.facebook || 'https://www.facebook.com/share/1QhGG7L9jg/'}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-[#1877F2]/15 border border-[#1877F2]/40 flex items-center justify-center text-[#3b82f6] hover:bg-[#1877F2] hover:text-white transition-all"
                title="صفحة حسام كينو على فيسبوك"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={studioConfig.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                title="إنستغرام"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={studioConfig.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors font-bold text-xs"
                title="تيك توك"
              >
                <span>TK</span>
              </a>
              <a
                href={`tel:${studioConfig.phone}`}
                aria-label="Phone Call"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                title="اتصال هاتف"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${studioConfig.whatsapp}?text=${encodeURIComponent('السلام عليكم أستاذ حسام، أريد الاستفسار عن حجز سيشن تصوير')}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/60 transition-colors"
                title="واتساب مباشر"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            {/* Private Album Button */}
            <button
              onClick={onOpenPrivateAlbum}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-200 bg-zinc-900 border border-amber-500/30 rounded-xl hover:border-amber-400 hover:bg-zinc-850 transition-all duration-200 cursor-pointer"
              title="دخول ألبوم الصور المشفر برقم سري"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>ألبومي الخاص</span>
            </button>

            {/* Book Appointment CTA */}
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>حجز موعد</span>
            </button>

            {/* HIGHLY VISIBLE ADMIN BUTTON ON DESKTOP */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-300 bg-gradient-to-r from-zinc-900 to-zinc-900 border border-amber-500/50 hover:border-amber-400 rounded-xl hover:bg-zinc-800 transition-all shadow-md shadow-amber-500/10 cursor-pointer group"
              title="دخول لوحة تحكم الأدمن لرفع الصور وإدارة الجلسات والألبومات"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>لوحة الأدمن</span>
            </button>
          </div>

          {/* Mobile Right Controls - Perfectly proportioned with zero overflow */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Quick Mobile Facebook Icon */}
            <a
              href={studioConfig.facebook || 'https://www.facebook.com/share/1QhGG7L9jg/'}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-xl bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#3b82f6] active:scale-95"
              title="صفحة فيسبوك"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Quick Mobile Booking CTA */}
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
            >
              احجز موعد
            </button>

            {/* Mobile Menu Toggle (opens full menu with Admin, Albums, Gallery, etc.) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-200 hover:text-white bg-zinc-900 rounded-xl border border-zinc-800 active:scale-95"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-zinc-950 border-b border-amber-500/30 px-4 py-4 space-y-3">
          
          {/* Prominent Admin Banner in Mobile Menu */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-zinc-900 border border-amber-500/50 text-amber-300 font-bold text-sm"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>دخول لوحة تحكم الأدمن (رفع وإدارة الصور)</span>
            </div>
            <span className="text-xs text-amber-400/80">فتح ←</span>
          </button>

          {/* Prominent Facebook Page Banner in Mobile Menu */}
          <a
            href={studioConfig.facebook || 'https://www.facebook.com/share/1QhGG7L9jg/'}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1877F2]/15 border border-[#1877F2]/40 text-white font-bold text-sm"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#3b82f6] fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>صفحة حسام كينو الرسمية على فيسبوك</span>
            </div>
            <span className="text-xs text-blue-300">متابعة ←</span>
          </a>

          <div className="grid grid-cols-2 gap-2 text-center text-sm font-medium">
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400"
            >
              معرض الصور
            </a>
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400"
            >
              تصنيفات السيشن
            </a>
            <a
              href="#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400"
            >
              باقات الأسعار
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400"
            >
              آراء العملاء
            </a>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href={studioConfig.facebook || 'https://www.facebook.com/share/1QhGG7L9jg/'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#3b82f6]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={studioConfig.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`tel:${studioConfig.phone}`}
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${studioConfig.whatsapp}?text=${encodeURIComponent('السلام عليكم أستاذ حسام، أريد حجز سيشن تصوير')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrivateAlbum();
              }}
              className="flex items-center gap-1.5 text-xs text-zinc-300 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>الألبوم المشفر</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
