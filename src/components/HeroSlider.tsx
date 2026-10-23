import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, ChevronRight, ChevronLeft, MapPin, Sparkles, Award } from 'lucide-react';
import { PhotoItem, StudioConfig } from '../types';

interface HeroSliderProps {
  photos: PhotoItem[];
  studioConfig: StudioConfig;
  onOpenBooking: (category?: string) => void;
  onSelectPhoto: (photo: PhotoItem) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  photos,
  studioConfig,
  onOpenBooking,
  onSelectPhoto,
}) => {
  // Filter featured photos or top 4 photos
  const featuredPhotos = photos.filter(p => p.isFeatured).length > 0
    ? photos.filter(p => p.isFeatured)
    : photos.slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide effect
  useEffect(() => {
    if (isPaused || featuredPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPhotos.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, featuredPhotos.length]);

  const activePhoto: PhotoItem = featuredPhotos[currentIndex] || featuredPhotos[0] || {
    id: 'fallback-hero',
    title: 'لوكيشن واستوديو حسام كينو للتصوير والديكورات',
    category: 'weddings',
    url: '/assets/aistudio/Screenshot_________________Chrome_c61bf202.jpg',
    clientName: 'حسام كينو — المعابدة',
    location: studioConfig.location,
    date: '2025',
    isFeatured: true,
  };

  const handlePrev = () => {
    if (featuredPhotos.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + featuredPhotos.length) % featuredPhotos.length);
  };

  const handleNext = () => {
    if (featuredPhotos.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % featuredPhotos.length);
  };

  const categoryNames: Record<string, string> = {
    weddings: 'أفراح وخطوبة ملكية',
    family: 'أطفال وعائلات',
    portrait: 'جلسات فردية وبورتريه',
    graduation: 'تخرج واحتفالات كاجوال'
  };

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم أستاذ حسام كينو، شاهدت سيشن (${activePhoto.title}) وأرغب في الاستفسار عن تفاصيل الحجز ومواعيد التصوير المتاحة.`
  );

  return (
    <section 
      className="relative w-full overflow-hidden bg-zinc-950 border-b border-amber-500/20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-center">
          
          {/* Left Column (Right in RTL): Editorial Text & Direct Actions */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-6 text-right z-10">
            
            {/* Studio Badge & Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>أحدث سيشنات الاستوديو الحصرية</span>
              </span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400 font-medium">
                {categoryNames[activePhoto.category] || 'فوتوسيشن فاخر'}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-cairo">
                {activePhoto.title}
              </h1>
              <p className="text-xs sm:text-base text-zinc-400 font-normal leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-none">
                {studioConfig.tagline} — نصنع من لحظاتكم ذكريات سينمائية لا تُنسى بأحدث معدات التصوير الاحترافية والإضاءة الفندقية الفاخرة.
              </p>
            </div>

            {/* Active Session Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300 pt-1.5 sm:pt-2 border-t border-zinc-900">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-white">العميل:</span>
                <span className="text-amber-300 font-medium">{activePhoto.clientName}</span>
              </div>
              <span className="text-zinc-700">|</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-zinc-400">{activePhoto.location || studioConfig.location}</span>
              </div>
            </div>

            {/* Direct Booking & Instant Calling Actions - COMPACT RESPONSIVE GRID */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2.5 pt-2">
              {/* WhatsApp Direct Action */}
              <a
                href={`https://wa.me/${studioConfig.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl shadow-lg shadow-emerald-950/30 hover:from-emerald-500 hover:to-emerald-400 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>واتساب مباشر</span>
              </a>

              {/* Booking Modal Trigger */}
              <button
                onClick={() => onOpenBooking(activePhoto.category)}
                className="flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <span>احجز موعد</span>
              </button>

              {/* Official Facebook Link */}
              <a
                href={studioConfig.facebook || 'https://www.facebook.com/share/1QhGG7L9jg/'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 text-xs font-bold text-white bg-[#1877F2]/90 hover:bg-[#1877F2] rounded-xl shadow-md transition-all active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>فيسبوك حسام كينو</span>
              </a>

              {/* Direct Phone Call */}
              <a
                href={`tel:${studioConfig.phone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{studioConfig.phone}</span>
              </a>
            </div>

          </div>

          {/* Right Column (Left in RTL): Visual Hero Photo Showcase */}
          <div className="lg:col-span-6 relative">
            <div 
              onClick={() => onSelectPhoto(activePhoto)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-amber-500/30 bg-zinc-900 shadow-2xl shadow-amber-500/10 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/10] transition-all duration-300 hover:border-amber-400"
            >
              {/* Soft blurred background to maintain perfect dimensions for any orientation */}
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-35 scale-125 pointer-events-none"
                style={{ backgroundImage: `url(${activePhoto.url})` }}
              />

              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent pointer-events-none" />

              {/* Floating Camera Spec Badge */}
              {activePhoto.exif && (
                <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-lg px-3 py-1.5 text-[11px] text-zinc-300 font-mono flex items-center gap-2">
                  <span className="text-amber-400 font-bold">EXIF</span>
                  <span>{activePhoto.exif.camera}</span>
                  <span className="text-zinc-600">·</span>
                  <span>{activePhoto.exif.lens}</span>
                </div>
              )}

              {/* Bottom Card Kicker */}
              <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between text-white">
                <div>
                  <p className="text-xs text-amber-400 font-semibold">{categoryNames[activePhoto.category]}</p>
                  <p className="text-base font-bold truncate">{activePhoto.title}</p>
                </div>
                <span className="text-xs bg-zinc-900/90 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full group-hover:bg-amber-400 group-hover:text-zinc-950 transition-colors">
                  تكبير الصورة
                </span>
              </div>
            </div>

            {/* Slider Controls (Previous / Next / Dots) */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5">
                {featuredPhotos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-8 bg-amber-400 shadow-sm shadow-amber-400/50' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 flex items-center justify-center transition-colors"
                  aria-label="Previous Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 flex items-center justify-center transition-colors"
                  aria-label="Next Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
