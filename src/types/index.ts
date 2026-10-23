export type SessionCategory = 'all' | 'weddings' | 'family' | 'portrait' | 'graduation';

export interface PhotoItem {
  id: string;
  title: string;
  category: 'weddings' | 'family' | 'portrait' | 'graduation';
  clientName: string;
  date: string;
  url: string;
  isFeatured?: boolean;
  location?: string;
  likesCount?: number;
  exif?: {
    camera: string;
    lens: string;
    aperture: string;
    shutter: string;
    iso: string;
  };
}

export interface PricingPackage {
  id: string;
  name: string;
  badge?: string;
  price: string;
  duration: string;
  photosCount: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  sessionType: string;
  rating: number;
  date: string;
  comment: string;
}

export interface PrivateAlbumPhoto {
  id: string;
  url: string;
  title: string;
  date: string;
}

export interface PrivateAlbum {
  id: string;
  clientName: string;
  clientPhone: string;
  sessionDate: string;
  category: string;
  pinCode: string;
  coverImage: string;
  notes?: string;
  photos: PrivateAlbumPhoto[];
  createdAt: string;
}

export interface BookingRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  category: 'weddings' | 'family' | 'portrait' | 'graduation';
  sessionDate: string;
  sessionTime: string;
  packageChosen?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface StudioConfig {
  studioName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  location: string;
  adminPin: string;
}
