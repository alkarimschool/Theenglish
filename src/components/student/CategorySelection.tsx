import React from 'react';
import { Category, Level, Topic, StudentAttempt } from '../../types';
import { getJenjangTheme } from '../../utils/theme';
import {
  MessageSquare,
  Layers,
  Users,
  Mic,
  FileText,
  ArrowRight,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  User,
  GraduationCap,
  Trophy,
  Play,
  RotateCcw,
  Home,
} from 'lucide-react';

interface Props {
  level: Level;
  categories: Category[];
  topics: Topic[];
  attempts: StudentAttempt[];
  studentName?: string;
  className?: string;
  onSelectCategory: (category: Category) => void;
  onBack: () => void;
  onChangeStudent?: () => void;
}

export const CategorySelection: React.FC<Props> = ({
  level,
  categories,
  topics,
  attempts,
  studentName = 'Siswa Al-Karim',
  className = '-',
  onSelectCategory,
  onBack,
  onChangeStudent,
}) => {
  const theme = getJenjangTheme(level);

  const isSmpOrSma =
    level.schoolType === 'SMP' ||
    level.schoolType === 'SMA' ||
    level.id.startsWith('smp-') ||
    level.id.startsWith('sma-');

  // Strict rule: Grammar is ONLY for SMP & SMA. Never for TK or SD.
  const visibleCategories = categories.filter((cat) => {
    if (cat.id === 'grammar') {
      return isSmpOrSma;
    }
    return true;
  });

  // Standard category description overrides matching specification
  const getCategoryMeta = (catId: string, defaultDesc: string) => {
    switch (catId) {
      case 'expression':
        return {
          title: 'EXPRESSION',
          description: 'Learn expressions for daily communication',
        };
      case 'vocabulary':
        return {
          title: 'VOCABULARY',
          description: 'Build your English vocabulary',
        };
      case 'dialogue':
        return {
          title: 'DIALOGUE',
          description: 'Practice everyday conversations',
        };
      case 'speech':
        return {
          title: 'SPEECH',
          description: 'Improve your speaking skills',
        };
      case 'grammar':
        return {
          title: 'GRAMMAR',
          description: 'Improve your English grammar',
        };
      default:
        return {
          title: catId.toUpperCase(),
          description: defaultDesc,
        };
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'Mic':
        return <Mic className="w-5 h-5" />;
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  // Progress for specific category
  const getCategoryProgress = (categoryId: string) => {
    const categoryTopics = topics.filter(
      (t) => t.categoryId === categoryId && t.levelId === level.id && t.isPublished !== false
    );
    if (categoryTopics.length === 0) {
      return { total: 0, completed: 0, percentage: 0, lastScore: null, avgScore: null };
    }

    const catAttempts = attempts.filter(
      (a) => a.categoryId === categoryId && a.levelId === level.id
    );

    const completedTopicIds = new Set(catAttempts.map((a) => a.topicId));
    const completed = completedTopicIds.size;
    const percentage = Math.min(100, Math.round((completed / categoryTopics.length) * 100));

    // Get last score
    let lastScore: number | null = null;
    let avgScore: number | null = null;
    if (catAttempts.length > 0) {
      const sorted = [...catAttempts].sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
      lastScore = sorted[0].score;
      const totalScore = catAttempts.reduce((acc, curr) => acc + curr.score, 0);
      avgScore = Math.round(totalScore / catAttempts.length);
    }

    return {
      total: categoryTopics.length,
      completed,
      percentage,
      lastScore,
      avgScore,
    };
  };

  // Overall Level Progress
  const levelTopics = topics.filter((t) => t.levelId === level.id && t.isPublished !== false);
  const completedLevelTopicIds = new Set(
    attempts.filter((a) => a.levelId === level.id).map((a) => a.topicId)
  );
  const overallPercentage =
    levelTopics.length > 0
      ? Math.min(100, Math.round((completedLevelTopicIds.size / levelTopics.length) * 100))
      : 0;

  // Category specific color theme mappings
  const getCategoryColorStyles = (catId: string) => {
    switch (catId) {
      case 'expression':
        return {
          cardBorder: 'border-sky-200 hover:border-sky-400',
          avatarBg: 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-md shadow-sky-500/20',
          badgeText: 'text-sky-700 bg-sky-50 border-sky-200',
          btnStyle: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-sky-600/25',
          progressColor: 'text-sky-700',
        };
      case 'vocabulary':
        return {
          cardBorder: 'border-amber-200 hover:border-amber-400',
          avatarBg: 'bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-md shadow-amber-500/20',
          badgeText: 'text-amber-800 bg-amber-50 border-amber-200',
          btnStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25',
          progressColor: 'text-amber-800',
        };
      case 'dialogue':
        return {
          cardBorder: 'border-emerald-200 hover:border-emerald-400',
          avatarBg: 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-md shadow-emerald-500/20',
          badgeText: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          btnStyle: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/25',
          progressColor: 'text-emerald-800',
        };
      case 'speech':
        return {
          cardBorder: 'border-purple-200 hover:border-purple-400',
          avatarBg: 'bg-gradient-to-br from-purple-400 to-pink-600 text-white shadow-md shadow-purple-500/20',
          badgeText: 'text-purple-800 bg-purple-50 border-purple-200',
          btnStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-600/25',
          progressColor: 'text-purple-800',
        };
      case 'grammar':
        return {
          cardBorder: 'border-indigo-200 hover:border-indigo-400',
          avatarBg: 'bg-gradient-to-br from-indigo-500 to-blue-700 text-white shadow-md shadow-indigo-500/20',
          badgeText: 'text-indigo-800 bg-indigo-50 border-indigo-200',
          btnStyle: 'bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white shadow-indigo-600/25',
          progressColor: 'text-indigo-800',
        };
      default:
        return {
          cardBorder: 'border-emerald-200 hover:border-emerald-400',
          avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20',
          badgeText: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          btnStyle: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/25',
          progressColor: 'text-emerald-800',
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header Level Dashboard Card with Vibrant Colorful Gradient Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${theme.headerGradient} text-white shadow-xl relative overflow-hidden mb-8 border border-white/10`}>
        {/* Decorative background glow circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-black tracking-wider uppercase mb-2 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{level.name.toUpperCase()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 tracking-tight">
              <span>Halo, {studentName}</span>
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-sm font-semibold text-emerald-100/90 mt-1 flex items-center gap-2">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-white font-bold">Kelas {className}</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-200">{level.grade}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="category-back-btn"
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl transition cursor-pointer backdrop-blur-md"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>
            {onChangeStudent && (
              <button
                id="change-student-btn"
                type="button"
                onClick={onChangeStudent}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 rounded-xl transition cursor-pointer"
                title="Ganti Nama atau Kelas Siswa"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ganti Siswa</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Pembelajaran Section */}
        <div className="pt-6 relative z-10">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-100">
                Progress Pembelajaran
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-200 font-medium">
                {completedLevelTopicIds.size} dari {levelTopics.length} Topic Selesai
              </span>
              <span className="text-base font-black text-amber-300">
                {overallPercentage}%
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-black/25 rounded-full h-3.5 overflow-hidden p-0.5 border border-white/15 backdrop-blur-xs">
            <div
              className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Learning Categories Section Title */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-wider">
            PILIH KATEGORI MATERI:
          </h2>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
            Pilih kategori di bawah untuk membaca materi ringkas dan berlatih 30 soal.
          </p>
        </div>
      </div>

      {/* Categories Grid with Colorful Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleCategories.map((cat, idx) => {
          const prog = getCategoryProgress(cat.id);
          const meta = getCategoryMeta(cat.id, cat.description);
          const hasAttempted = prog.completed > 0 || prog.lastScore !== null;
          const catStyle = getCategoryColorStyles(cat.id);

          return (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              className={`bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border-2 ${catStyle.cardBorder} shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-13 h-13 rounded-2xl ${catStyle.avatarBg} flex items-center justify-center font-bold`}
                    >
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${catStyle.badgeText}`}>
                        CATEGORY {idx + 1}
                      </span>
                      <h3 className="text-lg font-black text-gray-950 mt-0.5">
                        {meta.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {meta.description}
                </p>
              </div>

              {/* Progress & START Action */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Category Progress Stats */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-gray-500">Progress:</span>
                    <span className={`font-black ${hasAttempted ? catStyle.progressColor : 'text-gray-400'}`}>
                      {prog.percentage}%
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      ({prog.completed}/{prog.total} Topic)
                    </span>
                  </div>

                  {hasAttempted && prog.lastScore !== null && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                      <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Nilai Terakhir: <strong>{prog.lastScore}</strong>/100</span>
                    </div>
                  )}

                  {!hasAttempted && (
                    <div className="text-[11px] text-gray-400 font-medium">
                      Belum pernah dikerjakan (0%)
                    </div>
                  )}
                </div>

                {/* Mulai Belajar Button */}
                <button
                  id={`start-cat-btn-${cat.id}`}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl ${catStyle.btnStyle} font-extrabold text-xs tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95 self-stretch sm:self-auto`}
                >
                  <span>Mulai Belajar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

