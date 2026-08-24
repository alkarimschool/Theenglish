import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { StudentAttempt, Question, Topic, Level, Category } from '../../types';
import { getJenjangTheme } from '../../utils/theme';
import { TextToSpeechButton } from '../common/TextToSpeechButton';
import {
  Trophy,
  CheckCircle,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';

interface Props {
  attempt: StudentAttempt;
  questions: Question[];
  topic: Topic;
  level: Level;
  category: Category;
  onStudyAgain: () => void; // back to learning stage
  onRetakeExercise: () => void; // retake quiz
  onBackToTopicList: () => void;
  onBackToLevelPage?: () => void;
}

export const ResultStage: React.FC<Props> = ({
  attempt,
  questions,
  topic,
  level,
  category,
  onStudyAgain,
  onRetakeExercise,
  onBackToTopicList,
  onBackToLevelPage,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  const theme = getJenjangTheme(level);

  useEffect(() => {
    if (attempt.score >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10B981', '#34D399', '#FBBF24', '#3B82F6', '#EC4899'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [attempt.score]);

  const scoreColor =
    attempt.score >= 85
      ? theme.bannerGradient
      : attempt.score >= 70
      ? 'from-amber-600 to-emerald-600'
      : 'from-rose-600 to-amber-600';

  const filteredQuestions = questions.filter((q) => {
    const studentAns = attempt.answers[q.id];
    const isCorrect = studentAns && studentAns.toUpperCase() === q.correctAnswer.toUpperCase();
    if (filterMode === 'incorrect') return !isCorrect;
    if (filterMode === 'correct') return isCorrect;
    return true;
  });

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10`}>
      {/* Top Header Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100/90 shadow-xl text-center relative overflow-hidden mb-8">
        {/* Top color accent strip */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${theme.bannerGradient}`} />

        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText} text-xs font-black mb-3 border ${theme.borderColor} mt-2`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>HASIL EVALUASI PEMBELAJARAN ({theme.tierName})</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight">
          {attempt.score >= 85 ? 'Barakallahu Fiik! Luar Biasa! 🎉' : attempt.score >= 70 ? 'Alhamdulillah, Kerja Bagus! ⭐' : 'Terus Semangat Belajar! 💪'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
          Berikut adalah rincian capaian pembelajaran Bahasa Inggris kamu.
        </p>

        {/* Student Info Card & Big Score Circle */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Left: Metadata */}
          <div className="text-left bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/70 space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-semibold">Nama Siswa:</span>
              <strong className="text-gray-950 font-black">{attempt.studentName}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-semibold">Kelas:</span>
              <strong className="text-gray-950 font-black">{attempt.className}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-semibold">Level:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${theme.badgeBg} ${theme.badgeText} border border-emerald-200`}>
                {level.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-semibold">Category:</span>
              <span className="font-bold text-gray-900">{category.name}</span>
            </div>
            <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between">
              <span className="text-gray-600 font-semibold">Topic:</span>
              <span className={`font-black ${theme.textDark} text-right line-clamp-1`}>{topic.title}</span>
            </div>
          </div>

          {/* Center: Score Circle */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br ${scoreColor} text-white shadow-xl shadow-emerald-900/20 flex flex-col items-center justify-center p-3 relative ring-4 ring-white border-2 border-white/40`}
            >
              <span className="text-[11px] uppercase tracking-widest font-black text-white/90">SCORE</span>
              <span className="text-4xl sm:text-5xl font-black tracking-tight">{attempt.score}</span>
              <span className="text-[10px] text-white/90 font-black">{attempt.percentage}% Nilai</span>
            </div>
          </div>

          {/* Right: Accuracy Breakdown */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1.5 font-bold shadow-xs">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-950">
                {attempt.correctCount} <span className="text-xs font-bold text-gray-500">/ {attempt.totalQuestions}</span>
              </div>
              <div className="text-[11px] font-black text-emerald-800 uppercase tracking-wide">Jawaban Benar</div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto mb-1.5 font-bold shadow-xs">
                <XCircle className="w-4 h-4" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-rose-950">
                {attempt.incorrectCount} <span className="text-xs font-bold text-gray-500">/ {attempt.totalQuestions}</span>
              </div>
              <div className="text-[11px] font-black text-rose-800 uppercase tracking-wide">Jawaban Salah</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-3">
          <button
            id="result-study-again-btn"
            type="button"
            onClick={onStudyAgain}
            className={`px-4 py-2.5 rounded-xl ${theme.bgLight} ${theme.textDark} border ${theme.borderColor} text-xs font-bold flex items-center gap-2 cursor-pointer transition`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Pelajari Lagi (Materi)</span>
          </button>

          <button
            id="result-retake-btn"
            type="button"
            onClick={onRetakeExercise}
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition"
          >
            <RotateCcw className="w-4 h-4 text-amber-700" />
            <span>Kerjakan Lagi ({attempt.totalQuestions} Soal)</span>
          </button>

          <button
            id="result-back-topics-btn"
            type="button"
            onClick={onBackToTopicList}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Daftar Topic {category.name}</span>
          </button>

          {onBackToLevelPage && (
            <button
              id="result-back-level-btn"
              type="button"
              onClick={onBackToLevelPage}
              className={`px-5 py-2.5 rounded-xl ${theme.btnPrimary} text-xs font-extrabold shadow-md flex items-center gap-2 cursor-pointer transition`}
            >
              <span>Halaman {level.name}</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          )}
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pembahasan Soal & Kunci Jawaban</h2>
            <p className="text-xs text-gray-500">
              Pelajari pembahasan di setiap nomor untuk memperdalam pemahaman tata bahasa dan kosakata.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Semua ({questions.length})
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterMode === 'incorrect' ? 'bg-white text-rose-700 shadow-xs' : 'text-gray-500 hover:text-rose-700'
              }`}
            >
              Salah Saja ({attempt.incorrectCount})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterMode === 'correct' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-500 hover:text-emerald-700'
              }`}
            >
              Benar Saja ({attempt.correctCount})
            </button>
          </div>
        </div>

        {/* Question Review Cards */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const studentAns = attempt.answers[q.id];
            const isCorrect = studentAns && studentAns.toUpperCase() === q.correctAnswer.toUpperCase();
            const isExpanded = expandedQId === q.id || filterMode === 'incorrect';

            return (
              <div
                key={q.id}
                id={`review-q-${q.id}`}
                className={`rounded-2xl border transition-all ${
                  isCorrect ? 'border-emerald-200/80 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div
                  onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-50/60 rounded-2xl transition"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {q.questionNumber || idx + 1}
                    </span>

                    <div>
                      <div className="text-sm font-bold text-gray-900 leading-snug">{q.questionText}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                        <span className="text-gray-600 font-medium">
                          Jawaban Kamu:{' '}
                          <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                            {studentAns ? `Opsi ${studentAns}` : '(Tidak Dijawab)'}
                          </strong>
                        </span>
                        {!isCorrect && (
                          <span className="text-emerald-800 font-bold">
                            Kunci Benar: Opsi {q.correctAnswer}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <TextToSpeechButton text={q.questionText} size="sm" />
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details: Options & Explanation */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100/80 text-xs sm:text-sm space-y-3">
                    {/* All 4 Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
                      {[
                        { key: 'A' as const, text: q.optionA },
                        { key: 'B' as const, text: q.optionB },
                        { key: 'C' as const, text: q.optionC },
                        { key: 'D' as const, text: q.optionD },
                      ].map(({ key, text }) => {
                        const isStudentChoice = studentAns === key;
                        const isKeyAnswer = q.correctAnswer === key;
                        return (
                          <div
                            key={key}
                            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                              isKeyAnswer
                                ? 'bg-emerald-100/80 border-emerald-300 text-emerald-950 font-bold'
                                : isStudentChoice && !isCorrect
                                ? 'bg-rose-100/80 border-rose-300 text-rose-950 line-through font-semibold'
                                : 'bg-white border-gray-200 text-gray-700'
                            }`}
                          >
                            <span className="font-extrabold">{key}.</span>
                            <span>{text}</span>
                            {isKeyAnswer && <span className="ml-auto text-[10px] text-emerald-700">✓ Kunci</span>}
                            {isStudentChoice && !isCorrect && <span className="ml-auto text-[10px] text-rose-700">✗ Pilihanmu</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {q.explanation && (
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                        <strong className="block font-bold text-amber-900 mb-0.5">💡 Pembahasan:</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
