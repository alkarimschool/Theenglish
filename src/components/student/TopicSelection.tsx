import React from 'react';
import { Level, Category, Topic, StudentAttempt } from '../../types';
import { getJenjangTheme } from '../../utils/theme';
import { BookOpen, CheckCircle, HelpCircle, ArrowRight, Sparkles, Lock, AlertCircle } from 'lucide-react';

interface Props {
  level: Level;
  category: Category;
  topics: Topic[];
  attempts: StudentAttempt[];
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void;
}

export const TopicSelection: React.FC<Props> = ({
  level,
  category,
  topics,
  attempts,
  onSelectTopic,
  onBack,
}) => {
  const theme = getJenjangTheme(level);

  const getTopicAttempt = (topicId: string) => {
    const topicAttempts = attempts.filter((a) => a.topicId === topicId);
    if (topicAttempts.length === 0) return null;
    return topicAttempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Colorful Header Banner */}
      <div className={`rounded-3xl p-6 sm:p-8 bg-gradient-to-r ${theme.bannerGradient} text-white shadow-lg mb-6 relative overflow-hidden`}>
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/15 blur-xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-black uppercase border border-white/25">
                {level.name}
              </span>
              <span className="text-white/60">/</span>
              <span className="px-3 py-1 rounded-full bg-white text-gray-900 font-extrabold uppercase shadow-xs">
                {category.name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Daftar Topic {category.name}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-white/90 font-medium max-w-xl">
              Pilih topic untuk mempelajari ringkasan materi & audio pelafalan, lalu selesaikan latihan soal.
            </p>
          </div>

          <button
            id="topic-back-btn"
            onClick={onBack}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md rounded-xl transition cursor-pointer shadow-xs"
          >
            <span>← Halaman {level.name}</span>
          </button>
        </div>
      </div>

      {/* Topic List */}
      {topics.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white/90 backdrop-blur-md rounded-3xl border-2 border-dashed border-emerald-200 shadow-sm">
          <BookOpen className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">Belum Ada Topic untuk Kategori Ini</h3>
          <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
            Guru pengampu {level.name} sedang menyusun materi dan bank soal. Silakan pilih kategori atau level lain.
          </p>
          <button
            onClick={onBack}
            className={`mt-4 px-5 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md ${theme.btnPrimary}`}
          >
            Kembali ke Kategori
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((topic, idx) => {
            const attempt = getTopicAttempt(topic.id);
            const isCompleted = Boolean(attempt);
            const isLocked = Boolean(topic.isLocked);

            return (
              <div
                key={topic.id}
                id={`topic-item-${topic.id}`}
                className={`bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-6 border-2 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                  isLocked
                    ? 'border-amber-200/80 bg-amber-50/20'
                    : `border-emerald-100/90 ${theme.borderHover} hover:shadow-lg hover:-translate-y-0.5`
                }`}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold ${theme.badgeBg} ${theme.badgeText} border border-emerald-200/60`}>
                      Topic #{idx + 1}
                    </span>
                    {topic.theme && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {topic.theme}
                      </span>
                    )}

                    {/* Lock Status Badge */}
                    {isLocked && (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Terkunci oleh Guru</span>
                      </span>
                    )}

                    {isCompleted && !isLocked && (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Nilai: {attempt.score} / 100</span>
                      </span>
                    )}
                  </div>

                  <h3 className={`text-lg font-black mb-1 ${isLocked ? 'text-gray-700' : 'text-gray-950'}`}>
                    {topic.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">{topic.description}</p>

                  {/* Teacher Lock Announcement Note */}
                  {isLocked && (
                    <div className="mt-3 p-3 rounded-2xl bg-amber-100/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 max-w-xl">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-bold text-[11px]">Topic ini sedang dikunci oleh guru.</p>
                        <p className="text-[11px] text-amber-800">
                          {topic.lockMessage || 'Silakan selesaikan topik sebelumnya atau tunggu arahan guru di kelas.'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] text-gray-600 font-medium">
                    <span className={`flex items-center gap-1 font-bold ${isLocked ? 'text-gray-500' : theme.textAccent}`}>
                      <HelpCircle className="w-3.5 h-3.5" />
                      {topic.questionCount || 30} Soal Latihan
                    </span>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <span>📖 Materi & Kosakata</span>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <span>✍️ Latihan Soal</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {isLocked ? (
                    <button
                      id={`locked-topic-btn-${topic.id}`}
                      type="button"
                      disabled
                      className="px-5 py-3 rounded-2xl bg-gray-100 text-gray-400 border border-gray-200 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-not-allowed shadow-none"
                      title="Topic ini dikunci oleh guru"
                    >
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span>Terkunci</span>
                    </button>
                  ) : (
                    <button
                      id={`start-topic-btn-${topic.id}`}
                      type="button"
                      onClick={() => onSelectTopic(topic)}
                      className={`px-5 py-3 rounded-2xl ${theme.btnPrimary} font-black text-xs sm:text-sm tracking-wide shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95`}
                    >
                      <span>{isCompleted ? 'Pelajari Ulang' : 'Mulai Belajar'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
