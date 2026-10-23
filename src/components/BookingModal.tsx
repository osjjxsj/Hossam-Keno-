import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Sparkles, MessageCircle, Clock, CheckCircle2, MapPin } from 'lucide-react';
import { BookingRequest, PricingPackage, SessionCategory, StudioConfig } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  initialCategory?: string;
  initialPackage?: PricingPackage | null;
  packages: PricingPackage[];
  studioConfig: StudioConfig;
  onClose: () => void;
  onSubmitBooking: (booking: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  initialCategory,
  initialPackage,
  packages,
  studioConfig,
  onClose,
  onSubmitBooking,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [category, setCategory] = useState<SessionCategory>('weddings');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('وقت الغروب الذهبي (Golden Hour)');
  const [packageChosen, setPackageChosen] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialCategory && ['weddings', 'family', 'portrait', 'graduation'].includes(initialCategory)) {
      setCategory(initialCategory as SessionCategory);
    }
    if (initialPackage) {
      setPackageChosen(initialPackage.name);
    }
  }, [initialCategory, initialPackage]);

  if (!isOpen) return null;

  const categoryLabels: Record<string, string> = {
    weddings: 'أفراح وخطوبة',
    family: 'أطفال وعائلات',
    portrait: 'جلسات فردية وبورتريه',
    graduation: 'تخرج وكاجوال'
  };

  const handleFormSubmit = (e: React.FormEvent, viaWhatsApp: boolean = false) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('يرجى ملء الاسم ورقم الهاتف.');
      return;
    }

    const bookingData = {
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      category: category as 'weddings' | 'family' | 'portrait' | 'graduation',
      sessionDate: sessionDate || 'حسب التنسيق',
      sessionTime,
      packageChosen: packageChosen || 'باقة مخصصة',
      notes: notes.trim()
    };

    onSubmitBooking(bookingData);

    if (viaWhatsApp) {
      const waText = `*طلب حجز سيشن جديد لدى حسام كينو للتصوير:*
👤 *اسم العميل:* ${bookingData.clientName}
📱 *الهاتف:* ${bookingData.clientPhone}
📸 *نوع السيشن:* ${categoryLabels[bookingData.category]}
📦 *الباقة:* ${bookingData.packageChosen}
📅 *التاريخ المفضل:* ${bookingData.sessionDate}
⏰ *الوقت المفضل:* ${bookingData.sessionTime}
📝 *ملاحظات:* ${bookingData.notes || 'لا يوجد'}

أرجو تأكيد موعد السيشن والتفاصيل المتبقية. شكراً لك!`;

      const waUrl = `https://wa.me/${studioConfig.whatsapp}?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank');
    }

    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92dvh] flex flex-col bg-zinc-950 border border-amber-500/30 rounded-3xl shadow-2xl p-5 sm:p-8 my-auto text-white overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 left-4 sm:top-5 sm:left-5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto pr-0.5">

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold font-cairo">تم استلام طلب حجزك بنجاح!</h3>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-sm mx-auto">
              شكراً لاختيارك حسام كينو للتصوير الفوتوغرافي. سيقوم فريق العمل أو الأستاذ حسام بالتواصل معك هاتفياً أو عبر واتساب لتأكيد موعد الجلسة وتجهيز كافة الترتيبات.
            </p>
            <div className="pt-4">
              <button
                onClick={resetAndClose}
                className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-sm hover:bg-amber-300 transition-colors"
              >
                العودة للمعرض
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="text-right space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>حجز موعد سيشن تصوير</span>
              </div>
              <h3 className="text-2xl font-black font-cairo text-white">
                احجز جلستك مع <span className="gold-gradient-text">حسام كينو</span>
              </h3>
              <p className="text-xs text-zinc-400">
                املأ البيانات وسنتواصل معك فوراً لتأكيد الوقت واللوكيشن المناسب.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4 text-right">
              
              {/* Client Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  الاسم بالكامل *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4 text-amber-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="مثال: ياسمين المنياوي أو أحمد الشافعي"
                    className="w-full pl-4 pr-10 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  رقم الهاتف (الواتساب) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Phone className="w-4 h-4 text-amber-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full pl-4 pr-10 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 text-left font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    نوع السيشن
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SessionCategory)}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="weddings">أفراح وخطوبة</option>
                    <option value="family">أطفال وعائلات</option>
                    <option value="portrait">جلسات فردية وبورتريه</option>
                    <option value="graduation">تخرج وكاجوال</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    الباقة المفضلة
                  </label>
                  <select
                    value={packageChosen}
                    onChange={(e) => setPackageChosen(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">اختر باقة (اختياري)</option>
                    {packages.map(p => (
                      <option key={p.id} value={p.name}>{p.name} ({p.price})</option>
                    ))}
                    <option value="باقة مخصصة">باقة خاصة حسب الاتفاق</option>
                  </select>
                </div>
              </div>

              {/* Date & Time Preferences */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    التاريخ المفضل
                  </label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    الوقت المفضل
                  </label>
                  <select
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="وقت الغروب الذهبي (Golden Hour)">الغروب الذهبي (Golden Hour)</option>
                    <option value="صباحي مشمس طبيعي (Morning)">صباحي مشمس (Morning)</option>
                    <option value="استوديو داخلي مسائي (Evening Studio)">استوديو داخلي مسائي</option>
                    <option value="تغطية حفل كامل (Full Event)">تغطية حفل كامل</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  ملاحظات أو تفاصيل اللوكيشن (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أذكر أي تفاصيل مثل مكان القاعة، عدد الأشخاص، أو أفكار مخصصة ترغب بها..."
                  className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2">
                <button
                  type="button"
                  onClick={(e) => handleFormSubmit(e, true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>إرسال وتأكيد الحجز عبر واتساب فوراً</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleFormSubmit(e, false)}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold text-xs hover:border-amber-400 hover:text-white transition-colors cursor-pointer"
                >
                  حفظ طلب الحجز وسنتصل بك
                </button>
              </div>

            </form>

          </div>
        )}
        </div>

      </div>
    </div>
  );
};
