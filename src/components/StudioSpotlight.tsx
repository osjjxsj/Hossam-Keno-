import React from 'react';
import { MapPin, Phone, MessageCircle, Sparkles, Award, Camera, Heart, CheckCircle2 } from 'lucide-react';
import { StudioConfig } from '../types';

interface StudioSpotlightProps {
  studioConfig: StudioConfig;
  onOpenBooking: () => void;
}

export const StudioSpotlight: React.FC<StudioSpotlightProps> = ({
  studioConfig,
  onOpenBooking,
}) => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950 border-y border-amber-500/20 text-white relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Card with Gold Border */}
        <div className="relative rounded-3xl bg-zinc-950/90 border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl shadow-amber-500/10 overflow-hidden">
          
          {/* Top Decorative Ribbon */}
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Profile Column (Hossam Keno Branding Emblem & Photo) */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                {/* Golden Outer Ring */}
                <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1.5 shadow-2xl shadow-amber-500/30">
                  <div className="w-full h-full rounded-full bg-zinc-950 flex flex-col items-center justify-center p-3 sm:p-4 border border-amber-500/50 relative overflow-hidden group">
                    
                    {/* SVG Graphic Silhouette of Hossam Keno with Camera */}
                    <svg viewBox="0 0 200 200" className="w-24 h-24 sm:w-32 sm:h-32 text-amber-400 mb-1 sm:mb-2">
                      <defs>
                        <linearGradient id="goldAvatar" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="50%" stopColor="#d4af37" />
                          <stop offset="100%" stopColor="#b45309" />
                        </linearGradient>
                      </defs>
                      <circle cx="100" cy="65" r="32" fill="url(#goldAvatar)" />
                      <path d="M40 165 C40 120, 70 108, 100 108 C130 108, 160 120, 160 165 Z" fill="url(#goldAvatar)" opacity="0.9" />
                      <rect x="75" y="115" width="50" height="32" rx="6" fill="#18181b" stroke="#fef08a" strokeWidth="2.5" />
                      <circle cx="100" cy="131" r="10" fill="#d4af37" />
                      <circle cx="115" cy="122" r="3" fill="#ffffff" />
                    </svg>

                    <div className="absolute bottom-2 text-center">
                      <span className="text-[11px] font-black text-amber-300 font-cinzel tracking-wider uppercase block">
                        Hossam Keno
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating "بتاع الديكورات" Badge */}
                <div className="absolute -bottom-3 inset-x-0 mx-auto w-max px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 text-xs font-black shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>بتاع الديكورات</span>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-xl sm:text-2xl font-black font-cairo text-white">
                  الفنان حسام كينو
                </h3>
                <p className="text-xs text-amber-400 font-semibold mt-0.5">
                  إدارة أولاد دسوقي الهلالي · أسيوط
                </p>
              </div>
            </div>

            {/* Details & Location Column */}
            <div className="lg:col-span-7 space-y-5 text-right">
              
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>لوكيشن تصوير واستوديو متكامل</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-cairo text-white leading-snug">
                  لوكيشن تصوير المعابدة <span className="gold-gradient-text">(حسام كينو)</span>
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed mt-2">
                  "كل اللي محتاجه في مكان واحد .. ذكرياتك بأجمل صورة وأفضل جودة". نوفر لكم أرقى كوشات الخطوبة والزفاف المضاءة، ديكورات أعياد ميلاد الأطفال (سبايدرمان وأميرات ديزني)، وسيشنات الشباب بأحدث المعدات الاحترافية.
                </p>
              </div>

              {/* Exact Location & Contact Strip */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-start gap-3 text-sm text-zinc-200">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-cairo">العنوان واللوكيشن:</strong>
                    <span className="text-xs text-zinc-400">
                      محافظة أسيوط — مركز أبنوب — قرية المعابدة (بجوار النقطة القديمة / الموقف)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-200 pt-2 border-t border-zinc-800">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <strong className="text-white block font-cairo">رقم الحجز والاستفسار المباشر:</strong>
                    <span className="text-base text-amber-300 font-mono font-bold tracking-wider" dir="ltr">
                      01205155424
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialities Chips */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>كوشات خطوبة وزفاف</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>كتب كتاب ومناسبات</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>أعياد ميلاد بالبالونات</span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>سيشن كاجوال وشباب</span>
                </span>
              </div>

              {/* Direct Instant Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://wa.me/${studioConfig.whatsapp}?text=${encodeURIComponent('السلام عليكم يا كينو، أريد الحجز في لوكيشن المعابدة')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs sm:text-sm hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>واتساب مباشر ({studioConfig.phone})</span>
                </a>

                <a
                  href={studioConfig.facebook || 'https://www.facebook.com/share/1QhGG7L9jg/'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-950/40 transition-all active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>صفحة الفيس بوك الرسمية</span>
                </a>

                <a
                  href={`tel:${studioConfig.phone}`}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-bold text-xs sm:text-sm hover:border-amber-400 hover:text-white transition-all active:scale-95"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>اتصال هاتفي مباشر</span>
                </a>

                <button
                  onClick={onOpenBooking}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  احجز ميعادك أونلاين
                </button>
              </div>

            </div>

          </div>

          {/* Studio Highlights & Achievements Strip */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <p className="text-lg sm:text-2xl font-black text-amber-400 font-cairo">+1,200</p>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">سيشن ناجح ومميز</p>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <p className="text-lg sm:text-2xl font-black text-amber-400 font-cairo">+50</p>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">ديكور وكوشة حديثة</p>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <p className="text-lg sm:text-2xl font-black text-amber-400 font-cairo">4K PRO</p>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">أعلى جودة وتسليم فوري</p>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <p className="text-lg sm:text-2xl font-black text-amber-400 font-cairo">5.0 ★</p>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">ثقة وتقييم عملائنا بأسيوط</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
