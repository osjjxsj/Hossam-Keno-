import React, { useState } from 'react';
import { X, Lock, KeyRound, Download, CheckCircle, AlertCircle, Camera, Calendar, User, Eye, Sparkles } from 'lucide-react';
import { PrivateAlbum, PrivateAlbumPhoto } from '../types';
import { downloadPhoto } from '../utils/imageHelpers';

interface PrivateAlbumModalProps {
  isOpen: boolean;
  albums: PrivateAlbum[];
  onClose: () => void;
  onPreviewPhoto: (photo: { url: string; title: string; clientName: string }) => void;
}

export const PrivateAlbumModal: React.FC<PrivateAlbumModalProps> = ({
  isOpen,
  albums,
  onClose,
  onPreviewPhoto,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [unlockedAlbum, setUnlockedAlbum] = useState<PrivateAlbum | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmed = pinInput.trim();
    if (!trimmed) {
      setErrorMsg('يرجى إدخال الرقم السري الخاص بجلستك.');
      return;
    }

    const matched = albums.find(a => a.pinCode === trimmed);
    if (matched) {
      setUnlockedAlbum(matched);
      setErrorMsg('');
    } else {
      setErrorMsg('الرقم السري غير صحيح. يرجى التأكد من الرقم المرسل لك عبر واتساب.');
    }
  };

  const handleDownloadSingle = (photo: PrivateAlbumPhoto) => {
    downloadPhoto(photo.url, `${unlockedAlbum?.clientName || 'Private'}_${photo.title}.jpg`);
  };

  const handleDownloadAll = () => {
    if (!unlockedAlbum) return;
    setIsDownloadingAll(true);
    // Trigger download for each photo sequentially
    unlockedAlbum.photos.forEach((photo, idx) => {
      setTimeout(() => {
        downloadPhoto(photo.url, `${unlockedAlbum.clientName}_Photo_${idx + 1}_${photo.title}.jpg`);
      }, idx * 300);
    });

    setTimeout(() => {
      setIsDownloadingAll(false);
    }, unlockedAlbum.photos.length * 350);
  };

  const handleReset = () => {
    setUnlockedAlbum(null);
    setPinInput('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92dvh] flex flex-col bg-zinc-950 border border-amber-500/30 rounded-3xl shadow-2xl p-4 sm:p-8 my-auto text-white overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-5 sm:left-5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto pr-0.5">
          {!unlockedAlbum ? (
            /* STEP 1: PIN ENTRY FORM */
            <div className="max-w-md mx-auto py-6 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                  <Lock className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black font-cairo">
                  ألبومي الخاص المشفر
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  لكل عميل خصوصيته الكاملة. أدخل الرقم السري (PIN) المستلم من الأستاذ حسام كينو لتصفح وتحميل جميع صور جلستك بجودة الطباعة الأصلية.
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-500">
                    <KeyRound className="w-5 h-5 text-amber-400" />
                  </div>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="أدخل الرقم السري (مثال: 1234)"
                    className="w-full pl-4 pr-12 py-3.5 bg-zinc-900 border border-zinc-700 rounded-xl text-center text-lg font-mono tracking-widest text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                    autoFocus
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs text-right">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-zinc-950 font-bold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  فتح الألبوم الآن
                </button>
              </form>

              {/* Privacy Note */}
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-xs text-zinc-400 flex flex-col gap-1 text-right">
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>خصوصية تامة:</span>
                </span>
                <span>يتم إرسال الرقم السري الخاص بالألبوم مباشرة من الأستاذ حسام كينو للعميل فور الانتهاء من تجهيز وتعديل الصور.</span>
              </div>
            </div>
          ) : (
            /* STEP 2: UNLOCKED PRIVATE ALBUM VIEW */
            <div className="space-y-6">
              
              {/* Album Header & Greetings */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-amber-500/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>تم فتح الألبوم بنجاح</span>
                    </span>
                    <span>·</span>
                    <span>{unlockedAlbum.category}</span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-black text-white font-cairo">
                    ألبوم العميل: {unlockedAlbum.clientName}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>تاريخ الجلسة: {unlockedAlbum.sessionDate}</span>
                    </span>
                    <span>·</span>
                    <span>عدد الصور: {unlockedAlbum.photos.length} صورة</span>
                  </div>

                  {unlockedAlbum.notes && (
                    <p className="text-xs text-zinc-300 mt-2 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800">
                      "{unlockedAlbum.notes}"
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleDownloadAll}
                    disabled={isDownloadingAll}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloadingAll ? 'جاري التحميل...' : 'تحميل جميع الصور'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-3 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
                  >
                    ألبوم آخر
                  </button>
                </div>
              </div>

              {/* Photos Grid with portrait-safe aspect ratio and blurred backdrop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {unlockedAlbum.photos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-400 transition-all flex flex-col"
                  >
                    <div className="relative aspect-[4/5] sm:aspect-[4/3] bg-zinc-950 overflow-hidden flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110 pointer-events-none"
                        style={{ backgroundImage: `url(${photo.url})` }}
                      />
                      <img
                        src={photo.url}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="relative z-10 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                      <button
                        onClick={() => onPreviewPhoto({ url: photo.url, title: photo.title, clientName: unlockedAlbum.clientName })}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900/90 text-zinc-200 text-xs flex items-center gap-1 hover:text-amber-400"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>معاينة</span>
                      </button>

                      <button
                        onClick={() => handleDownloadSingle(photo)}
                        className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center hover:bg-amber-300 shadow-sm"
                        title="تحميل هذه الصورة"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200 truncate max-w-[150px]">
                      {idx + 1}. {photo.title}
                    </span>
                    <button
                      onClick={() => handleDownloadSingle(photo)}
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Download className="w-3 h-3" />
                      <span>تحميل</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
        </div>

      </div>
    </div>
  );
};
