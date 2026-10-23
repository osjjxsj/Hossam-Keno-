import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  PhotoItem, 
  PricingPackage, 
  Testimonial, 
  PrivateAlbum, 
  BookingRequest, 
  StudioConfig 
} from './types';
import { 
  initialStudioConfig, 
  initialPhotos, 
  initialPricingPackages, 
  initialTestimonials, 
  initialPrivateAlbums 
} from './data/initialData';
import {
  STORAGE_KEYS,
  safeLocalGet,
  safeLocalSet,
  idbGet,
  idbSet,
  fetchServerState,
  saveServerState,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { StudioSpotlight } from './components/StudioSpotlight';
import { GallerySection } from './components/GallerySection';
import { LightboxModal } from './components/LightboxModal';
import { PrivateAlbumModal } from './components/PrivateAlbumModal';
import { PricingSection } from './components/PricingSection';
import { BookingModal } from './components/BookingModal';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { MessageCircle } from 'lucide-react';

// Legacy v1 keys for smooth migration
const LEGACY_CONFIG_KEY = 'hossam_keno_assiut_v1_config';
const LEGACY_PHOTOS_KEY = 'hossam_keno_assiut_v1_photos';
const LEGACY_ALBUMS_KEY = 'hossam_keno_assiut_v1_albums';
const LEGACY_BOOKINGS_KEY = 'hossam_keno_assiut_v1_bookings';
const LEGACY_TESTIMONIALS_KEY = 'hossam_keno_assiut_v1_testimonials';

function normalizeConfig(cfg: Partial<StudioConfig> | null): StudioConfig {
  if (!cfg) return initialStudioConfig;
  return {
    ...initialStudioConfig,
    ...cfg,
    facebook: cfg.facebook || initialStudioConfig.facebook,
    // Migrate old default PIN 1234 to 2027
    adminPin: !cfg.adminPin || cfg.adminPin === '1234' ? '2027' : cfg.adminPin,
  };
}

export default function App() {
  const isHydratedRef = useRef(false);

  // Track deleted photo IDs permanently so deleted photos never come back
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<string[]>(() => {
    return safeLocalGet<string[]>(STORAGE_KEYS.DELETED_IDS) || [];
  });

  // State with clean multi-layer persistence
  const [studioConfig, setStudioConfig] = useState<StudioConfig>(() => {
    const saved = safeLocalGet<StudioConfig>(STORAGE_KEYS.CONFIG) || safeLocalGet<StudioConfig>(LEGACY_CONFIG_KEY);
    return normalizeConfig(saved);
  });

  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    const deletedSet = new Set(safeLocalGet<string[]>(STORAGE_KEYS.DELETED_IDS) || []);
    const savedV2 = safeLocalGet<PhotoItem[]>(STORAGE_KEYS.PHOTOS);
    if (savedV2 !== null) {
      return savedV2.filter(p => !deletedSet.has(p.id));
    }
    const savedV1 = safeLocalGet<PhotoItem[]>(LEGACY_PHOTOS_KEY);
    if (savedV1 !== null) {
      return savedV1.filter(p => !deletedSet.has(p.id));
    }
    return initialPhotos.filter(p => !deletedSet.has(p.id));
  });

  const [packages] = useState<PricingPackage[]>(() => {
    const saved = safeLocalGet<PricingPackage[]>(STORAGE_KEYS.PACKAGES);
    return saved || initialPricingPackages;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = safeLocalGet<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS) || safeLocalGet<Testimonial[]>(LEGACY_TESTIMONIALS_KEY);
    return saved || initialTestimonials;
  });

  const [albums, setAlbums] = useState<PrivateAlbum[]>(() => {
    const saved = safeLocalGet<PrivateAlbum[]>(STORAGE_KEYS.ALBUMS) || safeLocalGet<PrivateAlbum[]>(LEGACY_ALBUMS_KEY);
    return saved || initialPrivateAlbums;
  });

  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    const saved = safeLocalGet<BookingRequest[]>(STORAGE_KEYS.BOOKINGS) || safeLocalGet<BookingRequest[]>(LEGACY_BOOKINGS_KEY);
    return saved || [];
  });

  // Modal States
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<PhotoItem | null>(null);
  const [isPrivateAlbumOpen, setIsPrivateAlbumOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingCategory, setBookingCategory] = useState<string | undefined>(undefined);
  const [bookingPackage, setBookingPackage] = useState<PricingPackage | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Hydrate from IndexedDB & Server on initial mount
  useEffect(() => {
    let mounted = true;

    async function hydratePersistence() {
      // 1. Check IndexedDB
      const [idbDeleted, idbPhotos, idbConfig, idbAlbums, idbBookings, idbTestimonials] = await Promise.all([
        idbGet<string[]>(STORAGE_KEYS.DELETED_IDS),
        idbGet<PhotoItem[]>(STORAGE_KEYS.PHOTOS),
        idbGet<StudioConfig>(STORAGE_KEYS.CONFIG),
        idbGet<PrivateAlbum[]>(STORAGE_KEYS.ALBUMS),
        idbGet<BookingRequest[]>(STORAGE_KEYS.BOOKINGS),
        idbGet<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS),
      ]);

      // 2. Check Server API
      const serverData = await fetchServerState();

      if (!mounted) return;

      const localDeleted = safeLocalGet<string[]>(STORAGE_KEYS.DELETED_IDS) || [];
      const mergedDeleted = Array.from(new Set([
        ...localDeleted,
        ...(idbDeleted || []),
        ...(serverData?.deletedPhotoIds || []),
      ]));

      const deletedSet = new Set(mergedDeleted);

      setDeletedPhotoIds(mergedDeleted);
      safeLocalSet(STORAGE_KEYS.DELETED_IDS, mergedDeleted);
      idbSet(STORAGE_KEYS.DELETED_IDS, mergedDeleted);

      // Determine best photos source (Server -> IDB -> Local)
      let resolvedPhotos: PhotoItem[] | null = null;
      if (serverData && Array.isArray(serverData.photos)) {
        resolvedPhotos = serverData.photos;
      } else if (Array.isArray(idbPhotos)) {
        resolvedPhotos = idbPhotos;
      }

      if (resolvedPhotos !== null) {
        const filtered = resolvedPhotos.filter(p => !deletedSet.has(p.id));
        setPhotos(filtered);
        safeLocalSet(STORAGE_KEYS.PHOTOS, filtered);
        idbSet(STORAGE_KEYS.PHOTOS, filtered);
      } else {
        setPhotos(prev => {
          const filtered = prev.filter(p => !deletedSet.has(p.id));
          safeLocalSet(STORAGE_KEYS.PHOTOS, filtered);
          idbSet(STORAGE_KEYS.PHOTOS, filtered);
          return filtered;
        });
      }

      if (serverData?.studioConfig || idbConfig) {
        const nextCfg = normalizeConfig(serverData?.studioConfig || idbConfig || null);
        setStudioConfig(nextCfg);
        safeLocalSet(STORAGE_KEYS.CONFIG, nextCfg);
        idbSet(STORAGE_KEYS.CONFIG, nextCfg);
      }

      if (serverData?.albums && Array.isArray(serverData.albums)) {
        setAlbums(serverData.albums);
      } else if (Array.isArray(idbAlbums)) {
        setAlbums(idbAlbums);
      }

      if (serverData?.bookings && Array.isArray(serverData.bookings)) {
        setBookings(serverData.bookings);
      } else if (Array.isArray(idbBookings)) {
        setBookings(idbBookings);
      }

      if (serverData?.testimonials && Array.isArray(serverData.testimonials)) {
        setTestimonials(serverData.testimonials);
      } else if (Array.isArray(idbTestimonials)) {
        setTestimonials(idbTestimonials);
      }

      isHydratedRef.current = true;
    }

    hydratePersistence();

    return () => {
      mounted = false;
    };
  }, []);

  // Helper to persist all state changes across LocalStorage, IndexedDB, and Server
  const persistChanges = (updates: {
    studioConfig?: StudioConfig;
    photos?: PhotoItem[];
    deletedPhotoIds?: string[];
    albums?: PrivateAlbum[];
    bookings?: BookingRequest[];
    testimonials?: Testimonial[];
  }) => {
    const nextConfig = updates.studioConfig ?? studioConfig;
    const nextPhotos = updates.photos ?? photos;
    const nextDeleted = updates.deletedPhotoIds ?? deletedPhotoIds;
    const nextAlbums = updates.albums ?? albums;
    const nextBookings = updates.bookings ?? bookings;
    const nextTestimonials = updates.testimonials ?? testimonials;

    safeLocalSet(STORAGE_KEYS.CONFIG, nextConfig);
    safeLocalSet(STORAGE_KEYS.DELETED_IDS, nextDeleted);
    safeLocalSet(STORAGE_KEYS.PHOTOS, nextPhotos);
    safeLocalSet(STORAGE_KEYS.ALBUMS, nextAlbums);
    safeLocalSet(STORAGE_KEYS.BOOKINGS, nextBookings);
    safeLocalSet(STORAGE_KEYS.TESTIMONIALS, nextTestimonials);

    idbSet(STORAGE_KEYS.CONFIG, nextConfig);
    idbSet(STORAGE_KEYS.DELETED_IDS, nextDeleted);
    idbSet(STORAGE_KEYS.PHOTOS, nextPhotos);
    idbSet(STORAGE_KEYS.ALBUMS, nextAlbums);
    idbSet(STORAGE_KEYS.BOOKINGS, nextBookings);
    idbSet(STORAGE_KEYS.TESTIMONIALS, nextTestimonials);

    saveServerState({
      studioConfig: nextConfig,
      photos: nextPhotos,
      deletedPhotoIds: nextDeleted,
      albums: nextAlbums,
      bookings: nextBookings,
      testimonials: nextTestimonials,
    });
  };

  // Handlers for Photos
  const handleAddPhoto = (newPhoto: PhotoItem) => {
    const nextDeleted = deletedPhotoIds.filter(id => id !== newPhoto.id);
    const nextPhotos = [newPhoto, ...photos];
    setDeletedPhotoIds(nextDeleted);
    setPhotos(nextPhotos);
    persistChanges({ photos: nextPhotos, deletedPhotoIds: nextDeleted });
  };

  const handleAddMultiplePhotos = (newPhotos: PhotoItem[]) => {
    if (newPhotos.length === 0) return;
    const nextPhotos = [...newPhotos, ...photos];
    setPhotos(nextPhotos);
    persistChanges({ photos: nextPhotos });
  };

  const handleDeletePhoto = (id: string) => {
    const nextDeleted = Array.from(new Set([...deletedPhotoIds, id]));
    const nextPhotos = photos.filter(p => p.id !== id);
    setDeletedPhotoIds(nextDeleted);
    setPhotos(nextPhotos);
    if (activeLightboxPhoto?.id === id) {
      setActiveLightboxPhoto(null);
    }
    persistChanges({ photos: nextPhotos, deletedPhotoIds: nextDeleted });
  };

  const handleClearAllPhotos = () => {
    const allIds = Array.from(new Set([
      ...deletedPhotoIds,
      ...photos.map(p => p.id),
      ...initialPhotos.map(p => p.id),
    ]));
    setDeletedPhotoIds(allIds);
    setPhotos([]);
    setActiveLightboxPhoto(null);
    persistChanges({ photos: [], deletedPhotoIds: allIds });
  };

  const handleToggleFeatured = (id: string) => {
    const nextPhotos = photos.map(p => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p));
    setPhotos(nextPhotos);
    persistChanges({ photos: nextPhotos });
  };

  // Handlers for Private Albums
  const handleAddPrivateAlbum = (newAlbum: PrivateAlbum) => {
    const nextAlbums = [newAlbum, ...albums];
    setAlbums(nextAlbums);
    persistChanges({ albums: nextAlbums });
  };

  const handleDeletePrivateAlbum = (id: string) => {
    const nextAlbums = albums.filter(a => a.id !== id);
    setAlbums(nextAlbums);
    persistChanges({ albums: nextAlbums });
  };

  // Handlers for Bookings
  const handleAddBooking = (bookingData: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: BookingRequest = {
      ...bookingData,
      id: `book-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const nextBookings = [newBooking, ...bookings];
    setBookings(nextBookings);
    persistChanges({ bookings: nextBookings });
  };

  const handleUpdateBookingStatus = (id: string, status: 'confirmed' | 'cancelled') => {
    const nextBookings = bookings.map(b => (b.id === id ? { ...b, status } : b));
    setBookings(nextBookings);
    persistChanges({ bookings: nextBookings });
  };

  // Handlers for Studio Config
  const handleUpdateStudioConfig = (nextCfg: StudioConfig) => {
    setStudioConfig(nextCfg);
    persistChanges({ studioConfig: nextCfg });
  };

  // Handlers for Testimonials
  const handleAddTestimonial = (testimonialData: Omit<Testimonial, 'id' | 'date'>) => {
    const newTest: Testimonial = {
      ...testimonialData,
      id: `test-${Date.now()}`,
      date: 'الآن'
    };
    const nextTestimonials = [newTest, ...testimonials];
    setTestimonials(nextTestimonials);
    persistChanges({ testimonials: nextTestimonials });
  };

  // Quick Open Booking from specific button
  const handleOpenBookingModal = (category?: string, pkg?: PricingPackage) => {
    setBookingCategory(category);
    setBookingPackage(pkg || null);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-cairo selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Top Navbar */}
      <Navbar
        studioConfig={studioConfig}
        onOpenBooking={() => handleOpenBookingModal()}
        onOpenPrivateAlbum={() => setIsPrivateAlbumOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Slider with Direct WhatsApp & Phone Call */}
        <HeroSlider
          photos={photos}
          studioConfig={studioConfig}
          onOpenBooking={handleOpenBookingModal}
          onSelectPhoto={(photo) => setActiveLightboxPhoto(photo)}
        />

        {/* Studio Spotlight (Hossam Keno - بتاع الديكورات - المعابدة أبنوب أسيوط) */}
        <StudioSpotlight
          studioConfig={studioConfig}
          onOpenBooking={() => handleOpenBookingModal()}
        />

        {/* Gallery Section with Category Filters & Direct Download */}
        <GallerySection
          photos={photos}
          onSelectPhoto={(photo) => setActiveLightboxPhoto(photo)}
          onOpenBooking={handleOpenBookingModal}
        />

        {/* Pricing Packages Section */}
        <PricingSection
          packages={packages}
          onSelectPackage={(pkg) => handleOpenBookingModal(undefined, pkg)}
        />

        {/* Testimonials & Reviews Section */}
        <TestimonialsSection
          testimonials={testimonials}
          onAddTestimonial={handleAddTestimonial}
        />
      </main>

      {/* Footer */}
      <Footer
        studioConfig={studioConfig}
        onOpenBooking={() => handleOpenBookingModal()}
        onOpenPrivateAlbum={() => setIsPrivateAlbumOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Action Dock: Direct WhatsApp & Facebook Page (Bottom Left) */}
      {!activeLightboxPhoto && !isBookingOpen && !isPrivateAlbumOpen && !isAdminOpen && (
        <div className="fixed bottom-5 left-4 sm:left-5 z-40 flex flex-col items-center gap-2.5">
          {/* Official Facebook Floating Button */}
          <a
            href={studioConfig.facebook || 'https://www.facebook.com/share/1QhGG7L9jg/'}
            target="_blank"
            rel="noreferrer"
            aria-label="Official Facebook Page"
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-xl shadow-blue-950/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 border border-blue-400/40 group cursor-pointer"
            title="صفحة فيسبوك الرسمية - حسام كينو"
          >
            <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>

          {/* Direct WhatsApp Floating Button */}
          <a
            href={`https://wa.me/${studioConfig.whatsapp}?text=${encodeURIComponent('السلام عليكم أستاذ حسام، أريد حجز سيشن تصوير في لوكيشن المعابدة')}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Direct WhatsApp Chat"
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-xl shadow-emerald-950/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 border border-emerald-400/40 group cursor-pointer"
            title="تواصل مباشر عبر واتساب"
          >
            <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
          </a>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxPhoto && (
          <LightboxModal
            photo={activeLightboxPhoto}
            photos={photos}
            studioConfig={studioConfig}
            onClose={() => setActiveLightboxPhoto(null)}
            onOpenBooking={handleOpenBookingModal}
          />
        )}
      </AnimatePresence>

      {/* Private Client Album with Secret PIN */}
      <PrivateAlbumModal
        isOpen={isPrivateAlbumOpen}
        albums={albums}
        onClose={() => setIsPrivateAlbumOpen(false)}
        onPreviewPhoto={(preview) => {
          const tempPhoto: PhotoItem = {
            id: 'temp-preview',
            title: preview.title,
            category: 'weddings',
            clientName: preview.clientName,
            date: 'جلسة خاصة',
            url: preview.url
          };
          setActiveLightboxPhoto(tempPhoto);
        }}
      />

      {/* Booking Appointment Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        initialCategory={bookingCategory}
        initialPackage={bookingPackage}
        packages={packages}
        studioConfig={studioConfig}
        onClose={() => setIsBookingOpen(false)}
        onSubmitBooking={handleAddBooking}
      />

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        studioConfig={studioConfig}
        photos={photos}
        albums={albums}
        bookings={bookings}
        onClose={() => setIsAdminOpen(false)}
        onAddPhoto={handleAddPhoto}
        onAddMultiplePhotos={handleAddMultiplePhotos}
        onDeletePhoto={handleDeletePhoto}
        onClearAllPhotos={handleClearAllPhotos}
        onToggleFeatured={handleToggleFeatured}
        onAddPrivateAlbum={handleAddPrivateAlbum}
        onDeletePrivateAlbum={handleDeletePrivateAlbum}
        onUpdateBookingStatus={handleUpdateBookingStatus}
        onUpdateStudioConfig={handleUpdateStudioConfig}
      />

    </div>
  );
}
