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

    let cardStyle = 'card-game-sd';
    let iconBg = 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300';
    let badgeBg = 'bg-emerald-100 text-emerald-950 border border-emerald-300';
    let btnStyle = 'btn-game-emerald';
    let realmEmoji = '🌴';

    if (groupTheme === 'tk') {
      cardStyle = 'card-game-tk';
      iconBg = 'bg-pink-100 text-pink-700 border-2 border-pink-300';
      badgeBg = 'bg-pink-100 text-pink-950 border border-pink-300';
      btnStyle = 'btn-game-pink';
      realmEmoji = '🌸';
    } else if (groupTheme === 'sd') {
      cardStyle = 'card-game-sd';
      iconBg = 'bg-amber-100 text-amber-900 border-2 border-amber-300';
      badgeBg = 'bg-amber-100 text-amber-950 border border-amber-300';
      btnStyle = 'btn-game-amber';
      realmEmoji = '🌴';
    } else if (groupTheme === 'smp') {
      cardStyle = 'card-game-smp';
      iconBg = 'bg-sky-100 text-sky-800 border-2 border-sky-300';
      badgeBg = 'bg-sky-100 text-sky-950 border border-sky-300';
      btnStyle = 'btn-game-sky';
      realmEmoji = '🏔️';
    } else if (groupTheme === 'sma') {
      cardStyle = 'card-game-sma';
      iconBg = 'bg-purple-100 text-purple-800 border-2 border-purple-300';
      badgeBg = 'bg-purple-100 text-purple-950 border border-purple-300';
      btnStyle = 'btn-game-indigo';
      realmEmoji = '🏰';
    }

    return (
      <div
        key={lvl.id}
        id={`level-card-${lvl.id}`}
        className={`rounded-3xl p-5 sm:p-6 card-game-portal ${cardStyle} flex flex-col justify-between relative overflow-hidden group`}
      >
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-sm animate-float ${iconBg}`}
              >
                <span className="text-xl">{realmEmoji}</span>
              </div>
              <div>
                <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 ${badgeBg}`}>
                  {lvl.grade || groupTheme.toUpperCase()}
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {lvl.name}
                </h3>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-4">
            {lvl.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectLevel(lvl)}
          className={`w-full py-3 px-4 rounded-2xl btn-game-3d ${btnStyle} text-xs font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer transition`}
        >
          <span>MEMASUKI PORTAL {lvl.name.toUpperCase()}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {onBack && (
        <div className="mb-6">
          <button
            id="level-selection-back-btn"
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-game-3d btn-game-sky text-white font-black text-xs cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Stasiun Keberangkatan</span>
          </button>
        </div>
      )}

      {/* Header Portal Title */}
      <div className="text-center mb-8 bg-gradient-to-r from-teal-800 via-emerald-700 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-white relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-2 border border-white/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>AL-KARIM QUEST WORLD MAP</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
          PILIH PORTAL PULAU BELAJAR
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-emerald-100 font-medium max-w-xl mx-auto">
          Silakan pilih pulau jenjang kelas kamu untuk membuka misi quest pembelajaran &amp; kuis evaluasi.
        </p>
      </div>

      {/* 1. TK Candy Land Portal */}
      <div className="mb-8 p-5 rounded-3xl bg-realm-tk border-4 border-pink-200 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🌸</span>
          <h3 className="text-base sm:text-lg font-black text-pink-950 tracking-tight">
            ALAM 1: TK CANDY PLAYLAND
          </h3>
          <span className="text-xs text-pink-900 bg-pink-200/80 border border-pink-300 px-3 py-0.5 rounded-full font-black ml-auto">
            TK A &amp; TK B
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tkLevels.map((lvl) => renderLevelCard(lvl, 'tk'))}
        </div>
      </div>

      {/* 2. SD Jungle Explorer Portal */}
      <div className="mb-8 p-5 rounded-3xl bg-realm-sd border-4 border-emerald-200 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🌴</span>
          <h3 className="text-base sm:text-lg font-black text-emerald-950 tracking-tight">
            ALAM 2: SD NATURE JUNGLE
          </h3>
          <span className="text-xs text-emerald-900 bg-emerald-200/80 border border-emerald-300 px-3 py-0.5 rounded-full font-black ml-auto">
            Kelas 1 s/d 6
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sdLevels.map((lvl) => renderLevelCard(lvl, 'sd'))}
        </div>
      </div>

      {/* 3. SMP Sky Island Portal */}
      <div className="mb-8 p-5 rounded-3xl bg-realm-smp border-4 border-sky-200 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏔️</span>
          <h3 className="text-base sm:text-lg font-black text-sky-950 tracking-tight">
            ALAM 3: SMP SKY ADVENTURE
          </h3>
          <span className="text-xs text-sky-900 bg-sky-200/80 border border-sky-300 px-3 py-0.5 rounded-full font-black ml-auto">
            Kelas 7, 8, 9
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {smpLevels.map((lvl) => renderLevelCard(lvl, 'smp'))}
        </div>
      </div>

      {/* 4. SMA Star Castle Portal */}
      <div className="p-5 rounded-3xl bg-realm-sma border-4 border-purple-200 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏰</span>
          <h3 className="text-base sm:text-lg font-black text-purple-950 tracking-tight">
            ALAM 4: SMA STAR MASTERY CASTLE
          </h3>
          <span className="text-xs text-purple-900 bg-purple-200/80 border border-purple-300 px-3 py-0.5 rounded-full font-black ml-auto">
            Kelas 10, 11, 12
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {smaLevels.map((lvl) => renderLevelCard(lvl, 'sma'))}
        </div>
      </div>
    </div>
  );
};
