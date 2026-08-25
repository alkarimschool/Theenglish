import React, { useState, useEffect } from 'react';
import { Level, Category, Topic, LearningMaterial } from '../../types';
import { api } from '../../services/api';
import {
  UNIFIED_TEMPLATES,
  getMaterialOnlyTemplate,
  getQuestionsOnlyTemplate,
} from '../../data/unifiedImportTemplates';
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Sparkles,
  X,
  ArrowRight,
  Edit3,
  Trash2,
  Copy,
  BookOpen,
  HelpCircle,
  Check,
  Smile,
  BookMarked,
  MessageSquare,
  Mic,
  Cpu,
  Layers,
} from 'lucide-react';

export type ImportMode = 'all' | 'material' | 'questions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  levels: Level[];
  categories: Category[];
  topics: Topic[];
  selectedTopicId?: string;
  selectedLevelId?: string;
  selectedCategoryId?: string;
  mode?: ImportMode;
  onSuccess: () => void;
}

interface ParsedQuestionItem {
  id: string;
  number?: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

interface ParsedMaterialData {
  summary: string;
  contentMarkdown: string;
  hasContent: boolean;
}

export const BulkImportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  levels,
  categories,
  topics,
  selectedTopicId,
  selectedLevelId,
  selectedCategoryId,
  mode = 'all',
  onSuccess,
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('expression');
  const [targetLevelId, setTargetLevelId] = useState(selectedLevelId || levels[0]?.id || 'smp');
  const [targetCategoryId, setTargetCategoryId] = useState(selectedCategoryId || 'expression');
  const [targetTopicId, setTargetTopicId] = useState(selectedTopicId || '');

  const [rawText, setRawText] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [previewTab, setPreviewTab] = useState<'both' | 'material' | 'questions'>('both');

  const [parsedMaterial, setParsedMaterial] = useState<ParsedMaterialData>({
    summary: '',
    contentMarkdown: '',
    hasContent: false,
  });
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestionItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isSmpOrSma = targetLevelId.startsWith('smp-') || targetLevelId.startsWith('sma-');
  const availableCategories = categories.filter((c) => {
    if (c.id === 'grammar') return isSmpOrSma;
    return true;
  });

  // Filter topics based on target Level and Category
  const availableTopics = topics.filter(
    (t) => t.levelId === targetLevelId && t.categoryId === targetCategoryId
  );

  const getTemplateText = (catKey: string) => {
    if (mode === 'material') {
      return getMaterialOnlyTemplate(catKey);
    }
    if (mode === 'questions') {
      return getQuestionsOnlyTemplate(catKey);
    }
    return UNIFIED_TEMPLATES[catKey]?.sampleText || '';
  };

  useEffect(() => {
    if (!isSmpOrSma && targetCategoryId === 'grammar') {
      setTargetCategoryId('expression');
      setActiveCategoryTab('expression');
    }
  }, [targetLevelId, isSmpOrSma, targetCategoryId]);

  useEffect(() => {
    if (selectedLevelId) setTargetLevelId(selectedLevelId);
    if (selectedCategoryId) {
      setTargetCategoryId(selectedCategoryId);
      setActiveCategoryTab(selectedCategoryId);
    }
    if (selectedTopicId) setTargetTopicId(selectedTopicId);
  }, [selectedLevelId, selectedCategoryId, selectedTopicId]);

  useEffect(() => {
    if (availableTopics.length > 0) {
      if (!targetTopicId || !availableTopics.some((t) => t.id === targetTopicId)) {
        setTargetTopicId(availableTopics[0].id);
      }
    } else {
      setTargetTopicId('');
    }
  }, [targetLevelId, targetCategoryId, availableTopics, targetTopicId]);

  // When initial load or tab switch
  useEffect(() => {
    if (!rawText.trim()) {
      setRawText(getTemplateText(activeCategoryTab));
    }
  }, [activeCategoryTab, mode]);

