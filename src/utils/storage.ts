import { 
  PhotoItem, 
  PricingPackage, 
  Testimonial, 
  PrivateAlbum, 
  BookingRequest, 
  StudioConfig 
} from '../types';

const DB_NAME = 'HossamKenoStudioDB_v2';
const STORE_NAME = 'studio_store';
const DB_VERSION = 1;

export const STORAGE_KEYS = {
  CONFIG: 'hossam_keno_v2_config',
  PHOTOS: 'hossam_keno_v2_photos',
  DELETED_IDS: 'hossam_keno_v2_deleted_photo_ids',
  PACKAGES: 'hossam_keno_v2_packages',
  TESTIMONIALS: 'hossam_keno_v2_testimonials',
  ALBUMS: 'hossam_keno_v2_albums',
  BOOKINGS: 'hossam_keno_v2_bookings',
};

export interface StudioFullState {
  studioConfig: StudioConfig;
  photos: PhotoItem[];
  deletedPhotoIds: string[];
  packages: PricingPackage[];
  testimonials: Testimonial[];
  albums: PrivateAlbum[];
  bookings: BookingRequest[];
  updatedAt: number;
}

// Open IndexedDB connection
function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch (e) {
    console.warn('IDB write warning:', e);
  }
}

export async function idbGet<T>(key: string): Promise<T | undefined> {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        db.close();
        resolve(req.result as T | undefined);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  } catch {
    return undefined;
  }
}

// Safe localStorage helpers that never throw QuotaExceededError
export function safeLocalSet(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn(`LocalStorage quota reached for ${key}, relying on IndexedDB & Server.`, e);
    return false;
  }
}

export function safeLocalGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Sync state with backend server (/api/studio-state) if available
export async function fetchServerState(): Promise<Partial<StudioFullState> | null> {
  try {
    const res = await fetch('/api/studio-state', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function saveServerState(state: Partial<StudioFullState>): Promise<void> {
  try {
    await fetch('/api/studio-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...state,
        updatedAt: Date.now()
      })
    });
  } catch {
    // Offline or static mode fallback handled by IndexedDB + localStorage
  }
}
