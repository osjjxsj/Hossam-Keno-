// High-fidelity luxury photographic SVG visuals and download helper

export const createPhotographySvg = (
  theme: 'wedding' | 'portrait' | 'family' | 'graduation' | 'studio',
  title: string,
  clientName: string,
  variant: number = 1
): string => {
  const themes = {
    wedding: {
      grad1: '#1c1917',
      grad2: '#292524',
      accent: '#d4af37',
      accentLight: '#fef08a',
      subtitle: 'جلسة زفاف & خطوبة ملكية',
      icon: `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#goldGrad)" opacity="0.8"/>`
    },
    portrait: {
      grad1: '#09090b',
      grad2: '#18181b',
      accent: '#eab308',
      accentLight: '#fde047',
      subtitle: 'بورتريه سينمائي احترافي',
      icon: `<circle cx="12" cy="7" r="4" stroke="url(#goldGrad)" stroke-width="2" fill="none"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" stroke="url(#goldGrad)" stroke-width="2" fill="none"/>`
    },
    family: {
      grad1: '#18181b',
      grad2: '#27272a',
      accent: '#f59e0b',
      accentLight: '#fef3c7',
      subtitle: 'لحظات دافئة للأطفال والعائلة',
      icon: `<circle cx="9" cy="7" r="3" stroke="url(#goldGrad)" stroke-width="1.8" fill="none"/><circle cx="16" cy="9" r="2.5" stroke="url(#goldGrad)" stroke-width="1.8" fill="none"/><path d="M3 20v-2a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2M14 17h4a2 2 0 0 1 2 2v1" stroke="url(#goldGrad)" stroke-width="1.8" fill="none"/>`
    },
    graduation: {
      grad1: '#0f172a',
      grad2: '#1e293b',
      accent: '#d4af37',
      accentLight: '#fef9c3',
      subtitle: 'فرحة التخرج والنجاح',
      icon: `<path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="url(#goldGrad)" stroke-width="2" fill="none"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" stroke="url(#goldGrad)" stroke-width="2" fill="none"/>`
    },
    studio: {
      grad1: '#0c0a09',
      grad2: '#1c1917',
      accent: '#d4af37',
      accentLight: '#fef08a',
      subtitle: 'استوديو حسام كينو للتصوير',
      icon: `<circle cx="12" cy="12" r="8" stroke="url(#goldGrad)" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3" fill="url(#goldGrad)"/>`
    }
  };

  const t = themes[theme] || themes.studio;

  // Generate subtle geometric photographic visual composition
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${t.grad1}"/>
        <stop offset="50%" stop-color="${t.grad2}"/>
        <stop offset="100%" stop-color="#050505"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="${t.accent}"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <radialGradient id="softbox" cx="50%" cy="35%" r="45%">
        <stop offset="0%" stop-color="${t.accent}" stop-opacity="0.25"/>
        <stop offset="50%" stop-color="${t.accent}" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="${t.accent}" stop-opacity="0"/>
      </radialGradient>
      <pattern id="lensGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${t.accent}" stroke-opacity="0.03" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="1200" height="900" fill="url(#bgGrad)"/>
    <rect width="1200" height="900" fill="url(#lensGrid)"/>

    <!-- Atmospheric studio lighting & softbox radial glow -->
    <circle cx="600" cy="380" r="420" fill="url(#softbox)"/>
    <circle cx="${variant % 2 === 0 ? '750' : '450'}" cy="300" r="280" fill="url(#softbox)" opacity="0.6"/>

    <!-- Lens framing & cinematic crop lines -->
    <circle cx="600" cy="400" r="240" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="6 6" fill="none" opacity="0.35"/>
    <circle cx="600" cy="400" r="160" stroke="url(#goldGrad)" stroke-width="1" fill="none" opacity="0.2"/>

    <!-- Viewfinder Crosshairs -->
    <path d="M560 400 L640 400 M600 360 L600 440" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.4"/>
    <path d="M100 100 L160 100 M100 100 L100 160" stroke="url(#goldGrad)" stroke-width="2" opacity="0.6"/>
    <path d="M1100 100 L1040 100 M1100 100 L1100 160" stroke="url(#goldGrad)" stroke-width="2" opacity="0.6"/>
    <path d="M100 800 L160 800 M100 800 L100 740" stroke="url(#goldGrad)" stroke-width="2" opacity="0.6"/>
    <path d="M1100 800 L1040 800 M1100 800 L1100 740" stroke="url(#goldGrad)" stroke-width="2" opacity="0.6"/>

    <!-- Central photographic icon emblem -->
    <g transform="translate(560, 360) scale(3.3)">
      ${t.icon}
    </g>

    <!-- Luxury Gold Watermark Seal -->
    <text x="600" y="220" text-anchor="middle" font-family="'Cinzel', serif" font-size="20" letter-spacing="8" fill="#d4af37" opacity="0.7">HOSSAM KENO PHOTOGRAPHY</text>
    
    <!-- Title and subtitle -->
    <text x="600" y="550" text-anchor="middle" font-family="'Cairo', sans-serif" font-size="34" font-weight="700" fill="#ffffff" letter-spacing="1">${title}</text>
    <text x="600" y="605" text-anchor="middle" font-family="'Tajawal', sans-serif" font-size="20" font-weight="500" fill="#d4af37">${clientName ? `${t.subtitle} · ${clientName}` : t.subtitle}</text>
    
    <!-- Camera Spec Watermark -->
    <text x="600" y="760" text-anchor="middle" font-family="monospace" font-size="14" fill="#a1a1aa" opacity="0.8">SONY A7R V · G-MASTER 85MM F/1.4 · ISO 100 · 1/500s</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const downloadPhoto = (url: string, filename: string = 'Hossam_Keno_Photo.jpg') => {
  // If it's a data url or image url, trigger direct download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/\s+/g, '_');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const fileToBase64 = (file: File, maxDimension: number = 1600, quality: number = 0.84): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      // Compress image using canvas so large phone photos fit in storage without quota errors
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = (error) => reject(error);
  });
};