  if (!isOpen) return null;

  const handleSelectTemplateTab = (catKey: string) => {
    setActiveCategoryTab(catKey);
    setTargetCategoryId(catKey);
    setRawText(getTemplateText(catKey));
  };

  const handleCopyTemplate = () => {
    const template = getTemplateText(activeCategoryTab) || rawText;
    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  // Robust Parser
  const handleParseUnifiedText = () => {
    if (!rawText.trim()) {
      setError(
        mode === 'material'
          ? 'Mohon masukkan teks materi pembelajaran yang akan di-import.'
          : mode === 'questions'
          ? 'Mohon masukkan teks butir soal latihan yang akan di-import.'
          : 'Mohon masukkan teks materi dan/atau soal latihan yang akan di-import.'
      );
      return;
    }

    try {
      setError('');
      let materialText = '';
      let questionsText = '';

      if (mode === 'material') {
        materialText = rawText;
      } else if (mode === 'questions') {
        questionsText = rawText;
      } else {
        // Check if text has explicit section headers
        const hasMaterialHeader = /(?:===|---|#|\[)\s*(?:MATERI|LEARNING\s*MATERIAL|RINGKASAN)/i.test(rawText);
        const hasQuestionsHeader = /(?:===|---|#|\[)\s*(?:SOAL|LATIHAN|QUESTIONS|EXERCISE)/i.test(rawText);

        if (hasMaterialHeader && hasQuestionsHeader) {
          const parts = rawText.split(/(?:===|---|#|\[)\s*(?:SOAL|LATIHAN|QUESTIONS|EXERCISE)[^\]\n\r]*[\=\-\]\#]*/i);
          if (parts.length >= 2) {
            materialText = parts[0].replace(/(?:===|---|#|\[)\s*(?:MATERI|LEARNING\s*MATERIAL|RINGKASAN)[^\]\n\r]*[\=\-\]\#]*/i, '').trim();
            questionsText = parts.slice(1).join('\n').trim();
          }
        } else if (hasMaterialHeader && !hasQuestionsHeader) {
          const numMatch = rawText.search(/\n\s*1[\.\)]\s+/);
          if (numMatch !== -1) {
            materialText = rawText.substring(0, numMatch).replace(/(?:===|---|#|\[)\s*(?:MATERI|LEARNING\s*MATERIAL|RINGKASAN)[^\]\n\r]*[\=\-\]\#]*/i, '').trim();
            questionsText = rawText.substring(numMatch).trim();
          } else {
            materialText = rawText.replace(/(?:===|---|#|\[)\s*(?:MATERI|LEARNING\s*MATERIAL|RINGKASAN)[^\]\n\r]*[\=\-\]\#]*/i, '').trim();
          }
        } else if (!hasMaterialHeader && hasQuestionsHeader) {
          questionsText = rawText.replace(/(?:===|---|#|\[)\s*(?:SOAL|LATIHAN|QUESTIONS|EXERCISE)[^\]\n\r]*[\=\-\]\#]*/i, '').trim();
        } else {
          const numMatch = rawText.search(/\n\s*1[\.\)]\s+/);
          if (/^\s*1[\.\)]\s+/.test(rawText)) {
            questionsText = rawText;
          } else if (numMatch !== -1) {
            materialText = rawText.substring(0, numMatch).trim();
            questionsText = rawText.substring(numMatch).trim();
          } else {
            materialText = rawText;
          }
        }
      }

      // 1. Parse Material
      let parsedMat: ParsedMaterialData = {
        summary: '',
        contentMarkdown: '',
        hasContent: false,
      };

      if (materialText.trim() && mode !== 'questions') {
        const matLines = materialText.split('\n');
        let summaryFound = '';
        let contentLines: string[] = [];

        for (let i = 0; i < matLines.length; i++) {
          const line = matLines[i];
          if (/^(?:Ringkasan|Summary|Deskripsi)\s*[\:\=]\s*(.+)/i.test(line)) {
            const match = line.match(/^(?:Ringkasan|Summary|Deskripsi)\s*[\:\=]\s*(.+)/i);
            if (match && match[1]) {
              summaryFound = match[1].trim();
            }
          } else if (/^(?:Materi|Content|Penjelasan)\s*[\:\=]/i.test(line)) {
            const rest = line.replace(/^(?:Materi|Content|Penjelasan)\s*[\:\=]\s*/i, '');
            if (rest.trim()) contentLines.push(rest);
          } else {
            contentLines.push(line);
          }
        }

        const fullMarkdown = contentLines.join('\n').trim();
        if (summaryFound || fullMarkdown) {
          parsedMat = {
            summary: summaryFound || fullMarkdown.slice(0, 140) + '...',
            contentMarkdown: fullMarkdown || summaryFound,
            hasContent: true,
          };
        }
      }

      // 2. Parse Questions
      const parsedQList: ParsedQuestionItem[] = [];
      if (questionsText.trim() && mode !== 'material') {
        const blocks = questionsText.split(/\n\s*(?=\d+[\.\)]\s+)/).filter((b) => b.trim().length > 0);

        blocks.forEach((block, idx) => {
          const lines = block.trim().split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
          if (lines.length < 2) return;

          let questionText = lines[0].replace(/^\d+[\.\)]\s*/, '').trim();

          let optionA = '';
          let optionB = '';
          let optionC = '';
          let optionD = '';
          let correctAnswer: 'A' | 'B' | 'C' | 'D' = 'A';
          let explanation = '';

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i];

            if (/^[A|a][\.\)]\s*/.test(line)) {
              optionA = line.replace(/^[A|a][\.\)]\s*/, '').trim();
            } else if (/^[B|b][\.\)]\s*/.test(line)) {
              optionB = line.replace(/^[B|b][\.\)]\s*/, '').trim();
            } else if (/^[C|c][\.\)]\s*/.test(line)) {
              optionC = line.replace(/^[C|c][\.\)]\s*/, '').trim();
            } else if (/^[D|d][\.\)]\s*/.test(line)) {
              optionD = line.replace(/^[D|d][\.\)]\s*/, '').trim();
            } else if (/(?:Ans|Key|Answer|Kunci)[\s\:\=]+([A-D|a-d])/i.test(line)) {
              const match = line.match(/(?:Ans|Key|Answer|Kunci)[\s\:\=]+([A-D|a-d])/i);
              if (match && match[1]) {
                correctAnswer = match[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
              }
            } else if (/(?:Exp|Explanation|Pembahasan|Penjelasan)[\s\:\=]+(.*)/i.test(line)) {
              const match = line.match(/(?:Exp|Explanation|Pembahasan|Penjelasan)[\s\:\=]+(.*)/i);
              if (match && match[1]) {
                explanation = match[1].trim();
              }
            } else if (!optionA) {
              questionText += ' ' + line;
            }
          }

          if (questionText && (optionA || optionB)) {
            parsedQList.push({
              id: `parse-${idx + 1}-${Date.now()}`,
              number: idx + 1,
              questionText,
              optionA: optionA || 'Option A',
              optionB: optionB || 'Option B',
              optionC: optionC || 'Option C',
              optionD: optionD || 'Option D',
              correctAnswer,
              explanation: explanation || `Jawaban yang benar adalah opsi ${correctAnswer}.`,
            });
          }
        });
      }

      if (mode === 'material' && !parsedMat.hasContent) {
        setError('Format materi pembelajaran tidak terdeteksi. Silakan masukkan ringkasan dan penjelasan materi.');
        return;
      }

      if (mode === 'questions' && parsedQList.length === 0) {
        setError('Format soal tidak terdeteksi. Pastikan format nomor soal (1., 2.) beserta opsi A, B, C, D dan kunci jawaban (Ans: A).');
        return;
      }

      if (mode === 'all' && !parsedMat.hasContent && parsedQList.length === 0) {
        setError('Format tidak terdeteksi. Pastikan format mencakup materi atau nomor soal (1., 2.) beserta opsi A, B, C, D dan kunci jawaban (Ans: A).');
        return;
      }

      setParsedMaterial(parsedMat);
      setParsedQuestions(parsedQList);
      setStep('preview');

      if (mode === 'material') {
        setPreviewTab('material');
      } else if (mode === 'questions') {
        setPreviewTab('questions');
      } else {
        if (parsedMat.hasContent && parsedQList.length > 0) {
          setPreviewTab('both');
        } else if (parsedMat.hasContent) {
          setPreviewTab('material');
        } else {
          setPreviewTab('questions');
        }
      }
    } catch (err: any) {
      setError('Gagal memproses format: ' + err.message);
    }
  };

  const handleUpdateQuestion = (idx: number, field: keyof ParsedQuestionItem, value: any) => {
    const updated = [...parsedQuestions];
    updated[idx] = { ...updated[idx], [field]: value };
    setParsedQuestions(updated);
  };

  const handleDeleteQuestion = (idx: number) => {
    setParsedQuestions(parsedQuestions.filter((_, i) => i !== idx));
  };

  const handleSaveToDatabase = async () => {
    if (!targetTopicId) {
      setError('Mohon pilih Topik tujuan penyimpanan.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (mode === 'material' || (mode === 'all' && parsedMaterial.hasContent)) {
        if (parsedMaterial.hasContent) {
          await api.updateMaterial(targetTopicId, {
            summary: parsedMaterial.summary,
            contentMarkdown: parsedMaterial.contentMarkdown,
          });
        }
      }

      if (mode === 'questions' || (mode === 'all' && parsedQuestions.length > 0)) {
        if (parsedQuestions.length > 0) {
          await api.bulkImportQuestions(
            parsedQuestions.map((p) => ({
              questionText: p.questionText,
              optionA: p.optionA,
              optionB: p.optionB,
              optionC: p.optionC,
              optionD: p.optionD,
              correctAnswer: p.correctAnswer,
              explanation: p.explanation,
            })),
            targetTopicId,
            targetLevelId,
            targetCategoryId
          );
        }
      }

      const successLabel =
        mode === 'material'
          ? 'Materi Pembelajaran'
          : mode === 'questions'
          ? `${parsedQuestions.length} Soal Latihan`
          : `${parsedMaterial.hasContent ? 'Materi' : ''}${
              parsedMaterial.hasContent && parsedQuestions.length > 0 ? ' & ' : ''
            }${parsedQuestions.length > 0 ? `${parsedQuestions.length} Soal` : ''}`;

      setSuccessMessage(`Berhasil mengimpor ${successLabel} ke database!`);

      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan ke database.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'expression':
        return <Smile className="w-4 h-4" />;
      case 'vocab':
        return <BookMarked className="w-4 h-4" />;
      case 'dialogue':
        return <MessageSquare className="w-4 h-4" />;
      case 'speech':
        return <Mic className="w-4 h-4" />;
      case 'grammar':
        return <Cpu className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const currentTemplateObj = UNIFIED_TEMPLATES[activeCategoryTab] || UNIFIED_TEMPLATES.expression;

  const modalTitle =
    mode === 'material'
      ? 'Quick Import Materi Pembelajaran'
      : mode === 'questions'
      ? 'Quick Import Bank Soal'
      : 'Quick Import 1 Format (Materi & Soal)';

  const modalBadge =
    mode === 'material' ? 'Materi Guru' : mode === 'questions' ? 'Bank Soal' : 'All-in-One';

  const modalSubtitle =
    mode === 'material'
      ? 'Salin dan tempel rangkuman materi, penjelasan konsep, kosakata, dan dialog sesuai jenjang mengajar Anda.'
      : mode === 'questions'
      ? 'Salin dan tempel butir soal pilihan ganda, kunci jawaban, dan pembahasan sesuai jenjang mengajar Anda.'
      : 'Kelola materi di bagian atas dan langsung sertakan soal latihannya di bagian bawah dalam satu teks.';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Modal */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold shadow-inner">
              {mode === 'material' ? (
                <BookOpen className="w-5 h-5" />
              ) : mode === 'questions' ? (
                <HelpCircle className="w-5 h-5" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{modalTitle}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-emerald-950 uppercase tracking-wider">
                  {modalBadge}
                </span>
              </div>
              <p className="text-xs text-emerald-100">{modalSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: INPUT TEKS & PILIH CONTOH FORMAT */}
          {step === 'input' ? (
            <div className="space-y-4">
              {/* Category Template Switcher Bar */}
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100/80 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Contoh Format Kategori Pembelajaran:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyTemplate}
                      className="px-3 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      {copiedTemplate ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Salin Format</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRawText(getTemplateText(activeCategoryTab))}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Pakai Format Ini</span>
                    </button>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.values(UNIFIED_TEMPLATES).map((cat) => {
                    const isSelected = activeCategoryTab === cat.categoryId;
                    return (
                      <button
                        key={cat.categoryId}
                        type="button"
                        onClick={() => handleSelectTemplateTab(cat.categoryId)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-200'
                            : 'bg-white hover:bg-emerald-50/50 text-gray-700 border-gray-200'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {getCategoryIcon(cat.categoryId)}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold truncate">{cat.categoryName}</div>
                          <div
                            className={`text-[10px] truncate ${
                              isSelected ? 'text-emerald-100' : 'text-gray-400'
                            }`}
                          >
                            {cat.categoryId === 'grammar' ? 'SMP/SMA Only' : 'TK - SMA'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="px-3 py-1.5 bg-white/80 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 flex items-center gap-2">
                  <span className="font-bold">Deskripsi Format {currentTemplateObj.categoryName}:</span>
                  <span className="text-gray-600">{currentTemplateObj.description}</span>
                </div>
              </div>

              {/* Target Level, Category, and Topic Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Jenjang Target (Sesuai Hak Akses)</label>
                  <select
                    value={targetLevelId}
                    onChange={(e) => setTargetLevelId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white"
                  >
                    {levels.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori Target</label>
                  <select
                    value={targetCategoryId}
                    onChange={(e) => {
                      setTargetCategoryId(e.target.value);
                      setActiveCategoryTab(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white"
                  >
                    {availableCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Topik Pembelajaran</label>
                  <select
                    value={targetTopicId}
                    onChange={(e) => setTargetTopicId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white"
                  >
                    {availableTopics.length === 0 ? (
                      <option value="">(Belum ada topik di kategori ini)</option>
                    ) : (
                      availableTopics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* TEXTAREA INPUT */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {mode === 'material'
                        ? 'Teks Materi Pembelajaran:'
                        : mode === 'questions'
                        ? 'Teks Butir Soal Latihan (Pilihan Ganda):'
                        : 'Teks Materi & Soal Latihan:'}
                    </span>
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {mode === 'material' && (
                      <span>Format: Ringkasan: ... Materi: # Penjelasan...</span>
                    )}
                    {mode === 'questions' && (
                      <span>Format: 1. Pertanyaan, A. B. C. D., Ans: A, Exp: ...</span>
                    )}
                    {mode === 'all' && (
                      <span>Format: === MATERI PEMBELAJARAN === lalu === SOAL LATIHAN ===</span>
                    )}
                  </span>
                </div>

                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={13}
                  placeholder={
                    mode === 'material'
                      ? `=== MATERI PEMBELAJARAN ===\nRingkasan: Ringkasan materi...\nMateri:\n# Judul Materi...\n## 1. Poin Penjelasan / Kosakata / Dialog...`
                      : mode === 'questions'
                      ? `1. Pertanyaan pertama...\nA. Pilihan A\nB. Pilihan B\nC. Pilihan C\nD. Pilihan D\nAns: A\nExp: Pembahasan...`
                      : `=== MATERI PEMBELAJARAN ===\nRingkasan: Ringkasan materi...\nMateri:\n# Penjelasan materi...\n\n=== SOAL LATIHAN ===\n1. Pertanyaan pertama...\nA. Pilihan A\nB. Pilihan B\nC. Pilihan C\nD. Pilihan D\nAns: A\nExp: Pembahasan...`
                  }
                  className="w-full p-4 rounded-2xl border border-gray-300 font-mono text-xs text-gray-900 leading-relaxed focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100 outline-none bg-gray-50/40 focus:bg-white"
                />

                <div className="mt-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    {mode === 'material' && (
                      <span>
                        <strong>Khusus Materi:</strong> Masukkan rangkuman dan konten penjelasan materi pembelajaran. Data langsung tersimpan ke topik pilihan siswa.
                      </span>
                    )}
                    {mode === 'questions' && (
                      <span>
                        <strong>Khusus Soal:</strong> Masukkan butir-butir soal pilihan ganda dengan format penomoran 1., pilihan A/B/C/D, kunci jawaban (Ans: A), dan pembahasan (Exp: ...).
                      </span>
                    )}
                    {mode === 'all' && (
                      <span>
                        <strong>Fleksibel & Otomatis:</strong> Guru dapat menempelkan teks materi saja, soal saja, atau keduanya sekaligus.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: INTERACTIVE PREVIEW */
            <div className="space-y-4">
              {/* Preview Nav Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-2">
                <div className="flex items-center gap-2">
                  {mode === 'all' && (
                    <>
                      <span className="text-xs font-bold text-gray-500 mr-1">Tampilkan:</span>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('both')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          previewTab === 'both'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Semua (Materi & Soal)
                      </button>
                    </>
                  )}
                  {(mode === 'material' || (mode === 'all' && parsedMaterial.hasContent)) && (
                    <button
                      type="button"
                      onClick={() => setPreviewTab('material')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        previewTab === 'material'
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Materi Pembelajaran
                    </button>
                  )}
                  {(mode === 'questions' || (mode === 'all' && parsedQuestions.length > 0)) && (
                    <button
                      type="button"
                      onClick={() => setPreviewTab('questions')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        previewTab === 'questions'
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Soal Latihan ({parsedQuestions.length})
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-xs text-emerald-800 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Kembali Edit Teks</span>
                </button>
              </div>

              {/* Target info badge */}
              <div className="px-4 py-2.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-950">Topik Tujuan:</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white border border-emerald-300 font-bold text-emerald-900">
                    {availableTopics.find((t) => t.id === targetTopicId)?.title || 'Pilih Topik'}
                  </span>
                  <span className="text-gray-500">
                    ({targetLevelId} • {targetCategoryId})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-emerald-900 font-semibold">
                  {mode !== 'questions' && (
                    <span>Materi: {parsedMaterial.hasContent ? 'Siap disimpan' : 'Kosong'}</span>
                  )}
                  {mode === 'all' && <span>•</span>}
                  {mode !== 'material' && (
                    <span>Soal: {parsedQuestions.length} butir terdeteksi</span>
                  )}
                </div>
              </div>

              {/* PREVIEW: MATERI PEMBELAJARAN */}
              {(previewTab === 'both' || previewTab === 'material') && parsedMaterial.hasContent && (
                <div className="p-4 rounded-2xl border border-emerald-200 bg-white space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>Pratinjau Materi Pembelajaran</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Akan memperbarui konten materi topik
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Ringkasan Materi (Summary):</label>
                      <input
                        type="text"
                        value={parsedMaterial.summary}
                        onChange={(e) =>
                          setParsedMaterial({ ...parsedMaterial, summary: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 bg-gray-50/50 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Konten Markdown / Naskah:</label>
                      <textarea
                        rows={6}
                        value={parsedMaterial.contentMarkdown}
                        onChange={(e) =>
                          setParsedMaterial({ ...parsedMaterial, contentMarkdown: e.target.value })
                        }
                        className="w-full p-3 text-xs font-mono rounded-xl border border-gray-300 bg-gray-50/50 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW: SOAL LATIHAN */}
              {(previewTab === 'both' || previewTab === 'questions') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <HelpCircle className="w-4 h-4 text-emerald-600" />
                      <span>Daftar Soal Latihan ({parsedQuestions.length} Butir Soal)</span>
                    </div>
                    <span className="text-[11px] text-gray-500">
                      Semua soal dapat diedit langsung sebelum disimpan ke bank soal.
                    </span>
                  </div>

                  {parsedQuestions.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-200">
                      Tidak ada soal latihan yang terdeteksi.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {parsedQuestions.map((item, idx) => (
                        <div key={item.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                {idx + 1}
                              </span>
                              <input
                                type="text"
                                value={item.questionText}
                                onChange={(e) => handleUpdateQuestion(idx, 'questionText', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-bold"
                              />
                            </div>
                            <button
                              onClick={() => handleDeleteQuestion(idx)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Hapus soal ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* 4 Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                              <div key={opt} className="flex items-center gap-2">
                                <span className="text-xs font-bold w-4 text-gray-600">{opt}.</span>
                                <input
                                  type="text"
                                  value={item[`option${opt}` as keyof ParsedQuestionItem] as string}
                                  onChange={(e) =>
                                    handleUpdateQuestion(idx, `option${opt}` as keyof ParsedQuestionItem, e.target.value)
                                  }
                                  className="w-full px-2.5 py-1 text-xs rounded-lg border border-gray-300 bg-white"
                                />
                              </div>
                            ))}
                          </div>

                          {/* Key & Explanation */}
                          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-200/60 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-700">Kunci Jawaban:</span>
                              <select
                                value={item.correctAnswer}
                                onChange={(e) => handleUpdateQuestion(idx, 'correctAnswer', e.target.value)}
                                className="px-2 py-1 bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold rounded-lg cursor-pointer"
                              >
                                <option value="A">Opsi A</option>
                                <option value="B">Opsi B</option>
                                <option value="C">Opsi C</option>
                                <option value="D">Opsi D</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                              <span className="font-semibold text-gray-600">Pembahasan:</span>
                              <input
                                type="text"
                                value={item.explanation || ''}
                                onChange={(e) => handleUpdateQuestion(idx, 'explanation', e.target.value)}
                                placeholder="Penjelasan jawaban..."
                                className="w-full px-2.5 py-1 text-xs rounded-lg border border-gray-300 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-200 transition cursor-pointer"
          >
            Batal
          </button>

          {step === 'input' ? (
            <button
              type="button"
              onClick={handleParseUnifiedText}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <span>Lanjut ke Pratinjau (Preview)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleSaveToDatabase}
                disabled={
                  loading ||
                  !targetTopicId ||
                  (mode === 'material' && !parsedMaterial.hasContent) ||
                  (mode === 'questions' && parsedQuestions.length === 0) ||
                  (mode === 'all' && !parsedMaterial.hasContent && parsedQuestions.length === 0)
                }
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                {loading ? (
                  <span>Menyimpan ke Database...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {mode === 'material'
                        ? 'Simpan Materi Pembelajaran'
                        : mode === 'questions'
                        ? `Simpan ${parsedQuestions.length} Soal ke Bank Soal`
                        : `Simpan ${parsedMaterial.hasContent ? 'Materi' : ''}${
                            parsedMaterial.hasContent && parsedQuestions.length > 0 ? ' & ' : ''
                          }${parsedQuestions.length > 0 ? `${parsedQuestions.length} Soal` : ''}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
