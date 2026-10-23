import { PhotoItem, PricingPackage, Testimonial, PrivateAlbum, StudioConfig } from '../types';
import { createPhotographySvg } from '../utils/imageHelpers';

// Real data from Hossam Keno's official studio profile
export const initialStudioConfig: StudioConfig = {
  studioName: 'لوكيشن تصوير حسام كينو (بتاع الديكورات)',
  tagline: 'كوشات وأحدث الديكورات لتصوير الزفاف، الخطوبة، أعياد الميلاد، والسيشن الشبابي بأعلى جودة',
  phone: '01205155424',
  whatsapp: '201205155424',
  facebook: 'https://www.facebook.com/share/1QhGG7L9jg/',
  instagram: 'https://instagram.com',
  tiktok: 'https://tiktok.com',
  location: 'محافظة أسيوط - أبنوب - المعابدة (بجوار النقطة القديمة - الموقف)',
  adminPin: '2027'
};

export const initialPhotos: PhotoItem[] = [
  {
    id: 'photo-1',
    title: 'سيشن خطوبة وزفاف - كوشة الورد الفاخرة',
    category: 'weddings',
    clientName: 'جلسة تصوير داخلية',
    date: '2025-05-18',
    url: createPhotographySvg('wedding', 'سيشن زفاف وخطوبة - كوشة الورد الملكية', '', 1),
    isFeatured: true,
    location: 'لوكيشن حسام كينو - المعابدة',
    likesCount: 54,
    exif: {
      camera: 'Sony Alpha 7R V',
      lens: 'FE 85mm f/1.4 GM',
      aperture: 'f/1.8',
      shutter: '1/500s',
      iso: '100'
    }
  },
  {
    id: 'photo-2',
    title: 'كتب كتاب راقي بديكور الشموع والإضاءة الدافئة',
    category: 'weddings',
    clientName: 'جلسة تصوير مناسبات',
    date: '2025-06-02',
    url: createPhotographySvg('wedding', 'كتب كتاب وديكور الإضاءة الدافئة', '', 2),
    isFeatured: true,
    location: 'لوكيشن حسام كينو - أسيوط',
    likesCount: 62,
    exif: {
      camera: 'Canon EOS R5',
      lens: 'RF 50mm f/1.2L',
      aperture: 'f/1.4',
      shutter: '1/800s',
      iso: '125'
    }
  },
  {
    id: 'photo-3',
    title: 'سيشن شباب كاجوال وأزياء عصرية',
    category: 'graduation',
    clientName: 'سيشن شباب',
    date: '2025-06-10',
    url: createPhotographySvg('graduation', 'سيشن شباب كاجوال عصري', '', 3),
    isFeatured: true,
    location: 'لوكيشن حسام كينو - المعابدة',
    likesCount: 78,
    exif: {
      camera: 'Sony A7 IV',
      lens: 'FE 35mm f/1.4 GM',
      aperture: 'f/2.0',
      shutter: '1/1000s',
      iso: '100'
    }
  },
  {
    id: 'photo-4',
    title: 'سيشن أعياد ميلاد وديكورات البالونات وسبايدرمان',
    category: 'family',
    clientName: 'سيشن أطفال',
    date: '2025-06-15',
    url: createPhotographySvg('family', 'ديكورات بالونات أعياد الميلاد وسبايدرمان', '', 4),
    isFeatured: true,
    location: 'استوديو كينو للأطفال',
    likesCount: 91,
    exif: {
      camera: 'Sony A7 IV',
      lens: 'FE 50mm f/1.4 GM',
      aperture: 'f/2.2',
      shutter: '1/640s',
      iso: '160'
    }
  },
  {
    id: 'photo-5',
    title: 'بورتريه استوديو وإضاءة سينمائية احترافية',
    category: 'portrait',
    clientName: 'بورتريه شخصي',
    date: '2025-07-01',
    url: createPhotographySvg('portrait', 'بورتريه استوديو وإضاءة سينمائية', '', 5),
    isFeatured: false,
    location: 'لوكيشن كينو VIP',
    likesCount: 43,
    exif: {
      camera: 'Sony A7R V',
      lens: 'FE 85mm f/1.4 GM',
      aperture: 'f/1.4',
      shutter: '1/400s',
      iso: '100'
    }
  },
  {
    id: 'photo-6',
    title: 'حفل تخرج واحتفالات الدفعة',
    category: 'graduation',
    clientName: 'جلسة تخرج',
    date: '2025-07-12',
    url: createPhotographySvg('graduation', 'احتفالات التخرج وروب التخرج', '', 6),
    isFeatured: false,
    location: 'قاعة الاحتفالات',
    likesCount: 57,
    exif: {
      camera: 'Canon EOS R5',
      lens: 'RF 85mm f/1.2L',
      aperture: 'f/2.0',
      shutter: '1/800s',
      iso: '100'
    }
  }
];

