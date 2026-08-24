import React, { useState, useEffect } from 'react';
import { Question, Level, Category, Topic, User } from '../../types';
import { api } from '../../services/api';
import { TextToSpeechButton } from '../common/TextToSpeechButton';
import {
  HelpCircle,
  Plus,
  Upload,
  Edit2,
  Trash2,
  Copy,
  MoveRight,
  Search,
  CheckCircle,
  X,
  Volume2,
  Sparkles,
} from 'lucide-react';

interface Props {
  levels: Level[];
  categories: Category[];
  topics: Topic[];
  currentUser: User;
  initialTopicId?: string;
  initialLevelId?: string;
  initialCategoryId?: string;
  onOpenBulkImport: (topicId?: string, levelId?: string, categoryId?: string, mode?: 'all' | 'material' | 'questions') => void;
  onRefresh: () => void;
}

export const QuestionBank: React.FC<Props> = ({
  levels,
  categories,
  topics,
  currentUser,
  initialTopicId,
  initialLevelId,
  initialCategoryId,
  onOpenBulkImport,
  onRefresh,
}) => {
  const [levelFilter, setLevelFilter] = useState(initialLevelId || levels[0]?.id || 'smp-7');
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryId || 'all');
  const [topicFilter, setTopicFilter] = useState(initialTopicId || 'all');
  const [search, setSearch] = useState('');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Add / Edit Single Question modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctKey, setCorrectKey] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');
  const [targetTopicId, setTargetTopicId] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Bulk Move Modal
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [destinationTopicId, setDestinationTopicId] = useState('');

  // RBAC allowed levels
  const allowedLevels =
    currentUser.role === 'admin' || !currentUser.assignedLevelIds || currentUser.assignedLevelIds.length === 0
      ? levels
      : levels.filter((l) => currentUser.assignedLevelIds?.includes(l.id));

  // Available topics based on level and category
  const availableTopics = topics.filter((t) => {
    const matchLevel = levelFilter === 'all' || t.levelId === levelFilter;
    const matchCat = categoryFilter === 'all' || t.categoryId === categoryFilter;
    return matchLevel && matchCat;
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await api.getQuestions({
        levelId: levelFilter !== 'all' ? levelFilter : undefined,
        categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
        topicId: topicFilter !== 'all' ? topicFilter : undefined,
        search: search.trim() ? search.trim() : undefined,
      });
      setQuestions(data);
      setSelectedIds([]);
    } catch (err: any) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [levelFilter, categoryFilter, topicFilter, search]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(questions.map((q) => q.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectKey('A');
    setExplanation('');
    setTargetTopicId(topicFilter !== 'all' ? topicFilter : availableTopics[0]?.id || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setQText(q.questionText);
    setOptA(q.optionA);
    setOptB(q.optionB);
    setOptC(q.optionC);
    setOptD(q.optionD);
    setCorrectKey(q.correctAnswer);
    setExplanation(q.explanation || '');
    setTargetTopicId(q.topicId);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      setFormError('Mohon isi Pertanyaan dan seluruh pilihan jawaban A, B, C, D.');
      return;
    }
    if (!targetTopicId) {
      setFormError('Mohon pilih Topic tujuan.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const topicObj = topics.find((t) => t.id === targetTopicId);
      if (editingQuestion) {
        await api.updateQuestion(editingQuestion.id, {
          questionText: qText.trim(),
          optionA: optA.trim(),
          optionB: optB.trim(),
          optionC: optC.trim(),
          optionD: optD.trim(),
          correctAnswer: correctKey,
          explanation: explanation.trim(),
          topicId: targetTopicId,
          levelId: topicObj?.levelId,
          categoryId: topicObj?.categoryId,
        });
      } else {
        await api.createQuestion({
          questionText: qText.trim(),
          optionA: optA.trim(),
          optionB: optB.trim(),
          optionC: optC.trim(),
          optionD: optD.trim(),
          correctAnswer: correctKey,
          explanation: explanation.trim(),
          topicId: targetTopicId,
          levelId: topicObj?.levelId || 'smp-7',
          categoryId: topicObj?.categoryId || 'grammar',
        });
      }

      setIsModalOpen(false);
      fetchQuestions();
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan soal.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    try {
      await api.deleteQuestion(id);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      fetchQuestions();
      onRefresh();
    } catch (err: any) {
      alert('Gagal menghapus soal: ' + err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await api.bulkDeleteQuestions(selectedIds);
      setSelectedIds([]);
      fetchQuestions();
      onRefresh();
    } catch (err: any) {
      alert('Gagal menghapus soal terpilih: ' + err.message);
    }
  };

  const handleBulkMove = async () => {
    if (!destinationTopicId) {
      alert('Pilih topic tujuan pemindahan.');
      return;
    }
    try {
      await api.bulkMoveQuestions(selectedIds, destinationTopicId);
      setIsMoveModalOpen(false);
      fetchQuestions();
      onRefresh();
    } catch (err: any) {
      alert('Gagal memindahkan soal: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bank Soal & Latihan (Question Bank)</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola {questions.length} soal latihan pilihan ganda, kunci jawaban, dan pembahasan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="bulk-import-trigger-btn"
            type="button"
            onClick={() =>
              onOpenBulkImport(
                topicFilter !== 'all' ? topicFilter : undefined,
                levelFilter !== 'all' ? levelFilter : undefined,
                categoryFilter !== 'all' ? categoryFilter : undefined,
                'questions'
              )
            }
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-700/15"
          >
            <Upload className="w-4 h-4" />
            <span>Quick Import Soal</span>
          </button>

          <button
            id="add-single-q-btn"
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-2xs"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>Tambah 1 Soal</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari teks soal / pembahasan..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        </div>

        <div>
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value);
              setTopicFilter('all');
            }}
            className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-800"
          >
            <option value="all">Semua Level</option>
            {allowedLevels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setTopicFilter('all');
            }}
            className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-800"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-800"
          >
            <option value="all">Semua Topic ({availableTopics.length})</option>
            {availableTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Operations Toolbar */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 bg-emerald-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-xs">
              {selectedIds.length}
            </span>
            <span>Soal Terpilih</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMoveModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <MoveRight className="w-3.5 h-3.5" />
              <span>Pindah ke Topic Lain</span>
            </button>

            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Terpilih</span>
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Memuat bank soal...</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">Belum Ada Soal di Filter Ini</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Gunakan fitur Quick Copy-Paste Import untuk memasukkan puluhan soal sekaligus dari format dokumen.
            </p>
          </div>
        ) : (
          <div>
            {/* Select All Checkbox Header */}
            <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 font-semibold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.length === questions.length && questions.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Pilih Semua ({questions.length} Soal)</span>
              </label>
              <span>Urutan Soal Latihan</span>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => {
                const isChecked = selectedIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-2xl p-5 border transition-all ${
                      isChecked
                        ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20'
                        : 'border-gray-200/90 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(q.id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-1"
                        />
                        <span className="w-7 h-7 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {q.questionNumber || idx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-gray-900 leading-relaxed">
                            {q.questionText}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-gray-500">
                            <span className="font-bold text-emerald-800 uppercase">{q.levelId}</span>
                            <span>•</span>
                            <span className="font-bold text-teal-800 uppercase">{q.categoryId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <TextToSpeechButton text={q.questionText} size="sm" />
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(q)}
                          className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSingle(q.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 4 Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 ml-7">
                      {[
                        { key: 'A', text: q.optionA },
                        { key: 'B', text: q.optionB },
                        { key: 'C', text: q.optionC },
                        { key: 'D', text: q.optionD },
                      ].map(({ key, text }) => {
                        const isCorrect = q.correctAnswer === key;
                        return (
                          <div
                            key={key}
                            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                                : 'bg-gray-50/50 border-gray-200 text-gray-700'
                            }`}
                          >
                            <span className="font-extrabold w-4">{key}.</span>
                            <span className="flex-1">{text}</span>
                            {isCorrect && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">
                                Kunci
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="mt-3 ml-7 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                        <strong className="text-amber-900 font-bold">💡 Pembahasan: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Single Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {editingQuestion ? 'Edit Soal Latihan' : 'Tambah 1 Soal Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/80 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Topic Pembelajaran</label>
                <select
                  value={targetTopicId}
                  onChange={(e) => setTargetTopicId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold bg-white"
                >
                  {availableTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.levelId.toUpperCase()} • {t.categoryId.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Pertanyaan (Question Text)</label>
                <textarea
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  rows={3}
                  placeholder="Ketik kalimat soal bahasa Inggris..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pilihan A</label>
                  <input
                    type="text"
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    placeholder="Opsi A"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pilihan B</label>
                  <input
                    type="text"
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    placeholder="Opsi B"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pilihan C</label>
                  <input
                    type="text"
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    placeholder="Opsi C"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pilihan D</label>
                  <input
                    type="text"
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    placeholder="Opsi D"
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kunci Jawaban Benar</label>
                  <select
                    value={correctKey}
                    onChange={(e) => setCorrectKey(e.target.value as 'A' | 'B' | 'C' | 'D')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-950 font-bold text-xs"
                  >
                    <option value="A">Opsi A</option>
                    <option value="B">Opsi B</option>
                    <option value="C">Opsi C</option>
                    <option value="D">Opsi D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pembahasan (Explanation)</label>
                  <input
                    type="text"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Penjelasan ringkas mengapa jawaban ini benar..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Move Modal */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-emerald-100">
            <h3 className="text-base font-bold text-gray-900 mb-2">Pindahkan {selectedIds.length} Soal</h3>
            <p className="text-xs text-gray-500 mb-4">
              Pilih topic tujuan pemindahan soal yang dipilih:
            </p>

            <select
              value={destinationTopicId}
              onChange={(e) => setDestinationTopicId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold mb-6"
            >
              <option value="">-- Pilih Topic Tujuan --</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.levelId.toUpperCase()} • {t.categoryId.toUpperCase()})
                </option>
              ))}
            </select>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsMoveModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleBulkMove}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Pindahkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
