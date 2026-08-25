export interface HomepageConfig {
  // Top Badge
  topBadgeText: string;
  topBadgeBg: string; // Tailwind gradient or class
  
  // Hero Title
  heroTitleLine1: string;
  heroTitleLine2Prefix: string;
  heroTitleLine2Highlight: string;
  heroTitleLine3: string;
  
  // Tagline & Subtitle
  taglineText: string;
  taglineBg: string;
  taglineTextColor: string;
  subtitleText: string;
  
  // Card Header & Form
  cardHeaderTitle: string;
  cardHeaderSubtitle: string;
  cardHeaderBg: string;
  cardBorderColor: string;
  
  // Submit Button
  submitBtnText: string;
  submitBtnBg: string; // E.g. 'btn-game-emerald' | 'btn-game-amber' | 'btn-game-pink' | 'btn-game-sky' | 'btn-game-indigo'
  
  // Global Styles
  pageBgGradient: string;
  fontFamily: 'Outfit' | 'Nunito' | 'Quicksand' | 'Plus Jakarta Sans';
  titleFontSize: 'normal' | 'large' | 'xlarge';
}

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  topBadgeText: 'THE ENGLISH SEKOLAH ALAM AL-KARIM',
  topBadgeBg: 'from-teal-600 via-emerald-600 to-indigo-600',
  
  heroTitleLine1: 'Selamat Datang di',
  heroTitleLine2Prefix: 'The ',
  heroTitleLine2Highlight: 'ENGLISH',
  heroTitleLine3: 'Sekolah Alam Al-Karim',
  
  taglineText: 'Semua Akan Inggris Pada Waktunya',
  taglineBg: 'bg-teal-50/90 border-teal-200/90',
  taglineTextColor: 'text-teal-900',
  subtitleText: 'Media Pembelajaran & Evaluasi Bahasa Inggris Interaktif (TK, SD, SMP, SMA)',
  
  cardHeaderTitle: 'Mulai Petualangan',
  cardHeaderSubtitle: 'Cari nama dari {count} siswa terdaftar',
  cardHeaderBg: 'from-teal-600 via-emerald-600 to-teal-700',
  cardBorderColor: 'border-teal-200/90',
  
  submitBtnText: '🚀 MULAI PETUALANGAN BELAJAR',
  submitBtnBg: 'btn-game-emerald',
  
  pageBgGradient: 'bg-mesh-colorful',
  fontFamily: 'Outfit',
  titleFontSize: 'normal',
};

const STORAGE_KEY = 'theenglish_homepage_config';

export function getHomepageConfig(): HomepageConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_HOMEPAGE_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to load homepage config from localStorage:', err);
  }
  return DEFAULT_HOMEPAGE_CONFIG;
}

export function saveHomepageConfig(config: HomepageConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('homepage-config-updated'));
  } catch (err) {
    console.error('Failed to save homepage config to localStorage:', err);
  }
}

export function resetHomepageConfig(): HomepageConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('homepage-config-updated'));
  } catch (err) {
    console.error('Failed to reset homepage config:', err);
  }
  return DEFAULT_HOMEPAGE_CONFIG;
}
