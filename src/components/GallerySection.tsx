import React, { useState } from 'react';
import { Download, Maximize2, Heart, Camera, Calendar, User, Eye, SlidersHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoItem, SessionCategory } from '../types';
import { downloadPhoto } from '../utils/imageHelpers';

interface GallerySectionProps {
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
  onOpenBooking: (category?: string) => void;
}

type GalleryAspectRatio = 'portrait' | 'classic' | 'square' | 'natural';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 24,
    }
  },
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.2 } },
};

export const GallerySection: React.FC<GallerySectionProps> = ({
  photos,
  onSelectPhoto,
  onOpenBooking,
}) => {
  const [activeCategory, setActiveCategory] = useState<SessionCategory>('all');
  const [aspectRatio, setAspectRatio] = useState<GalleryAspectRatio>('portrait');
  const [likes, setLikes] = useState<Record<string, number>>({});

  const categories = [
    { id: 'all', label: 'كافة الجلسات', count: photos.length },
    { id: 'weddings', label: 'أفراح وخطوبة', count: photos.filter(p => p.category === 'weddings').length },
    { id: 'family', label: 'أطفال وعائلات', count: photos.filter(p => p.category === 'family').length },
    { id: 'portrait', label: 'جلسات فردية وبورتريه', count: photos.filter(p => p.category === 'portrait').length },
    { id: 'graduation', label: 'تخرج وكاجوال', count: photos.filter(p => p.category === 'graduation').length },
  ];

  const aspectOptions: { id: GalleryAspectRatio; label: string; desc: string }[] = [
    { id: 'portrait', label: 'بورتريه (4:5)', desc: 'مثالي لجلسات الزفاف والبورتريه' },
    { id: 'classic', label: 'أفقي كلاسيكي (4:3)', desc: 'أبعاد الديكور والكوشات' },
    { id: 'square', label: 'مربع متناسق (1:1)', desc: 'عرض متساوي' },
    { id: 'natural', label: 'كاملة بدون قص', desc: 'أبعاد الصورة الأصلية مع احتواء كامل' },
  ];

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter(p => p.category === activeCategory);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleDownload = (e: React.MouseEvent, photo: PhotoItem) => {
    e.stopPropagation();
    downloadPhoto(photo.url, `Hossam_Keno_${photo.title}_${photo.clientName}.jpg`);
  };

  const getContainerRatioClass = () => {
    switch (aspectRatio) {
      case 'portrait':
        return 'aspect-[4/5]';
      case 'classic':
        return 'aspect-[4/3]';
      case 'square':
        return 'aspect-square';
      case 'natural':
        return 'aspect-[4/5] sm:aspect-[4/3]';
      default:
        return 'aspect-[4/5]';
    }
  };

  return (
    <section id="gallery" className="py-12 sm:py-16 lg:py-20 bg-zinc-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with smooth entrance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto space-y-3 mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Camera className="w-3.5 h-3.5" />
            <span>معرض الأعمال الفاخر</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo">
            إبداعات عدسة <span className="gold-gradient-text">حسام كينو</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            استكشف أحدث جلسات التصوير الفوتوغرافي لعملائنا. يمكنك استعراض كل صورة بحجم كامل أو تنزيلها مباشرة بجودة فائقة.
          </p>
        </motion.div>

        {/* Categories / Filter Buttons with motion indicator */}
        <div id="categories" className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-5 scrollbar-none">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as SessionCategory)}
                className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
                <span className={`relative z-10 text-[11px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-zinc-950/20 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Aspect Ratio & Dimensions Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 bg-zinc-900/60 p-2.5 rounded-2xl border border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs text-zinc-300 font-semibold px-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>ضبط أبعاد ونسب الصور:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
            {aspectOptions.map((opt) => {
              const isSelected = aspectRatio === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setAspectRatio(opt.id)}
                  title={opt.desc}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400/20 border border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Grid with AnimatePresence & layout transitions */}
        {filteredPhotos.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-zinc-900/50 rounded-2xl border border-zinc-800"
          >
            <p className="text-zinc-400 text-sm">لا توجد صور متوفرة في هذا القسم حالياً.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={`${activeCategory}-${aspectRatio}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredPhotos.map((photo) => {
                const currentLikes = (photo.likesCount || 0) + (likes[photo.id] || 0);
                
                return (
                  <motion.div
                    key={photo.id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    onClick={() => onSelectPhoto(photo)}
                    className="group relative bg-zinc-900/90 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-amber-500/50 transition-colors shadow-lg hover:shadow-2xl hover:shadow-amber-500/15 cursor-pointer flex flex-col"
                  >
                    {/* Photo Thumbnail Container with dynamic aspect ratio */}
                    <div className={`relative ${getContainerRatioClass()} w-full overflow-hidden bg-zinc-950 flex items-center justify-center`}>
                      {/* Atmospheric Blurred backdrop glow for non-crop and natural view */}
                      <div
                        className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110 pointer-events-none"
                        style={{ backgroundImage: `url(${photo.url})` }}
                      />

                      <img
                        src={photo.url}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className={`relative z-10 transition-transform duration-700 ease-out group-hover:scale-105 ${
                          aspectRatio === 'natural' 
                            ? 'max-w-full max-h-full object-contain p-2' 
                            : 'w-full h-full object-cover object-center'
                        }`}
                        loading="lazy"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 z-20 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />

                      {/* Top Action Floating Buttons */}
                      <div className="absolute top-3 right-3 left-3 z-30 flex items-center justify-between">
                        {photo.isFeatured ? (
                          <span className="px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                            مميز بالبانر
                          </span>
                        ) : <span />}

                        <div className="flex items-center gap-1.5">
                          {/* Download Photo Button */}
                          <button
                            onClick={(e) => handleDownload(e, photo)}
                            className="w-8 h-8 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-zinc-200 hover:text-amber-400 hover:border-amber-400 flex items-center justify-center transition-colors shadow-sm active:scale-90"
                            title="تحميل الصورة بجودة عالية"
                            aria-label="Download Photo"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          {/* Fullscreen Preview Icon */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPhoto(photo);
                            }}
                            className="w-8 h-8 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-zinc-200 hover:text-amber-400 hover:border-amber-400 flex items-center justify-center transition-colors shadow-sm active:scale-90"
                            title="عرض بحجم كامل"
                            aria-label="View Fullscreen"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Heart Like Button & View Details prompt */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <button
                          onClick={(e) => toggleLike(e, photo.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-xs text-zinc-300 hover:text-rose-400 transition-colors active:scale-90"
                          title="إعجاب بالصورة"
                        >
                          <Heart className={`w-3.5 h-3.5 ${likes[photo.id] ? 'fill-rose-500 text-rose-500 scale-110' : ''} transition-transform`} />
                          <span className="font-mono text-[11px]">{currentLikes}</span>
                        </button>

                        <span className="text-[11px] text-amber-300 flex items-center gap-1 font-semibold group-hover:underline">
                          <Eye className="w-3.5 h-3.5" />
                          <span>معاينة وتفاصيل</span>
                        </span>
                      </div>
                    </div>

                    {/* Card Content & Metadata */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors line-clamp-1">
                          {photo.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-1 text-zinc-300">
                            <User className="w-3 h-3 text-amber-400" />
                            <span>{photo.clientName}</span>
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-zinc-500" />
                            <span>{photo.date}</span>
                          </span>
                        </div>
                      </div>

                      {/* Bottom Camera Spec Bar or Quick Booking Prompt */}
                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                        <span className="font-mono truncate max-w-[200px]">
                          {photo.exif ? `${photo.exif.camera} · ${photo.exif.lens}` : photo.location || 'استوديو كينو'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenBooking(photo.category);
                          }}
                          className="text-amber-400 hover:text-amber-300 font-bold whitespace-nowrap cursor-pointer hover:underline"
                        >
                          احجز مثلها ←
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
};
