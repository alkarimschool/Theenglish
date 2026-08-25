import { Level } from '../types';

export type JenjangTier = 'TK' | 'SD' | 'SMP' | 'SMA';

export interface JenjangTheme {
  tier: JenjangTier;
  tierName: string;
  worldName: string;
  tagline: string;
  mascotEmoji: string;
  questionPrefix: string;
  incorrectFeedback: string;
  gameBtnClass: string;
  cardStyleClass: string;
  bannerGradient: string;
  headerGradient: string;
  subtleGradient: string;
  cardBgHover: string;
  bgLight: string;
  bgActive: string;
  borderColor: string;
  borderHover: string;
  badgeBg: string;
  badgeText: string;
  textAccent: string;
  textDark: string;
  btnPrimary: string;
  btnLight: string;
  ringColor: string;
  progressBarColor: string;
  avatarBg: string;
  activeOptionBorder: string;
  activeOptionBg: string;
}

export function getJenjangTier(level: Level | string | null | undefined): JenjangTier {
  if (!level) return 'SMP';
  let id = '';
  let schoolType: JenjangTier | undefined = undefined;

  if (typeof level === 'string') {
    id = level.toLowerCase();
  } else if (typeof level === 'object' && level !== null) {
    id = (level.id || level.name || '').toLowerCase();
    schoolType = level.schoolType;
  }

  if (schoolType) return schoolType;
  if (id.startsWith('tk-') || id === 'tk' || id.includes('tk')) return 'TK';
  if (id.startsWith('sd-') || id === 'sd' || id.includes('sd')) return 'SD';
  if (id.startsWith('smp-') || id === 'smp' || id.includes('smp')) return 'SMP';
  if (id.startsWith('sma-') || id === 'sma' || id.includes('sma')) return 'SMA';

  return 'SMP';
}

