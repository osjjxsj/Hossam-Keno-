import React from 'react';
import { Camera, Phone, MessageCircle, Instagram, MapPin, ArrowUp, Lock, ShieldCheck } from 'lucide-react';
import { StudioConfig } from '../types';

interface FooterProps {
  studioConfig: StudioConfig;
  onOpenBooking: () => void;
  onOpenPrivateAlbum: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  studioConfig,
  onOpenBooking,
  onOpenPrivateAlbum,
  onOpenAdmin,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-right relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-md">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Camera className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-cairo">
                  حسام <span className="gold-gradient-text">كينو</span>
                </h3>
                <span className="text-[10px] text-amber-400/80 font-cinzel tracking-widest uppercase block">
                  Photography Studio
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              استوديو فوتوغرافي متخصص في صناعة ذكريات سينمائية لا تُنسى لأفراحكم ومناسباتكم الخاصة. نحرص على تقديم أعلى مستويات الفخامة والدقة في كل لقطة.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={studioConfig.facebook || 'https://www.facebook.com/share/1QhGG7L9jg/'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#3b82f6] hover:bg-[#1877F2] hover:text-white transition-colors"
                title="صفحة فيسبوك الرسمية"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={studioConfig.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400 transition-colors"
                title="إنستغرام"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={studioConfig.tiktok}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-amber-400 hover:border-amber-400 transition-colors text-xs font-bold"
                title="تيك توك"
              >
                TK
              </a>
              <a
                href={`https://wa.me/${studioConfig.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 hover:border-emerald-500 transition-colors"
                title="واتساب"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${studioConfig.phone}`}
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-amber-400 hover:border-amber-400 transition-colors"
                title="اتصال هاتفي"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-cairo">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#gallery" className="hover:text-amber-400 transition-colors">معرض الصور والفوتوسيشن</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-amber-400 transition-colors">تصنيفات السيشن المتاحة</a>
              </li>
              <li>
                <a href="#packages" className="hover:text-amber-400 transition-colors">باقات الأسعار والعروض</a>
              </li>
              <li>
                <a
                  href={studioConfig.facebook || 'https://www.facebook.com/share/1QhGG7L9jg/'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                >
                  صفحة حسام كينو على فيسبوك
                </a>
              </li>
              <li>
                <button onClick={onOpenBooking} className="hover:text-amber-400 text-amber-300 transition-colors font-bold">
                  طلب حجز موعد جديد
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Client Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-cairo">خدمات العملاء</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenPrivateAlbum}
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>دخول ألبوم الصور الخاص (PIN)</span>
                </button>
              </li>
              <li>
                <span className="text-zinc-500">تحميل الصور بجودة طباعة 45MP</span>
              </li>
              <li>
                <span className="text-zinc-500">تصوير خارجي بجميع المحافظات</span>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors pt-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>دخول لوحة تحكم الأدمن</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white font-cairo">معلومات التواصل</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{studioConfig.location}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span dir="ltr">{studioConfig.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span dir="ltr">+{studioConfig.whatsapp}</span>
              </p>
              <div className="pt-2 text-[11px] text-zinc-500">
                مواعيد العمل: يومياً من 11 صباحاً حتى 10 مساءً (الحجز المسبق مطلوب)
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة — سيشن حسام كينو للتصوير الفوتوغرافي.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 transition-colors p-2 rounded-lg bg-zinc-900 border border-zinc-800"
            title="العودة لأعلى الصفحة"
          >
            <span>للأعلى</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
