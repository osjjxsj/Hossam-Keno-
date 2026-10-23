import React from 'react';
import { Check, Sparkles, Clock, Image, Crown, ArrowLeft } from 'lucide-react';
import { PricingPackage } from '../types';

interface PricingSectionProps {
  packages: PricingPackage[];
  onSelectPackage: (pkg: PricingPackage) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  packages,
  onSelectPackage,
}) => {
  return (
    <section id="packages" className="py-16 sm:py-20 lg:py-24 bg-zinc-950 text-white relative border-t border-zinc-900">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5" />
            <span>عروض وباقات التصوير</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo">
            باقات احترافية تناسب <span className="gold-gradient-text">جميع مناسباتكم</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            جميع الباقات تشمل تعديل الألوان السينمائي، تصفية البشرة المتقدمة، وتسليم فوري لكافة الصور بجودة الطباعة الأصلية.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const isPopular = pkg.isPopular;

            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-zinc-900/95 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 scale-[1.02] lg:-translate-y-2'
                    : 'bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-900/90'
                }`}
              >
                {/* Popular Pill Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-black text-xs rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>الباقة الملكية الأكثر طلباً</span>
                  </div>
                )}

                {/* Top Info */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 block mb-1">
                      {pkg.badge || 'فوتوسيشن'}
                    </span>
                    <h3 className="text-xl font-bold font-cairo text-white">
                      {pkg.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="py-2 border-y border-zinc-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black font-cairo text-amber-300">
                        {pkg.price}
                      </span>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="space-y-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{pkg.photosCount}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-2 space-y-2.5">
                    <p className="text-xs font-bold text-zinc-400">ما تشمله الجلسة:</p>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {pkg.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-amber-400" />
                          </div>
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-6 mt-4 border-t border-zinc-800/80">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                      isPopular
                        ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02]'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-amber-400/50 hover:text-white'
                    }`}
                  >
                    <span>احجز هذه الباقة الآن</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Custom inquiry note */}
        <div className="mt-12 text-center p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl max-w-2xl mx-auto text-xs sm:text-sm text-zinc-400">
          هل تحتاج لتغطية مخصصة أو لديك مناسبة خاصة خارج اللوكيشن أو في أي مركز بمحافظة أسيوط؟ تواصل معنا مباشرة لتفصيل باقة تلائم رغباتك تماماً.
        </div>

      </div>
    </section>
  );
};
