import React, { useState } from 'react';
import { Topic, LearningMaterial, Level, Category } from '../../types';
import { getJenjangTheme } from '../../utils/theme';
import { TextToSpeechButton } from '../common/TextToSpeechButton';
import {
  BookOpen,
  Volume2,
  MessageCircle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
} from 'lucide-react';

interface Props {
  topic: Topic;
  material: LearningMaterial;
  level: Level;
  category: Category;
  questionCount: number;
  onStartExercise: () => void;
  onBackToTopics: () => void;
}

export const LearningStage: React.FC<Props> = ({
  topic,
  material,
  level,
  category,
  questionCount,
  onStartExercise,
  onBackToTopics,
}) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'vocab' | 'dialogue' | 'tips'>('explanation');
  const theme = getJenjangTheme(level);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
        <button
          id="learning-back-topics-btn"
          onClick={onBackToTopics}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Topic</span>
        </button>

        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText} text-xs font-extrabold border ${theme.borderColor}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>TAHAP 1 — MATERI PEMBELAJARAN ({theme.tier})</span>
        </div>
      </div>

      {/* Header Topic Title with Dynamic Jenjang Gradient */}
      <div className={`bg-gradient-to-br ${theme.bannerGradient} text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6 relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-xs">
              {level.name}
            </span>
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-black/20 text-white backdrop-blur-xs">
              {category.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white text-gray-900 shadow-xs">
              {theme.tierName}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">{topic.title}</h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
            {material.summary || topic.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-xs text-white/80">
              <BookOpen className="w-4 h-4" />
              <span>Pelajari materi di bawah ini dengan seksama sebelum mengerjakan latihan.</span>
            </div>

            <button
              id="start-exercise-top-btn"
              onClick={onStartExercise}
              className="px-5 py-2.5 rounded-xl bg-white text-gray-900 hover:bg-gray-50 font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Mulai Latihan ({questionCount} Soal)</span>
              <ArrowRight className="w-4 h-4 text-gray-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl mb-6 overflow-x-auto border-2 border-emerald-100/80 shadow-xs">
        <button
          id="tab-explanation-btn"
          type="button"
          onClick={() => setActiveTab('explanation')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'explanation'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Penjelasan</span>
        </button>

        <button
          id="tab-vocab-btn"
          type="button"
          onClick={() => setActiveTab('vocab')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'vocab'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
              : 'text-gray-600 hover:text-amber-800 hover:bg-amber-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Vocabulary ({material.vocabularyList?.length || 0})</span>
        </button>

        <button
          id="tab-dialogue-btn"
          type="button"
          onClick={() => setActiveTab('dialogue')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'dialogue'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
              : 'text-gray-600 hover:text-blue-800 hover:bg-sky-50'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Dialogue Sample</span>
        </button>

        <button
          id="tab-tips-btn"
          type="button"
          onClick={() => setActiveTab('tips')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'tips'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
              : 'text-gray-600 hover:text-purple-800 hover:bg-purple-50'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Tips & Rumus</span>
        </button>
      </div>

      {/* Tab Content Cards */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-emerald-100/90 shadow-md mb-8">
        {/* TAB 1: PENJELASAN */}
        {activeTab === 'explanation' && (
          <div className="space-y-6">
            {material.imageUrl && (
              <div className="rounded-2xl overflow-hidden mb-6 border border-gray-100 max-h-72">
                <img
                  src={material.imageUrl}
                  alt={topic.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="prose max-w-none text-gray-800 leading-relaxed text-sm sm:text-base space-y-4">
              {material.contentMarkdown.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} className={`text-lg font-bold ${theme.textDark} mt-4 mb-2 pb-1 border-b ${theme.borderColor}`}>
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('#### ')) {
                  return (
                    <h4 key={pIdx} className="text-base font-bold text-gray-900 mt-3 mb-1">
                      {paragraph.replace('#### ', '')}
                    </h4>
                  );
                }
                if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                  return (
                    <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
                      {paragraph.split('\n').map((li, liIdx) => (
                        <li key={liIdx}>{li.replace(/^[\*\-]\s*/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.startsWith('---')) {
                  return <hr key={pIdx} className="border-gray-200 my-4" />;
                }
                return (
                  <p key={pIdx} className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Pronunciation speech block */}
            <div className={`mt-6 p-4 rounded-2xl ${theme.bgLight} border ${theme.borderColor} flex items-center justify-between gap-4`}>
              <div>
                <div className={`text-xs font-bold ${theme.textDark}`}>Audio Pronunciation Support</div>
                <div className="text-[11px] text-gray-600">
                  Dengarkan aksen penutur asli untuk melatih pendengaran (listening) dan pengucapan (speaking).
                </div>
              </div>
              <TextToSpeechButton text={topic.title} label="Listen Topic" size="md" />
            </div>
          </div>
        )}

        {/* TAB 2: VOCABULARY */}
        {activeTab === 'vocab' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Daftar Kosakata Utama (Vocabulary)</h3>
              <span className="text-xs text-gray-500 font-medium">Klik tombol audio untuk mendengar pronunciation</span>
            </div>

            {(!material.vocabularyList || material.vocabularyList.length === 0) ? (
              <div className="text-center py-8 text-xs text-gray-500">Belum ada daftar kosakata tambahan untuk topic ini.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {material.vocabularyList.map((v) => (
                  <div
                    key={v.id}
                    className={`p-4 rounded-2xl border border-gray-200 bg-gray-50/50 ${theme.cardBgHover} ${theme.borderHover} transition-all flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <span className={`text-base font-bold ${theme.textDark}`}>{v.word}</span>
                          {v.phonetic && (
                            <span className="text-xs text-gray-500 ml-2 font-mono">{v.phonetic}</span>
                          )}
                        </div>
                        <TextToSpeechButton text={v.word} size="sm" />
                      </div>

                      {v.partOfSpeech && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 mb-2">
                          {v.partOfSpeech}
                        </span>
                      )}

                      <div className="text-xs font-semibold text-gray-800 mb-2">
                        Arti: <span className="font-normal text-gray-700">{v.meaning}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200/60 mt-2">
                      <div className="text-xs text-gray-700 italic flex items-center justify-between gap-2">
                        <span>"{v.example}"</span>
                        <TextToSpeechButton text={v.example} size="sm" />
                      </div>
                      {v.exampleTranslation && (
                        <div className="text-[11px] text-gray-500 mt-1">({v.exampleTranslation})</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DIALOGUE SAMPLE */}
        {activeTab === 'dialogue' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Contoh Percakapan (Dialogue Simulation)</h3>
              <span className="text-xs text-gray-500">Percakapan situasi nyata</span>
            </div>

            {(!material.dialogueSamples || material.dialogueSamples.length === 0) ? (
              <div className="text-center py-8 text-xs text-gray-500">Belum ada contoh percakapan untuk topic ini.</div>
            ) : (
              <div className="space-y-3">
                {material.dialogueSamples.map((turn, tIdx) => {
                  const isFirstSpeaker = tIdx % 2 === 0;
                  return (
                    <div
                      key={turn.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isFirstSpeaker
                          ? `${theme.bgLight} ${theme.borderColor} ml-0 mr-4 sm:mr-12`
                          : 'bg-blue-50/70 border-blue-200 mr-0 ml-4 sm:ml-12'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isFirstSpeaker ? theme.bgActive : 'bg-blue-600'
                            }`}
                          />
                          {turn.speaker}
                        </span>
                        <TextToSpeechButton text={turn.text} size="sm" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{turn.text}</p>
                      <p className="text-xs text-gray-600 mt-1 italic leading-snug">
                        Terjemahan: {turn.translation}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TIPS & RUMUS */}
        {activeTab === 'tips' && (
          <div className="space-y-6">
            {material.keyPoints && material.keyPoints.length > 0 && (
              <div>
                <h3 className={`text-sm font-bold ${theme.textDark} uppercase tracking-wider mb-3 flex items-center gap-2`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Poin Kunci yang Wajib Diingat</span>
                </h3>
                <div className="space-y-2">
                  {material.keyPoints.map((kp, kIdx) => (
                    <div
                      key={kIdx}
                      className={`p-3.5 rounded-xl ${theme.bgLight} border ${theme.borderColor} text-xs sm:text-sm ${theme.textDark} font-medium flex items-start gap-2.5`}
                    >
                      <span className={`w-5 h-5 rounded-full ${theme.bgActive} text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5`}>
                        {kIdx + 1}
                      </span>
                      <span>{kp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {material.tips && material.tips.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Tips Belajar & Strategi Menjawab Soal</span>
                </h3>
                <div className="space-y-2">
                  {material.tips.map((tip, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs sm:text-sm text-amber-950 font-medium flex items-start gap-2.5"
                    >
                      <span className="text-amber-600 font-bold shrink-0 mt-0.5">💡</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA to Start Exercise */}
      <div className={`p-6 bg-gradient-to-r ${theme.bannerGradient} rounded-3xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4`}>
        <div>
          <h3 className="text-lg font-bold">Sudah Paham Materinya?</h3>
          <p className="text-xs text-white/90 mt-0.5">
            Uji pemahamanmu sekarang dengan mengerjakan {questionCount} soal pilihan ganda.
          </p>
        </div>

        <button
          id="start-exercise-bottom-btn"
          onClick={onStartExercise}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-gray-950 hover:bg-gray-50 font-extrabold text-sm sm:text-base shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>Mulai Latihan Sekarang</span>
          <ArrowRight className="w-5 h-5 text-gray-900" />
        </button>
      </div>
    </div>
  );
};
