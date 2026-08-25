import React, { useState, useEffect } from 'react';
import { Question, Topic, Level, Category } from '../../types';
import { getJenjangTheme } from '../../utils/theme';
import { TextToSpeechButton } from '../common/TextToSpeechButton';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Clock,
  Send,
  Sparkles,
  LayoutGrid,
  X,
  Volume2,
} from 'lucide-react';

interface Props {
  topic: Topic;
  level: Level;
  category: Category;
  questions: Question[];
  studentName: string;
  className: string;
  onFinishExercise: (answers: Record<string, 'A' | 'B' | 'C' | 'D'>, timeElapsedSec: number) => void;
  onExitExercise: () => void;
}

export const ExerciseStage: React.FC<Props> = ({
  topic,
  level,
  category,
  questions,
  studentName,
  className,
  onFinishExercise,
  onExitExercise,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [showGridDrawer, setShowGridDrawer] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const theme = getJenjangTheme(level);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const total = questions.length;
  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: opt,
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    onFinishExercise(answers, secondsElapsed);
  };

  if (!currentQ || total === 0) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white rounded-3xl mt-12 border">
        <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-base font-bold">Belum Ada Soal</h3>
        <p className="text-xs text-gray-500 mt-1">Topic ini belum memiliki bank soal latihan.</p>
        <button onClick={onExitExercise} className={`mt-4 px-4 py-2 text-white rounded-xl text-xs font-bold ${theme.btnPrimary}`}>
          Kembali
        </button>
      </div>
    );
  }

  const selectedAnswer = answers[currentQ.id];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Top Exercise Header Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b-2 border-emerald-100/90 sticky top-16 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="exit-exercise-btn"
              type="button"
              onClick={onExitExercise}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-emerald-50 rounded-xl transition"
              title="Keluar dari latihan"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className={`text-[11px] font-black uppercase tracking-wider ${theme.textAccent}`}>
                {level.name} • {category.name}
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-gray-900 line-clamp-1">
                {topic.title}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs font-black shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{formatTime(secondsElapsed)}</span>
            </div>

            {/* Question Matrix Toggle */}
            <button
              id="open-question-matrix-btn"
              type="button"
              onClick={() => setShowGridDrawer(!showGridDrawer)}
              className={`px-3 py-1.5 rounded-xl ${theme.bgLight} ${theme.textDark} border ${theme.borderColor} text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-2xs`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Navigasi ({answeredCount}/{total})</span>
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-emerald-100/60 h-2 overflow-hidden">
          <div
            className={`${theme.progressBarColor} h-2 transition-all duration-300 shadow-sm`}
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Single-Question Card Area */}
      <main className="max-w-3xl mx-auto w-full px-4 py-6 sm:py-8 flex-1 flex flex-col justify-center relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100/90 shadow-xl shadow-emerald-950/5 relative overflow-hidden">
          {/* Top color accent strip */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.bannerGradient}`} />

          {/* Question Meta & Number Per Jenjang */}
          <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-gray-100 mt-1">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black ${theme.badgeBg} ${theme.badgeText} border ${theme.borderColor} shadow-2xs`}>
              <span className="text-base">{theme.mascotEmoji}</span>
              <span>{theme.questionPrefix} {currentIndex + 1} OF {total}</span>
            </span>

            <div className="flex items-center gap-2">
              <TextToSpeechButton text={currentQ.questionText} label="Listen" size="sm" />
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                {answeredCount}/{total} Terjawab
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-black text-slate-900 leading-relaxed mb-6">
            {currentQ.questionText}
          </div>

          {/* Options A, B, C, D */}
          <div className="space-y-3">
            {[
              { key: 'A' as const, label: currentQ.optionA },
              { key: 'B' as const, label: currentQ.optionB },
              { key: 'C' as const, label: currentQ.optionC },
              { key: 'D' as const, label: currentQ.optionD },
            ].map(({ key, label }) => {
              const isSelected = selectedAnswer === key;
              return (
                <button
                  key={key}
                  id={`option-${key}-btn`}
                  type="button"
                  onClick={() => handleSelectOption(key)}
                  className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border-2 transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer ${
                    isSelected
                      ? `${theme.activeOptionBg} ${theme.activeOptionBorder} shadow-md`
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1">
                    <span
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 transition-colors shadow-2xs ${
                        isSelected
                          ? `${theme.bgActive} text-white`
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {key}
                    </span>
                    <span className="text-sm sm:text-base font-black text-slate-900 leading-snug">{label}</span>
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{theme.tier === 'TK' ? 'Jawaban Kamu! ⭐' : 'Selected'}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Sticky Navigation Actions */}
      <footer className="bg-white border-t border-gray-200 sticky bottom-0 z-30 p-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            id="exercise-prev-btn"
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 sm:px-5 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          <div className="text-center">
            <span className="text-xs font-bold text-gray-500">
              {currentIndex + 1} / {total}
            </span>
          </div>

          {currentIndex === total - 1 ? (
            <button
              id="exercise-finish-btn"
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="px-6 py-3 rounded-2xl btn-game-3d btn-game-amber text-amber-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition"
            >
              <Send className="w-4 h-4 text-amber-950" />
              <span>🚀 SELESAI &amp; KIRIM QUEST</span>
            </button>
          ) : (
            <button
              id="exercise-next-btn"
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl btn-game-3d btn-game-emerald text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition"
            >
              <span>SOAL SELANJUTNYA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>

      {/* Question Grid Matrix Modal Drawer */}
      {showGridDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-xl max-h-[80vh] rounded-t-3xl sm:rounded-3xl p-6 overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Daftar Nomor Soal (1 — {total})</h3>
                <p className="text-xs text-gray-500">
                  {answeredCount} dari {total} soal sudah kamu jawab ({progressPercent}%)
                </p>
              </div>
              <button
                onClick={() => setShowGridDrawer(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of questions */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 my-4">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = Boolean(answers[q.id]);
                return (
                  <button
                    key={q.id}
                    id={`matrix-q-${idx + 1}`}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowGridDrawer(false);
                    }}
                    className={`h-11 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition cursor-pointer ${
                      isCurrent
                        ? `${theme.bgActive} text-white ring-2 ${theme.ringColor}`
                        : isAnswered
                        ? `${theme.badgeBg} ${theme.badgeText} font-extrabold border ${theme.borderColor}`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isAnswered && <span className="text-[9px]">{answers[q.id]}</span>}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded ${theme.badgeBg} border ${theme.borderColor}`} />
                  <span className="text-gray-600">Sudah</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gray-100" />
                  <span className="text-gray-600">Belum</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowGridDrawer(false);
                  setShowConfirmModal(true);
                }}
                className={`px-4 py-2 ${theme.btnPrimary} text-xs font-bold rounded-xl`}
              >
                Submit Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in duration-200">
            <div className={`w-14 h-14 rounded-2xl ${theme.badgeBg} ${theme.badgeText} flex items-center justify-center mx-auto mb-4 font-bold`}>
              <CheckCircle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-gray-900">Kirim Jawaban Latihan?</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              Kamu telah menjawab <strong className={theme.textDark}>{answeredCount}</strong> dari{' '}
              <strong>{total}</strong> soal.
              {answeredCount < total && (
                <span className="block mt-1 text-amber-600 font-semibold">
                  ⚠️ Perhatian: Ada {total - answeredCount} soal yang belum dijawab.
                </span>
              )}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-bold cursor-pointer transition"
              >
                Periksa Lagi
              </button>
              <button
                id="modal-confirm-submit-btn"
                type="button"
                onClick={handleConfirmSubmit}
                className={`w-full py-3 rounded-xl ${theme.btnPrimary} text-xs sm:text-sm font-bold shadow-md cursor-pointer transition`}
              >
                Ya, Kirim Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
