import React from 'react';
import { Level } from '../../types';
import {
  BookOpen,
  Sparkles,
  Award,
  GraduationCap,
  Compass,
  Globe,
  ArrowRight,
  ArrowLeft,
  Smile,
  Heart,
  Sun,
  Star,
  TreePine,
  Layers,
} from 'lucide-react';

interface Props {
  levels: Level[];
  selectedLevelId: string | null;
  onSelectLevel: (level: Level) => void;
  onBack?: () => void;
}

export const LevelSelection: React.FC<Props> = ({ levels, selectedLevelId, onSelectLevel, onBack }) => {
  const tkLevels = levels.filter((l) => l.schoolType === 'TK' || l.educationLevel === 'TK');
  const sdLevels = levels.filter((l) => l.schoolType === 'SD' || l.educationLevel === 'SD');
  const smpLevels = levels.filter((l) => l.schoolType === 'SMP' || l.educationLevel === 'SMP');
  const smaLevels = levels.filter((l) => l.schoolType === 'SMA' || l.educationLevel === 'SMA');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smile':
        return <Smile className="w-5 h-5" />;
      case 'Heart':
        return <Heart className="w-5 h-5" />;
      case 'Sun':
        return <Sun className="w-5 h-5" />;
      case 'Star':
        return <Star className="w-5 h-5" />;
      case 'TreePine':
        return <TreePine className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'Compass':
        return <Compass className="w-5 h-5" />;
      case 'Globe':
        return <Globe className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const renderLevelCard = (lvl: Level, groupTheme: 'tk' | 'sd' | 'smp' | 'sma') => {
    const isSelected = selectedLevelId === lvl.id;

    // Theme color helper
    let activeBorder = 'hover:border-emerald-300';
    let iconBg = 'bg-emerald-100 text-emerald-800';
    let badgeBg = 'bg-emerald-100/80 text-emerald-800';
    let arrowHoverBg = 'group-hover:bg-emerald-600';

    if (groupTheme === 'tk') {
      activeBorder = 'hover:border-pink-300';
      iconBg = 'bg-pink-100 text-pink-700';
      badgeBg = 'bg-pink-100 text-pink-800';
      arrowHoverBg = 'group-hover:bg-pink-600';
    } else if (groupTheme === 'sd') {
      activeBorder = 'hover:border-amber-300';
      iconBg = 'bg-amber-100 text-amber-800';
      badgeBg = 'bg-amber-100 text-amber-800';
      arrowHoverBg = 'group-hover:bg-amber-600';
    } else if (groupTheme === 'sma') {
      activeBorder = 'hover:border-blue-300';
      iconBg = 'bg-blue-100 text-blue-800';
      badgeBg = 'bg-blue-100 text-blue-800';
      arrowHoverBg = 'group-hover:bg-blue-600';
    }

    return (
      <button
        key={lvl.id}
        id={`level-card-${lvl.id}`}
        type="button"
        onClick={() => onSelectLevel(lvl)}
        className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 border cursor-pointer relative overflow-hidden group flex flex-col justify-between ${
          isSelected
            ? 'bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-950/15 ring-2 ring-emerald-500'
            : `bg-white hover:bg-gray-50/70 text-gray-900 border-gray-200/80 ${activeBorder} shadow-xs hover:shadow-md`
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold transition-transform group-hover:scale-105 ${
                  isSelected ? 'bg-white/20 text-white' : iconBg
                }`}
              >
                {getIcon(lvl.iconName)}
              </div>
              <div>
                <span
                  className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full mb-0.5 ${
                    isSelected ? 'bg-emerald-800 text-emerald-200' : badgeBg
                  }`}
                >
                  {lvl.grade}
                </span>
                <h3 className={`text-base sm:text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {lvl.name}
                </h3>
              </div>
            </div>

            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                isSelected ? 'bg-emerald-500 text-white' : `bg-gray-100 text-gray-400 ${arrowHoverBg} group-hover:text-white`
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <p className={`mt-2.5 text-xs leading-relaxed ${isSelected ? 'text-emerald-100' : 'text-gray-600'}`}>
            {lvl.description}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 uppercase tracking-tight">
          Pilih Jenjang
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
          Silakan pilih jenjang kelas untuk langsung masuk ke halaman pembelajaran.
        </p>
      </div>

      {/* 1. TK Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-pink-500" />
          <h3 className="text-base font-bold text-gray-900 tracking-tight">Jenjang TK</h3>
          <span className="text-xs text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full font-semibold ml-auto">
            TK A & TK B
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {tkLevels.map((lvl) => renderLevelCard(lvl, 'tk'))}
        </div>
      </div>

      {/* 2. SD Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <h3 className="text-base font-bold text-gray-900 tracking-tight">Jenjang SD</h3>
          <span className="text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-semibold ml-auto">
            Kelas 1 s/d 6
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {sdLevels.map((lvl) => renderLevelCard(lvl, 'sd'))}
        </div>
      </div>

      {/* 3. SMP Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-emerald-600" />
          <h3 className="text-base font-bold text-gray-900 tracking-tight">Jenjang SMP</h3>
          <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold ml-auto">
            Kelas 7, 8, 9
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {smpLevels.map((lvl) => renderLevelCard(lvl, 'smp'))}
        </div>
      </div>

      {/* 4. SMA Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <h3 className="text-base font-bold text-gray-900 tracking-tight">Jenjang SMA</h3>
          <span className="text-xs text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full font-semibold ml-auto">
            Kelas 10, 11, 12
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {smaLevels.map((lvl) => renderLevelCard(lvl, 'sma'))}
        </div>
      </div>
    </div>
  );
};