export function getJenjangTheme(level: Level | string | null | undefined): JenjangTheme {
  const tier = getJenjangTier(level);

  switch (tier) {
    case 'TK':
      return {
        tier: 'TK',
        tierName: 'Jenjang TK (Early Childhood)',
        worldName: 'TK Candy Playland',
        tagline: 'Let\'s Explore English & Play Together!',
        mascotEmoji: '🐰',
        questionPrefix: 'LET\'S PLAY!',
        incorrectFeedback: 'Good try! Let\'s try again! You can do it! 🌟',
        gameBtnClass: 'btn-game-pink',
        cardStyleClass: 'card-game-tk',
        bannerGradient: 'from-pink-500 via-rose-400 to-amber-300',
        headerGradient: 'from-pink-900 via-rose-900 to-pink-950',
        subtleGradient: 'from-pink-50/80 via-rose-50/40 to-white',
        cardBgHover: 'hover:bg-pink-50/50',
        bgLight: 'bg-pink-50',
        bgActive: 'bg-pink-500',
        borderColor: 'border-pink-300',
        borderHover: 'hover:border-pink-400',
        badgeBg: 'bg-pink-100',
        badgeText: 'text-pink-900 font-black',
        textAccent: 'text-pink-600',
        textDark: 'text-pink-950',
        btnPrimary:
          'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-pink-500/25',
        btnLight: 'bg-pink-100 hover:bg-pink-200 text-pink-900',
        ringColor: 'ring-pink-400',
        progressBarColor: 'bg-gradient-to-r from-pink-500 to-rose-400',
        avatarBg: 'bg-pink-100 text-pink-700',
        activeOptionBorder: 'border-pink-500 ring-4 ring-pink-300/50',
        activeOptionBg: 'bg-pink-50/90 text-pink-950',
      };

    case 'SD':
      return {
        tier: 'SD',
        tierName: 'Jenjang SD (Primary School)',
        worldName: 'SD Nature Jungle Explorer',
        tagline: 'Explore the World & Complete Missions!',
        mascotEmoji: '🦊',
        questionPrefix: 'MISSION',
        incorrectFeedback: 'Good try, Explorer! Analyze again to find the clue! 🎒',
        gameBtnClass: 'btn-game-amber',
        cardStyleClass: 'card-game-sd',
        bannerGradient: 'from-amber-500 via-orange-500 to-emerald-500',
        headerGradient: 'from-amber-950 via-orange-950 to-stone-900',
        subtleGradient: 'from-amber-50/80 via-orange-50/40 to-white',
        cardBgHover: 'hover:bg-amber-50/50',
        bgLight: 'bg-amber-50',
        bgActive: 'bg-amber-500',
        borderColor: 'border-amber-300',
        borderHover: 'hover:border-amber-400',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-950 font-black',
        textAccent: 'text-amber-700',
        textDark: 'text-amber-950',
        btnPrimary:
          'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25',
        btnLight: 'bg-amber-100 hover:bg-amber-200 text-amber-900',
        ringColor: 'ring-amber-400',
        progressBarColor: 'bg-gradient-to-r from-amber-500 to-orange-500',
        avatarBg: 'bg-amber-100 text-amber-800',
        activeOptionBorder: 'border-amber-500 ring-4 ring-amber-300/50',
        activeOptionBg: 'bg-amber-50/90 text-amber-950',
      };

    case 'SMP':
      return {
        tier: 'SMP',
        tierName: 'Jenjang SMP (Junior High)',
        worldName: 'SMP Cyber Challenge Arena',
        tagline: 'Master English Foundations & Rise to the Top!',
        mascotEmoji: '⚡',
        questionPrefix: 'CHALLENGE',
        incorrectFeedback: 'Good effort! Review the clue and conquer the challenge! ⚡',
        gameBtnClass: 'btn-game-emerald',
        cardStyleClass: 'card-game-smp',
        bannerGradient: 'from-emerald-600 via-teal-600 to-sky-600',
        headerGradient: 'from-emerald-950 via-teal-950 to-slate-950',
        subtleGradient: 'from-emerald-50/80 via-teal-50/40 to-white',
        cardBgHover: 'hover:bg-emerald-50/50',
        bgLight: 'bg-emerald-50',
        bgActive: 'bg-emerald-600',
        borderColor: 'border-emerald-300',
        borderHover: 'hover:border-emerald-400',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-950 font-black',
        textAccent: 'text-emerald-700',
        textDark: 'text-emerald-950',
        btnPrimary:
          'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/25',
        btnLight: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900',
        ringColor: 'ring-emerald-400',
        progressBarColor: 'bg-gradient-to-r from-emerald-600 to-teal-600',
        avatarBg: 'bg-emerald-100 text-emerald-800',
        activeOptionBorder: 'border-emerald-600 ring-4 ring-emerald-300/50',
        activeOptionBg: 'bg-emerald-50/90 text-emerald-950',
      };

    case 'SMA':
      return {
        tier: 'SMA',
        tierName: 'Jenjang SMA (Senior High)',
        worldName: 'SMA Star Quest Academy',
        tagline: 'Analytical Leadership & Global English Readiness',
        mascotEmoji: '🎓',
        questionPrefix: 'QUEST',
        incorrectFeedback: 'Analytical mind at work. Refine your choice for the ultimate Quest! 🎯',
        gameBtnClass: 'btn-game-indigo',
        cardStyleClass: 'card-game-sma',
        bannerGradient: 'from-blue-600 via-indigo-600 to-purple-600',
        headerGradient: 'from-slate-950 via-blue-950 to-indigo-950',
        subtleGradient: 'from-blue-50/80 via-indigo-50/40 to-white',
        cardBgHover: 'hover:bg-blue-50/50',
        bgLight: 'bg-blue-50',
        bgActive: 'bg-blue-600',
        borderColor: 'border-blue-300',
        borderHover: 'hover:border-blue-400',
        badgeBg: 'bg-blue-100',
        badgeText: 'text-blue-950 font-black',
        textAccent: 'text-blue-700',
        textDark: 'text-blue-950',
        btnPrimary:
          'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/25',
        btnLight: 'bg-blue-100 hover:bg-blue-200 text-blue-900',
        ringColor: 'ring-blue-400',
        progressBarColor: 'bg-gradient-to-r from-blue-600 to-indigo-600',
        avatarBg: 'bg-blue-100 text-blue-800',
        activeOptionBorder: 'border-blue-600 ring-4 ring-blue-300/50',
        activeOptionBg: 'bg-blue-50/90 text-blue-950',
      };
  }
}
