import React, { useState } from 'react';
import { 
  X, ShieldCheck, Upload, Trash2, Star, Plus, Check, 
  Settings, Image, FolderLock, Phone, MessageCircle, AlertCircle, 
  Calendar, Copy, CheckCheck, Eye, EyeOff, Sparkles
} from 'lucide-react';
import { PhotoItem, PrivateAlbum, BookingRequest, StudioConfig, SessionCategory } from '../types';
import { fileToBase64, createPhotographySvg } from '../utils/imageHelpers';

interface AdminPanelProps {
  isOpen: boolean;
  studioConfig: StudioConfig;
  photos: PhotoItem[];
  albums: PrivateAlbum[];
  bookings: BookingRequest[];
  onClose: () => void;
  onAddPhoto: (photo: PhotoItem) => void;
  onAddMultiplePhotos?: (photos: PhotoItem[]) => void;
  onDeletePhoto: (id: string) => void;
  onClearAllPhotos?: () => void;
  onToggleFeatured: (id: string) => void;
  onAddPrivateAlbum: (album: PrivateAlbum) => void;
  onDeletePrivateAlbum: (id: string) => void;
  onUpdateBookingStatus: (id: string, status: 'confirmed' | 'cancelled') => void;
  onUpdateStudioConfig: (config: StudioConfig) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  studioConfig,
  photos,
  albums,
  bookings,
  onClose,
  onAddPhoto,
  onAddMultiplePhotos,
  onDeletePhoto,
  onClearAllPhotos,
  onToggleFeatured,
  onAddPrivateAlbum,
  onDeletePrivateAlbum,
  onUpdateBookingStatus,
  onUpdateStudioConfig,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinAttempt, setPinAttempt] = useState('');
  const [pinError, setPinError] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);

  // Active Tab: 'upload' | 'gallery' | 'albums' | 'bookings' | 'settings'
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'albums' | 'bookings' | 'settings'>('upload');

  // Photo Upload State (supports single or multiple photos)
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<SessionCategory>('weddings');
  const [photoClient, setPhotoClient] = useState('');
  const [photoDate, setPhotoDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoLocation, setPhotoLocation] = useState('');
  const [photoIsFeatured, setPhotoIsFeatured] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [cameraModel, setCameraModel] = useState('Sony A7R V');
  const [lensModel, setLensModel] = useState('85mm f/1.4 GM');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Gallery Management Feedback State
  const [galleryFeedback, setGalleryFeedback] = useState('');
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // New Private Album State
  const [albumClientName, setAlbumClientName] = useState('');
  const [albumClientPhone, setAlbumClientPhone] = useState('');
  const [albumDate, setAlbumDate] = useState(new Date().toISOString().split('T')[0]);
  const [albumCategory, setAlbumCategory] = useState('أفراح وخطوبة');
  const [albumPin, setAlbumPin] = useState(Math.floor(1000 + Math.random() * 9000).toString());
  const [albumNotes, setAlbumNotes] = useState('مبارك السيشن! جميع الصور مرفوعة بجودة الطباعة الأصلية.');
  const [albumPhotosList, setAlbumPhotosList] = useState<{ id: string; url: string; title: string; date: string }[]>([]);
  const [albumSuccess, setAlbumSuccess] = useState(false);
  const [albumError, setAlbumError] = useState('');
  const [copiedAlbumId, setCopiedAlbumId] = useState<string | null>(null);

  // Settings State
  const [settingsPhone, setSettingsPhone] = useState(studioConfig.phone);
  const [settingsWhatsapp, setSettingsWhatsapp] = useState(studioConfig.whatsapp);
  const [settingsFacebook, setSettingsFacebook] = useState(studioConfig.facebook || 'https://www.facebook.com/share/1QhGG7L9jg/');
  const [settingsLocation, setSettingsLocation] = useState(studioConfig.location);
  const [settingsNewPin, setSettingsNewPin] = useState(studioConfig.adminPin);
  const [showSettingsPin, setShowSettingsPin] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  React.useEffect(() => {
    setSettingsPhone(studioConfig.phone);
    setSettingsWhatsapp(studioConfig.whatsapp);
    setSettingsFacebook(studioConfig.facebook || 'https://www.facebook.com/share/1QhGG7L9jg/');
    setSettingsLocation(studioConfig.location);
    setSettingsNewPin(studioConfig.adminPin);
  }, [studioConfig]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinAttempt.trim() === studioConfig.adminPin) {
      setIsAuthenticated(true);
      setPinError('');
      setPinAttempt('');
    } else {
      setPinError('الرقم السري غير صحيح، يرجى التأكد والمحاولة مرة أخرى.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessingFiles(true);
      setUploadError('');
      const files = Array.from(e.target.files);
      const results: string[] = [];
      for (const file of files) {
        try {
          const compressedBase64 = await fileToBase64(file);
          results.push(compressedBase64);
        } catch (err) {
          console.error('Error reading file:', err);
        }
      }
      setPreviewImages(prev => [...prev, ...results]);
      setIsProcessingFiles(false);
    }
  };

  const handleCreatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    if (!photoTitle.trim() || !photoClient.trim()) {
      setUploadError('يرجى كتابة عنوان الجلسة واسم العميل.');
      return;
    }

    const baseCategory = photoCategory === 'all' ? 'weddings' : photoCategory;

    if (previewImages.length > 1 && onAddMultiplePhotos) {
      const createdBatch: PhotoItem[] = previewImages.map((imgUrl, idx) => ({
        id: `photo-${Date.now()}-${idx}`,
        title: `${photoTitle.trim()} (${idx + 1})`,
        category: baseCategory as 'weddings' | 'family' | 'portrait' | 'graduation',
        clientName: photoClient.trim(),
        date: photoDate,
        url: imgUrl,
        isFeatured: idx === 0 ? photoIsFeatured : false,
        location: photoLocation.trim() || studioConfig.location,
        likesCount: 1,
        exif: {
          camera: cameraModel,
          lens: lensModel,
          aperture: 'f/1.4',
          shutter: '1/640s',
          iso: '100'
        }
      }));
      onAddMultiplePhotos(createdBatch);
    } else {
      const finalUrl = previewImages[0] || createPhotographySvg(
        baseCategory === 'weddings' ? 'wedding' : baseCategory === 'family' ? 'family' : baseCategory === 'portrait' ? 'portrait' : 'graduation',
        photoTitle,
        photoClient,
        photos.length + 1
      );

      const newPhoto: PhotoItem = {
        id: `photo-${Date.now()}`,
        title: photoTitle.trim(),
        category: baseCategory as 'weddings' | 'family' | 'portrait' | 'graduation',
        clientName: photoClient.trim(),
        date: photoDate,
        url: finalUrl,
        isFeatured: photoIsFeatured,
        location: photoLocation.trim() || studioConfig.location,
        likesCount: 1,
        exif: {
          camera: cameraModel,
          lens: lensModel,
          aperture: 'f/1.4',
          shutter: '1/640s',
          iso: '100'
        }
      };

      onAddPhoto(newPhoto);
    }

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setPhotoTitle('');
      setPhotoClient('');
      setPreviewImages([]);
      setPhotoIsFeatured(false);
    }, 1500);
  };

  const handleInstantDeletePhoto = (photo: PhotoItem) => {
    onDeletePhoto(photo.id);
    setGalleryFeedback(`تم حذف صورة "${photo.title}" نهائياً وحفظ التعديلات ✓`);
    setTimeout(() => setGalleryFeedback(''), 2500);
  };

  const handleConfirmClearAll = () => {
    if (onClearAllPhotos) {
      onClearAllPhotos();
      setConfirmClearAll(false);
      setGalleryFeedback('تم حذف جميع الصور وتفريغ المعرض نهائياً ✓');
      setTimeout(() => setGalleryFeedback(''), 3000);
    }
  };

  const handleAlbumFileAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      for (const file of files) {
        try {
          const base64 = await fileToBase64(file);
          setAlbumPhotosList(prev => [
            ...prev,
            {
              id: `p-${Date.now()}-${Math.random()}`,
              url: base64,
              title: file.name.split('.')[0] || 'صورة خاصة',
              date: albumDate
            }
          ]);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const handleAddDefaultSampleToAlbum = () => {
    setAlbumPhotosList(prev => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        url: createPhotographySvg('wedding', `لقطة سيشن خاصة ${prev.length + 1}`, albumClientName || 'العميل', prev.length + 1),
        title: `لقطة سيشن خاصة #${prev.length + 1}`,
        date: albumDate
      }
    ]);
  };

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    setAlbumError('');
    if (!albumClientName.trim() || !albumPin.trim()) {
      setAlbumError('يرجى تحديد اسم العميل والرقم السري للألبوم.');
      return;
    }

    const cover = albumPhotosList[0]?.url || createPhotographySvg('wedding', `ألبوم ${albumClientName}`, albumClientName, 1);

    const newAlbum: PrivateAlbum = {
      id: `album-${Date.now()}`,
      clientName: albumClientName.trim(),
      clientPhone: albumClientPhone.trim(),
      sessionDate: albumDate,
      category: albumCategory,
      pinCode: albumPin.trim(),
      coverImage: cover,
      notes: albumNotes.trim(),
      photos: albumPhotosList.length > 0 ? albumPhotosList : [
        {
          id: `p-1`,
          url: cover,
          title: 'الصورة الرئيسية للسيشن',
          date: albumDate
        }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddPrivateAlbum(newAlbum);
    setAlbumSuccess(true);
    setTimeout(() => {
      setAlbumSuccess(false);
      setAlbumClientName('');
      setAlbumClientPhone('');
      setAlbumPhotosList([]);
      setAlbumPin(Math.floor(1000 + Math.random() * 9000).toString());
    }, 1500);
  };

  const copyShareWhatsApp = (album: PrivateAlbum) => {
    const text = `السلام عليكم ${album.clientName}،
يسعدني إبلاغكم بأن صور جلستكم لدى *حسام كينو للتصوير الفوتوغرافي* أصبحت جاهزة للتحميل بجودة كاملة!
🔑 *الرقم السري الخاص بألبومكم:* ${album.pinCode}
رابط الموقع: ${window.location.origin}`;

    navigator.clipboard.writeText(text);
    setCopiedAlbumId(album.id);
    setTimeout(() => setCopiedAlbumId(null), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudioConfig({
      ...studioConfig,
      phone: settingsPhone.trim(),
      whatsapp: settingsWhatsapp.trim(),
      facebook: settingsFacebook.trim() || 'https://www.facebook.com/share/1QhGG7L9jg/',
      location: settingsLocation.trim(),
      adminPin: settingsNewPin.trim() || '2027'
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[94dvh] flex flex-col bg-zinc-950 border border-amber-500/40 rounded-3xl shadow-2xl p-4 sm:p-8 my-auto text-white text-right overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-5 sm:left-5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto pr-0.5">
          {!isAuthenticated ? (
            /* ADMIN LOGIN SCREEN - CLEAN & SECURE WITHOUT PASSWORD HINT */
            <div className="max-w-md mx-auto py-12 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-xl shadow-amber-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black font-cairo text-white">
                  لوحة تحكم استوديو كينو
                </h3>
                <p className="text-xs text-zinc-400">
                  منطقة محمية مخصصة للأدمن فقط لإدارة الجلسات ورفع الصور والألبومات.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type={showLoginPin ? 'text' : 'password'}
                    value={pinAttempt}
                    onChange={(e) => setPinAttempt(e.target.value)}
                    placeholder="أدخل الرقم السري للأدمن"
                    className="w-full py-3.5 px-12 bg-zinc-900 border border-zinc-700 rounded-xl text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPin(!showLoginPin)}
                    className="absolute inset-y-0 left-3 flex items-center text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                    title={showLoginPin ? 'إخفاء الرقم السري' : 'إظهار الرقم السري'}
                  >
                    {showLoginPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {pinError && (
                  <div className="flex items-center gap-2 p-3 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{pinError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-sm hover:shadow-lg transition-all cursor-pointer"
                >
                  تسجيل الدخول للوحة الإدارة
                </button>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED ADMIN DASHBOARD */
            <div className="space-y-6">
              
              {/* Top Bar Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black font-cairo">
                      لوحة تحكم الفنان حسام كينو
                    </h3>
                    <p className="text-xs text-zinc-400">
                      إدارة المعرض، رفع الصور، الألبومات الخاصة، وحجوزات العملاء (حفظ دائم وتلقائي)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white cursor-pointer"
                  >
                    قفل اللوحة
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-800/80 scrollbar-none">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-amber-400 text-zinc-950 shadow-sm'
                      : 'bg-zinc-900 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>رفع صور جديدة</span>
                </button>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'gallery'
                      ? 'bg-amber-400 text-zinc-950 shadow-sm'
                      : 'bg-zinc-900 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Image className="w-4 h-4" />
                  <span>إدارة وحذف الصور ({photos.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('albums')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'albums'
                      ? 'bg-amber-400 text-zinc-950 shadow-sm'
                      : 'bg-zinc-900 text-zinc-300 hover:text-white'
                  }`}
                >
                  <FolderLock className="w-4 h-4" />
                  <span>ألبومات العملاء الخاصة ({albums.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'bookings'
                      ? 'bg-amber-400 text-zinc-950 shadow-sm'
                      : 'bg-zinc-900 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>طلبات الحجز ({bookings.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-amber-400 text-zinc-950 shadow-sm'
                      : 'bg-zinc-900 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>إعدادات الاستوديو</span>
                </button>
              </div>

              {/* TAB 1: UPLOAD PHOTO (SINGLE OR BATCH) */}
              {activeTab === 'upload' && (
                <form onSubmit={handleCreatePhoto} className="space-y-4 max-w-2xl mx-auto">
                  {uploadSuccess && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>تم رفع وحفظ الصور بنجاح في المعرض بشكل دائم!</span>
                    </div>
                  )}

                  {uploadError && (
                    <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* File picker supporting single or multiple images */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      اختر صورة أو عدة صور من جهازك (يتم ضغطها وتحسين جودتها تلقائياً للحفظ الدائم)
                    </label>
                    <div className="border-2 border-dashed border-zinc-700 hover:border-amber-400/60 rounded-2xl p-6 text-center bg-zinc-900/40 transition-colors">
                      {isProcessingFiles ? (
                        <div className="py-6 text-amber-400 text-xs font-bold animate-pulse">
                          جاري تجهيز وتحسين جودة الصور...
                        </div>
                      ) : previewImages.length > 0 ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-52 overflow-y-auto p-1">
                            {previewImages.map((img, i) => (
                              <div key={i} className="relative group rounded-xl overflow-hidden border border-zinc-700 aspect-square bg-zinc-950">
                                <img
                                  src={img}
                                  alt={`Preview ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => setPreviewImages(prev => prev.filter((_, idx) => idx !== i))}
                                  className="absolute top-1 left-1 p-1 rounded-lg bg-black/80 text-rose-400 hover:text-rose-300"
                                  title="إزالة هذه الصورة"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-center gap-4 pt-1">
                            <span className="text-xs text-emerald-400 font-bold">
                              تم اختيار {previewImages.length} صورة جاهزة للنشر
                            </span>
                            <button
                              type="button"
                              onClick={() => setPreviewImages([])}
                              className="text-xs text-rose-400 hover:underline cursor-pointer"
                            >
                              إلغاء الكل واختيار من جديد
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-amber-400" />
                          <p className="text-xs text-zinc-300">
                            اضغط لاختيار صورة واحدة أو عدة صور دفعة واحدة من الموبايل أو الكمبيوتر
                          </p>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-zinc-950 hover:file:bg-amber-300 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        عنوان الجلسة / الصورة *
                      </label>
                      <input
                        type="text"
                        required
                        value={photoTitle}
                        onChange={(e) => setPhotoTitle(e.target.value)}
                        placeholder="مثال: سيشن خطوبة ملكي - لوكيشن كينو"
                        className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        اسم العميل / العروسين *
                      </label>
                      <input
                        type="text"
                        required
                        value={photoClient}
                        onChange={(e) => setPhotoClient(e.target.value)}
                        placeholder="مثال: العروسين / جلسة خاصة"
                        className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        نوع السيشن
                      </label>
                      <select
                        value={photoCategory}
                        onChange={(e) => setPhotoCategory(e.target.value as SessionCategory)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="weddings">أفراح وخطوبة</option>
                        <option value="family">أطفال وعائلات</option>
                        <option value="portrait">جلسات فردية وبورتريه</option>
                        <option value="graduation">تخرج وكاجوال</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        تاريخ الجلسة
                      </label>
                      <input
                        type="date"
                        value={photoDate}
                        onChange={(e) => setPhotoDate(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        مكان التصوير (اللوكيشن)
                      </label>
                      <input
                        type="text"
                        value={photoLocation}
                        onChange={(e) => setPhotoLocation(e.target.value)}
                        placeholder="لوكيشن حسام كينو - المعابدة"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Camera EXIF Details */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">الكاميرا المستخدمة</label>
                      <input
                        type="text"
                        value={cameraModel}
                        onChange={(e) => setCameraModel(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">العدسة المستخدمة</label>
                      <input
                        type="text"
                        value={lensModel}
                        onChange={(e) => setLensModel(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Featured in Hero Slider Toggle */}
                  <div className="flex items-center gap-3 p-3 bg-zinc-900/70 border border-zinc-800 rounded-xl">
                    <input
                      type="checkbox"
                      id="featuredToggle"
                      checked={photoIsFeatured}
                      onChange={(e) => setPhotoIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded bg-zinc-800 border-zinc-600 focus:ring-amber-400"
                    />
                    <label htmlFor="featuredToggle" className="text-xs text-zinc-200 cursor-pointer">
                      <strong className="text-amber-400">تمييز الصورة:</strong> إظهار هذه الجلسة في البانر الرئيسي للموقع (Hero Slider)
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-sm hover:shadow-lg transition-all cursor-pointer"
                  >
                    {previewImages.length > 1 ? `رفع ونشر (${previewImages.length}) صور في المعرض` : 'رفع ونشر الصورة في المعرض'}
                  </button>
                </form>
              )}

              {/* TAB 2: MANAGE GALLERY PHOTOS (INSTANT PERMANENT DELETE) */}
              {activeTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 pb-2 border-b border-zinc-800/80">
                    <div>
                      <span>إجمالي الصور المعروضة: <strong className="text-white">{photos.length}</strong></span>
                      <span className="mx-2 text-zinc-700">|</span>
                      <span className="text-amber-400">اضغط على سلة المهملات للحذف النهائي الفوري</span>
                    </div>

                    {photos.length > 0 && onClearAllPhotos && (
                      <div className="flex items-center gap-2">
                        {!confirmClearAll ? (
                          <button
                            type="button"
                            onClick={() => setConfirmClearAll(true)}
                            className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/60 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف جميع الصور ({photos.length})</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-rose-950/90 border border-rose-500 px-2.5 py-1 rounded-xl">
                            <span className="text-[11px] text-rose-200 font-bold">تأكيد حذف الكل؟</span>
                            <button
                              type="button"
                              onClick={handleConfirmClearAll}
                              className="px-2 py-0.5 rounded-lg bg-rose-500 text-white font-bold text-[11px] hover:bg-rose-400 cursor-pointer"
                            >
                              نعم، احذف الكل
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmClearAll(false)}
                              className="px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-300 text-[11px] hover:text-white cursor-pointer"
                            >
                              تراجع
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {galleryFeedback && (
                    <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{galleryFeedback}</span>
                    </div>
                  )}

                  {photos.length === 0 ? (
                    <div className="text-center py-14 bg-zinc-900/40 rounded-2xl border border-zinc-800 space-y-3">
                      <p className="text-zinc-400 text-sm">المعرض فارغ حالياً. يمكنك رفع صورك الخاصة من تبويب "رفع صور جديدة".</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
                      >
                        + رفع صور جديدة الآن
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1">
                      {photos.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                        >
                          <img
                            src={p.url}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-lg object-cover bg-zinc-950 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                            <p className="text-[11px] text-zinc-400 truncate">{p.clientName} · {p.date}</p>
                            <span className="text-[10px] text-amber-400 font-mono">{p.category}</span>
                          </div>
                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => onToggleFeatured(p.id)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                p.isFeatured
                                  ? 'bg-amber-400 text-zinc-950 border-amber-400'
                                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                              }`}
                              title={p.isFeatured ? 'إلغاء التمييز في البانر' : 'تمييز في البانر الرئيسي'}
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInstantDeletePhoto(p)}
                              className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                              title="حذف الصورة نهائياً"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PRIVATE ALBUMS */}
              {activeTab === 'albums' && (
                <div className="space-y-6">
                  
                  {/* Create New Private Album Box */}
                  <div className="p-5 rounded-2xl bg-zinc-900/70 border border-amber-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                      <FolderLock className="w-4 h-4" />
                      <span>إنشاء ألبوم خاص جديد لعميل</span>
                    </div>

                    {albumSuccess && (
                      <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>تم إنشاء الألبوم الخاص بنجاح! يمكنك إرسال الرقم السري للعميل عبر واتساب.</span>
                      </div>
                    )}

                    {albumError && (
                      <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{albumError}</span>
                      </div>
                    )}

                    <form onSubmit={handleCreateAlbum} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">اسم العميل *</label>
                          <input
                            type="text"
                            required
                            value={albumClientName}
                            onChange={(e) => setAlbumClientName(e.target.value)}
                            placeholder="مثال: يوسف & دينا"
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">رقم الهاتف / الواتساب</label>
                          <input
                            type="tel"
                            value={albumClientPhone}
                            onChange={(e) => setAlbumClientPhone(e.target.value)}
                            placeholder="010XXXXXXXX"
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 text-left font-mono"
                            dir="ltr"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">الرقم السري للألبوم (PIN) *</label>
                          <input
                            type="text"
                            required
                            value={albumPin}
                            onChange={(e) => setAlbumPin(e.target.value)}
                            placeholder="مثال: 7788"
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-amber-300 font-mono text-center font-bold tracking-widest focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">نوع الجلسة</label>
                          <input
                            type="text"
                            value={albumCategory}
                            onChange={(e) => setAlbumCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">تاريخ الجلسة</label>
                          <input
                            type="date"
                            value={albumDate}
                            onChange={(e) => setAlbumDate(e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">رسالة تهنئة أو ملاحظة للعميل داخل الألبوم</label>
                        <input
                          type="text"
                          value={albumNotes}
                          onChange={(e) => setAlbumNotes(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white"
                        />
                      </div>

                      {/* Upload multiple photos to album */}
                      <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-300 font-semibold">
                            صور الألبوم المحددة: ({albumPhotosList.length}) صورة
                          </span>
                          <button
                            type="button"
                            onClick={handleAddDefaultSampleToAlbum}
                            className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>إضافة لقطة تجريبية</span>
                          </button>
                        </div>

                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleAlbumFileAdd}
                          className="text-xs text-zinc-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-200 cursor-pointer"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        حفظ وإنشاء الألبوم الخاص
                      </button>
                    </form>
                  </div>

                  {/* Existing Private Albums List */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-zinc-300">الألبومات الخاصة الحالية:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {albums.map((alb) => (
                        <div
                          key={alb.id}
                          className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-bold text-white text-sm">{alb.clientName}</h5>
                              <p className="text-xs text-zinc-400">{alb.category} · {alb.sessionDate}</p>
                            </div>
                            <div className="text-center px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-xl">
                              <span className="text-[10px] text-zinc-400 block">الرمز السري</span>
                              <span className="font-mono font-bold text-amber-300 text-sm tracking-wider">{alb.pinCode}</span>
                            </div>
                          </div>

                          <div className="text-xs text-zinc-400 flex items-center justify-between">
                            <span>عدد الصور: {alb.photos.length}</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => copyShareWhatsApp(alb)}
                                className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 text-xs flex items-center gap-1 hover:text-amber-400 cursor-pointer"
                              >
                                {copiedAlbumId === alb.id ? (
                                  <>
                                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">تم النسخ!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>نسخ رسالة الواتساب</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => onDeletePrivateAlbum(alb.id)}
                                className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                                title="حذف الألبوم نهائياً"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: BOOKING REQUESTS */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>إجمالي الطلبات المستلمة: {bookings.length}</span>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-900/40 rounded-2xl border border-zinc-800 text-zinc-400 text-xs">
                      لا توجد طلبات حجز جديدة حتى الآن.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {bookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-sm">{b.clientName}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                b.status === 'confirmed' ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400' : 'bg-amber-950 border border-amber-500/40 text-amber-400'
                              }`}>
                                {b.status === 'confirmed' ? 'تم التأكيد' : 'في انتظار الرد'}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400">
                              {b.packageChosen || 'باقة مخصصة'} · الموعد: {b.sessionDate} ({b.sessionTime})
                            </p>
                            <p className="text-[11px] text-zinc-500 font-mono">
                              الهاتف: {b.clientPhone}
                            </p>
                            {b.notes && (
                              <p className="text-xs text-zinc-300 italic">ملاحظة: "{b.notes}"</p>
                            )}
                          </div>

                          {/* Quick Contact buttons */}
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <a
                              href={`https://wa.me/${b.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`السلام عليكم أستاذ/ة ${b.clientName}، بخصوص حجز سيشن التصوير مع حسام كينو...`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs hover:bg-emerald-800"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>مراسلة واتساب</span>
                            </a>

                            <a
                              href={`tel:${b.clientPhone}`}
                              className="p-2 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white"
                              title="اتصال هاتف"
                            >
                              <Phone className="w-4 h-4" />
                            </a>

                            {b.status !== 'confirmed' && (
                              <button
                                type="button"
                                onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                                className="px-3 py-1.5 rounded-lg bg-amber-400 text-zinc-950 text-xs font-bold hover:bg-amber-300 cursor-pointer"
                              >
                                تأكيد الحجز
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: STUDIO SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl mx-auto">
                  {settingsSuccess && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>تم حفظ وتحديث إعدادات الاستوديو بنجاح!</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      رقم الهاتف للاتصال المباشر
                    </label>
                    <input
                      type="text"
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white text-left font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      رقم الواتساب مع كود الدولة (مثال: 201205155424)
                    </label>
                    <input
                      type="text"
                      value={settingsWhatsapp}
                      onChange={(e) => setSettingsWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white text-left font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      رابط صفحة فيسبوك الرسمية
                    </label>
                    <input
                      type="url"
                      value={settingsFacebook}
                      onChange={(e) => setSettingsFacebook(e.target.value)}
                      placeholder="https://www.facebook.com/share/1QhGG7L9jg/"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white text-left font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      عنوان الاستوديو واللوكيشن
                    </label>
                    <input
                      type="text"
                      value={settingsLocation}
                      onChange={(e) => setSettingsLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      الرقم السري للوحة الأدمن (PIN)
                    </label>
                    <div className="relative">
                      <input
                        type={showSettingsPin ? 'text' : 'password'}
                        value={settingsNewPin}
                        onChange={(e) => setSettingsNewPin(e.target.value)}
                        className="w-full px-3 py-2 pl-10 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-amber-400 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSettingsPin(!showSettingsPin)}
                        className="absolute inset-y-0 left-3 flex items-center text-zinc-400 hover:text-amber-400 cursor-pointer"
                      >
                        {showSettingsPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    حفظ التعديلات
                  </button>
                </form>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
