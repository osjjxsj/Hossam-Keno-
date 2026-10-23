import React, { useState, useEffect } from 'react';
import { 
  X, Download, ChevronRight, ChevronLeft, ZoomIn, ZoomOut, 
  RotateCcw, Share2, Camera, Calendar, User, MapPin, Sparkles,
  Copy, Check, MessageCircle, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoItem, StudioConfig } from '../types';
import { downloadPhoto } from '../utils/imageHelpers';

interface LightboxModalProps {
  photo: PhotoItem | null;
  photos: PhotoItem[];
  studioConfig: StudioConfig;
  onClose: () => void;
  onOpenBooking: (category?: string) => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 280, damping: 28 },
      opacity: { duration: 0.25 },
      scale: { duration: 0.25 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.92,
    transition: {
      x: { type: 'spring' as const, stiffness: 280, damping: 28 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  }),
};

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  photos,
  studioConfig,
  onClose,
  onOpenBooking,
}) => {
  const [scale, setScale] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (photo) {
      const idx = photos.findIndex((p) => p.id === photo.id);
      setCurrentIndex(idx !== -1 ? idx : 0);
      setScale(1);
    }
  }, [photo, photos]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showShareModal) {
          setShowShareModal(false);
        } else {
          onClose();
        }
      }
      if (e.key === 'ArrowLeft') handleNext();
      if (e.key === 'ArrowRight') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos.length, showShareModal]);

  if (!photo) return null;

  const currentPhoto = photos[currentIndex] || photo;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `${currentPhoto.title} - لوكيشن تصوير حسام كينو`;
  const shareDescription = `شاهد هذا السيشن المميز (${currentPhoto.title}) من تصوير واستوديو الفنان حسام كينو (بتاع الديكورات).`;

  const handlePrev = () => {
    setScale(1);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    setScale(1);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handleDownload = () => {
    downloadPhoto(currentPhoto.url, `Hossam_Keno_${currentPhoto.title}.jpg`);
  };

  // Main Share Handler using Web Share API with graceful fallback to copy modal
  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: currentUrl,
        });
        return;
      } catch (err) {
        // If user cancelled, do nothing. If error, fall through to modal
        if ((err as Error).name !== 'AbortError') {
          setShowShareModal(true);
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const shareToWhatsApp = () => {
    const msg = encodeURIComponent(`${shareDescription}\n${currentUrl}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(shareDescription);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const categoryNames: Record<string, string> = {
    weddings: 'أفراح وخطوبة',
    family: 'أطفال وعائلات',
    portrait: 'جلسات فردية وبورتريه',
    graduation: 'تخرج وكاجوال',
  };

  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col bg-black/98 backdrop-blur-2xl text-white select-none overflow-hidden"
    >
      {/* Top Floating Action Bar with non-overlapping layout */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
        className="h-14 sm:h-16 shrink-0 bg-zinc-950/95 border-b border-zinc-800/80 flex items-center justify-between px-3 sm:px-6 z-30"
      >
        <div className="flex items-center gap-2 sm:gap-3 text-white min-w-0">
          <span className="text-xs sm:text-base font-bold font-cairo truncate max-w-[140px] sm:max-w-md">
            {currentPhoto.title}
          </span>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-[11px] sm:text-xs text-amber-400 font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 whitespace-nowrap">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        {/* Action Controls: Fit Mode, Zoom, Share, Download, Close */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Fit Mode Toggle (Contain vs Fill) */}
          <button
            onClick={() => setFitMode(prev => prev === 'contain' ? 'cover' : 'contain')}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-semibold text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
            title="تبديل مقاس العرض (تناسب كامل / ملء الشاشة)"
          >
            {fitMode === 'contain' ? 'المقاس الكامل' : 'ملء الشاشة'}
          </button>

          {/* Zoom In / Out / Reset (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 rounded-xl p-1">
            <button
              onClick={() => setScale((prev) => Math.min(prev + 0.25, 2.5))}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="تكبير"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScale((prev) => Math.max(prev - 0.25, 0.75))}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="تصغير"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setScale(1)}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="إعادة ضبط"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* DEDICATED SHARE BUTTON */}
          <button
            onClick={handleShareClick}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-zinc-900 border border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-zinc-850 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            title="مشاركة الصورة"
            aria-label="Share Photo"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">مشاركة</span>
          </button>

          {/* Direct High-Res Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs hover:from-amber-300 transition-all shadow-md active:scale-95 cursor-pointer"
            title="تحميل الصورة بجودة عالية"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تحميل</span>
          </button>

          {/* Close Modal */}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="إغلاق (Esc)"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </motion.div>

      {/* Main Image View Container with gesture support - NEVER OVERLAPPED */}
      <div className="flex-1 min-h-0 relative w-full flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none">
        
        {/* Navigation Arrow Previous (Right in RTL) */}
        <button
          onClick={handlePrev}
          className="absolute right-2 sm:right-6 z-20 p-2.5 sm:p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-700/60 text-white hover:text-amber-400 hover:border-amber-500/50 hover:bg-zinc-900 transition-all shadow-xl active:scale-90 cursor-pointer"
          aria-label="Previous Photo"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Animated Image with AnimatePresence */}
        <div className="relative w-full h-full flex items-center justify-center max-w-6xl">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPhoto.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag={scale === 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -800 || offset.x < -100) {
                  handleNext();
                } else if (swipe > 800 || offset.x > 100) {
                  handlePrev();
                }
              }}
              style={{ scale }}
              className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing relative"
            >
              {/* Blurred background glow */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${currentPhoto.url})` }}
              />

              <img
                src={currentPhoto.url}
                alt={currentPhoto.title}
                referrerPolicy="no-referrer"
                draggable={false}
                className={`relative z-10 max-w-full max-h-full rounded-xl sm:rounded-2xl shadow-2xl border border-amber-500/20 transition-all duration-200 ${
                  fitMode === 'cover' ? 'w-full h-full object-cover' : 'object-contain'
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrow Next (Left in RTL) */}
        <button
          onClick={handleNext}
          className="absolute left-2 sm:left-6 z-20 p-2.5 sm:p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-700/60 text-white hover:text-amber-400 hover:border-amber-500/50 hover:bg-zinc-900 transition-all shadow-xl active:scale-90 cursor-pointer"
          aria-label="Next Photo"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

      </div>

      {/* Bottom Information Drawer with sleek flex layout */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
        className="shrink-0 bg-zinc-950/95 border-t border-zinc-800/80 p-3 sm:p-4 z-30"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          <div className="space-y-0.5 text-right min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-amber-400 font-medium">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{categoryNames[currentPhoto.category] || 'فوتوسيشن فاخر'}</span>
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-1 text-zinc-300">
                <User className="w-3 h-3 text-amber-400" />
                <span>العميل: {currentPhoto.clientName || 'لوكيشن كينو'}</span>
              </span>
              <span className="text-zinc-600">·</span>
              <span className="flex items-center gap-1 text-zinc-400">
                <Calendar className="w-3 h-3 text-zinc-500" />
                <span>{currentPhoto.date}</span>
              </span>
            </div>
            
            <h4 className="text-sm sm:text-base font-bold text-white font-cairo truncate">
              {currentPhoto.title}
            </h4>
          </div>

          {/* Actions & Specs Strip */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            {/* Quick Share from bottom */}
            <button
              onClick={handleShareClick}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-amber-400 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>مشاركة</span>
            </button>

            {/* Book similar session */}
            <button
              onClick={() => {
                onClose();
                onOpenBooking(currentPhoto.category);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs hover:shadow-md transition-all cursor-pointer"
            >
              احجز سيشن مشابه ←
            </button>
          </div>

        </div>
      </motion.div>

      {/* SHARE MODAL / POPOVER WITH WEB SHARE FALLBACK */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-zinc-950 border-2 border-amber-500/40 rounded-3xl p-6 text-white text-right space-y-5 shadow-2xl shadow-amber-500/20"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-base font-cairo">
                  <Share2 className="w-5 h-5" />
                  <span>مشاركة الصورة</span>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-zinc-400">
                  انسخ رابط الصورة المباشر أو شاركها عبر التطبيق المفضل لديك:
                </p>
                <p className="text-sm font-bold text-white truncate font-cairo">
                  {currentPhoto.title}
                </p>
              </div>

              {/* Copy Direct Link Box */}
              <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs hover:shadow-sm transition-all"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-4 h-4 text-zinc-950" />
                        <span>تم النسخ! ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>

                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 bg-transparent text-[11px] font-mono text-zinc-400 text-left outline-none truncate"
                    dir="ltr"
                  />
                </div>

                {copySuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-emerald-400 text-center font-bold"
                  >
                    تم نسخ رابط السيشن بنجاح إلى الحافظة!
                  </motion.p>
                )}
              </div>

              {/* Social Channels Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] text-zinc-400 block font-semibold">مشاركة مباشرة عبر:</span>
                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp */}
                  <button
                    onClick={shareToWhatsApp}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40 hover:border-emerald-400 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[11px] font-bold">واتساب</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={shareToFacebook}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-blue-400 hover:bg-blue-900/40 hover:border-blue-400 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span className="text-[11px] font-bold">فيسبوك</span>
                  </button>

                  {/* Twitter / X */}
                  <button
                    onClick={shareToTwitter}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-amber-400 hover:text-amber-400 transition-colors"
                  >
                    <span className="font-bold text-base">X</span>
                    <span className="text-[11px]">منصة X</span>
                  </button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 text-zinc-300 text-xs font-semibold hover:text-white"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