export const initialPricingPackages: PricingPackage[] = [
  {
    id: 'pkg-silver',
    name: 'باقة سيشن الشباب والكاجوال',
    badge: 'كاجوال & بورتريه',
    price: '750 ج.م',
    duration: 'ساعة تصوير متكاملة',
    photosCount: '20 صورة معدلة بأعلى جودة',
    features: [
      'تصوير داخل لوكيشن كينو مع أحدث الديكورات',
      'تغيير 2 أوتفيت مختلفين',
      'تعديل ألوان سينمائي وتصفية بشرة',
      'تسليم كافة الصور الأصلية على الموبايل أو فلاشة',
      'صورة مطبوعة مهداة للصالون'
    ],
    isPopular: false
  },
  {
    id: 'pkg-birthday',
    name: 'باقة أعياد الميلاد والأطفال',
    badge: 'بالونات & كيك سماش',
    price: '950 ج.م',
    duration: 'ساعة ونصف تصوير ممتعة',
    photosCount: '30 صورة معدلة + كل الصور الخام',
    features: [
      'ديكور كامل بالبالونات وشخصيات كرتونية (سبايدرمان / أميرات)',
      'تصوير لحظات التورتة وكيك سماش',
      'فيديو ريلز قصير للاحتفال على تيك توك وإنستغرام',
      'صور عائلية مع الوالدين والإخوة',
      'طباعة تابلوه خشب مهدى للطفل'
    ],
    isPopular: false
  },
  {
    id: 'pkg-gold',
    name: 'باقة الخطوبة وكتب الكتاب (الأكثر طلباً)',
    badge: 'بتاع الديكورات الملكي',
    price: '1,800 ج.م',
    duration: 'ساعتان ونصف تصوير باللوكيشن',
    photosCount: '45 صورة معدلة بجودة 45MP',
    features: [
      'استخدام كافة ديكورات الكوشة المضاءة الفاخرة',
      'ألبوم ديجيتال فاخر مقاس 30x60 سم جلد طبيعي أو زجاجي',
      'فيديو ريلز سينمائي (Reels/TikTok) مونتاج 4K',
      '2 تابلوه خشب مائل مقاس 30x40 سم هدية',
      'جلسة خاصة برقم سري للعميل لتحميل صوره بجودة الطباعة'
    ],
    isPopular: true
  },
  {
    id: 'pkg-vip',
    name: 'باقة VIP زفاف وتغطية شاملة',
    badge: 'تغطية الفرح الكاملة',
    price: '3,500 ج.م',
    duration: 'تغطية السيشن والقاعة كاملة',
    photosCount: 'عدد مفتوح من الصور + 80 صورة معدلة',
    features: [
      'طاقم تصوير احترافي فوتوسيشن + فيديو سينمائي',
      'ألبوم زفاف كبير مقاس 30x75 سم + 2 ميني ألبوم للأهل',
      'فيديو تيزر سينمائي مونتاج بروفيشنال',
      'بوستر كبير مقاس 60x90 سم خشب كونتر فاخر',
      'ألبوم سري مشفر برمز خاص مدى الحياة'
    ],
    isPopular: false
  }
];

// Clean empty lists - only real records!
export const initialTestimonials: Testimonial[] = [];
export const initialPrivateAlbums: PrivateAlbum[] = [];
