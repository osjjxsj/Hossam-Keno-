import React, { useState } from 'react';
import { Star, MessageSquare, Quote, Plus, Check } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onAddTestimonial: (test: Omit<Testimonial, 'id' | 'date'>) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  onAddTestimonial,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [clientName, setClientName] = useState('');
  const [sessionType, setSessionType] = useState('سيشن زفاف');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !comment.trim()) return;

    onAddTestimonial({
      clientName: clientName.trim(),
      sessionType,
      rating,
      comment: comment.trim()
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowAddModal(false);
      setClientName('');
      setComment('');
    }, 1200);
  };

  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24 bg-zinc-950 text-white relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 sm:mb-16">
          <div className="text-right space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>تجارب عملائنا المميزين</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo">
              ماذا يقول عملاؤنا عن <span className="gold-gradient-text">حسام كينو</span>
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl">
              ثقتكم هي وسام فخرنا وسر تميزنا المستمر في عالم التصوير الفوتوغرافي الراقي.
            </p>
          </div>

          {/* Add Review Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-300 hover:border-amber-400 text-xs sm:text-sm font-semibold transition-all hover:bg-zinc-850 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>شاركنا برأيك وتجربتك</span>
          </button>
        </div>

        {/* Testimonials Cards Grid */}
        {testimonials.length === 0 ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80 max-w-xl mx-auto space-y-4">
            <MessageSquare className="w-10 h-10 mx-auto text-amber-400/60" />
            <h4 className="text-lg font-bold text-white font-cairo">
              شاركنا تجربتك ورأيك بعد جلستك
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              يسعدنا دائماً استقبال تقييمات عملائنا الكرام وآرائهم حول جلسات التصوير والخدمة المقدمة.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm hover:shadow-md transition-all cursor-pointer"
            >
              أضف أول تقييم الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-6 relative flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Quote Icon & Stars */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-amber-400/20" />
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                    "{t.comment}"
                  </p>
                </div>

                {/* Client Info */}
                <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white font-cairo">
                      {t.clientName}
                    </h4>
                    <span className="text-[11px] text-amber-400/90">
                      {t.sessionType}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {t.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Review Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 text-white text-right space-y-4 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="font-bold text-lg font-cairo">أضف تقييمك ورأيك في السيشن</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              {success ? (
                <div className="py-6 text-center space-y-2 text-emerald-400">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-sm">شكراً لك! تم إضافة تقييمك بنجاح.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">اسمك الكريم</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="مثال: سارة & كريم"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">نوع الجلسة</label>
                    <select
                      value={sessionType}
                      onChange={(e) => setSessionType(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="سيشن زفاف ملكي">سيشن زفاف ملكي</option>
                      <option value="سيشن خطوبة كلاسيك">سيشن خطوبة كلاسيك</option>
                      <option value="سيشن تخرج واحتفال">سيشن تخرج واحتفال</option>
                      <option value="سيشن أطفال وعائلي">سيشن أطفال وعائلي</option>
                      <option value="بورتريه شخصي واستوديو">بورتريه شخصي واستوديو</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">تقييمك</label>
                    <div className="flex items-center gap-1 justify-end">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">تجربتك ورأيك في التصوير</label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="اكتب انطباعك عن تعامل حسام كينو وجودة الصور..."
                      className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs hover:shadow-md transition-all"
                    >
                      نشر التقييم الآن
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
