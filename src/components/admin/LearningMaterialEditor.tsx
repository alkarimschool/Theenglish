import React, { useState } from 'react';
import { Topic, LearningMaterial, VocabularyItem, DialogueItem, Level, Category } from '../../types';
import { api } from '../../services/api';
import { TextToSpeechButton } from '../common/TextToSpeechButton';
import { BulkImportModal } from './BulkImportModal';
import {
  BookOpen,
  Save,
  Layers,
  MessageSquare,
  Lightbulb,
  Plus,
  Trash2,
  Image,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Upload,
} from 'lucide-react';

interface Props {
  topic: Topic;
  material: LearningMaterial;
  levels?: Level[];
  categories?: Category[];
  topics?: Topic[];
  onBack: () => void;
  onSaved: () => void;
}

export const LearningMaterialEditor: React.FC<Props> = ({
  topic,
  material,
  levels = [],
  categories = [],
  topics = [],
  onBack,
  onSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'vocab' | 'dialogue' | 'tips'>('content');
  const [summary, setSummary] = useState(material.summary || '');
  const [contentMarkdown, setContentMarkdown] = useState(material.contentMarkdown || '');
  const [imageUrl, setImageUrl] = useState(material.imageUrl || '');
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>(material.vocabularyList || []);
  const [dialogueSamples, setDialogueSamples] = useState<DialogueItem[]>(material.dialogueSamples || []);
  const [keyPoints, setKeyPoints] = useState<string[]>(material.keyPoints || []);
  const [tips, setTips] = useState<string[]>(material.tips || []);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  // Vocabulary handlers
  const handleAddVocab = () => {
    const newItem: VocabularyItem = {
      id: `vocab-${Date.now()}`,
      word: '',
      meaning: '',
      example: '',
      partOfSpeech: 'noun',
    };
    setVocabularyList([...vocabularyList, newItem]);
  };

  const handleUpdateVocab = (idx: number, field: keyof VocabularyItem, val: string) => {
    const updated = [...vocabularyList];
    updated[idx] = { ...updated[idx], [field]: val };
    setVocabularyList(updated);
  };

  const handleDeleteVocab = (idx: number) => {
    setVocabularyList(vocabularyList.filter((_, i) => i !== idx));
  };

  // Dialogue handlers
  const handleAddDialogue = () => {
    const newItem: DialogueItem = {
      id: `diag-${Date.now()}`,
      speaker: dialogueSamples.length % 2 === 0 ? 'Person A' : 'Person B',
      text: '',
      translation: '',
    };
    setDialogueSamples([...dialogueSamples, newItem]);
  };

  const handleUpdateDialogue = (idx: number, field: keyof DialogueItem, val: string) => {
    const updated = [...dialogueSamples];
    updated[idx] = { ...updated[idx], [field]: val };
    setDialogueSamples(updated);
  };

  const handleDeleteDialogue = (idx: number) => {
    setDialogueSamples(dialogueSamples.filter((_, i) => i !== idx));
  };

  // Key points / Tips handlers
  const handleAddKeyPoint = () => setKeyPoints([...keyPoints, '']);
  const handleUpdateKeyPoint = (idx: number, val: string) => {
    const updated = [...keyPoints];
    updated[idx] = val;
    setKeyPoints(updated);
  };
  const handleDeleteKeyPoint = (idx: number) => setKeyPoints(keyPoints.filter((_, i) => i !== idx));

  const handleAddTip = () => setTips([...tips, '']);
  const handleUpdateTip = (idx: number, val: string) => {
    const updated = [...tips];
    updated[idx] = val;
    setTips(updated);
  };
  const handleDeleteTip = (idx: number) => setTips(tips.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.updateMaterial(topic.id, {
        summary,
        contentMarkdown,
        imageUrl,
        vocabularyList: vocabularyList.filter((v) => v.word.trim()),
        dialogueSamples: dialogueSamples.filter((d) => d.text.trim()),
        keyPoints: keyPoints.filter((k) => k.trim()),
        tips: tips.filter((t) => t.trim()),
      });

      setSuccessMsg('Materi pembelajaran berhasil disimpan ke database.');
      onSaved();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan materi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                {topic.levelId} • {topic.categoryId}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              Edit Materi: {topic.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBulkImportOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-900/15"
            title="Quick Import materi & soal latihan sekaligus dalam 1 format teks"
          >
            <Upload className="w-4 h-4" />
            <span>Quick Import (Materi & Soal)</span>
          </button>

          <button
            id="save-material-btn"
            type="button"
            disabled={loading}
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-700/15 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan Materi'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Editor Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'content' ? 'bg-white text-emerald-950 shadow-xs' : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Penjelasan & Teori</span>
        </button>

        <button
          onClick={() => setActiveTab('vocab')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'vocab' ? 'bg-white text-emerald-950 shadow-xs' : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-600" />
          <span>Vocabulary ({vocabularyList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dialogue')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'dialogue' ? 'bg-white text-emerald-950 shadow-xs' : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>Dialogue Samples ({dialogueSamples.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'tips' ? 'bg-white text-emerald-950 shadow-xs' : 'text-gray-600 hover:bg-white/50'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-rose-600" />
          <span>Poin Kunci & Tips</span>
        </button>
      </div>

      {/* TAB 1: THEORY & SUMMARY */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Ringkasan Singkat (Summary)
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Ringkasan 1-2 kalimat untuk siswa..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              URL Gambar Ilustrasi (Opsional)
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Isi Teori & Materi Pembelajaran (Mendukung Format Markdown: ### Heading, - List, Rumus)
            </label>
            <textarea
              value={contentMarkdown}
              onChange={(e) => setContentMarkdown(e.target.value)}
              rows={16}
              className="w-full p-4 rounded-2xl border border-gray-300 font-mono text-xs text-gray-900 leading-relaxed outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>
      )}

      {/* TAB 2: VOCABULARY LIST BUILDER */}
      {activeTab === 'vocab' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Kelola Daftar Kosakata (Vocabulary)</h3>
              <p className="text-xs text-gray-500">
                Siswa dapat mendengarkan audio pronunciation dari kata dan contoh kalimat yang dimasukkan.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddVocab}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kata</span>
            </button>
          </div>

          <div className="space-y-3">
            {vocabularyList.map((v, idx) => (
              <div key={v.id || idx} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/70 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-800">Kata #{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    {v.word && <TextToSpeechButton text={v.word} size="sm" />}
                    <button
                      type="button"
                      onClick={() => handleDeleteVocab(idx)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={v.word}
                    onChange={(e) => handleUpdateVocab(idx, 'word', e.target.value)}
                    placeholder="Kata bahasa Inggris (misal: Habitual)"
                    className="px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white font-bold"
                  />
                  <input
                    type="text"
                    value={v.phonetic || ''}
                    onChange={(e) => handleUpdateVocab(idx, 'phonetic', e.target.value)}
                    placeholder="Phonetic (misal: /həˈbɪtʃ.u.əl/)"
                    className="px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white font-mono"
                  />
                  <input
                    type="text"
                    value={v.meaning}
                    onChange={(e) => handleUpdateVocab(idx, 'meaning', e.target.value)}
                    placeholder="Arti bahasa Indonesia"
                    className="px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={v.example}
                    onChange={(e) => handleUpdateVocab(idx, 'example', e.target.value)}
                    placeholder="Contoh kalimat Inggris..."
                    className="px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                  />
                  <input
                    type="text"
                    value={v.exampleTranslation || ''}
                    onChange={(e) => handleUpdateVocab(idx, 'exampleTranslation', e.target.value)}
                    placeholder="Terjemahan contoh kalimat..."
                    className="px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DIALOGUE BUILDER */}
      {activeTab === 'dialogue' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Kelola Contoh Percakapan (Dialogue)</h3>
              <p className="text-xs text-gray-500">Dialog percakapan interaktif dengan suara audio.</p>
            </div>
            <button
              type="button"
              onClick={handleAddDialogue}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Baris Dialog</span>
            </button>
          </div>

          <div className="space-y-3">
            {dialogueSamples.map((d, idx) => (
              <div key={d.id || idx} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/70 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">Baris #{idx + 1}</span>
                    <input
                      type="text"
                      value={d.speaker}
                      onChange={(e) => handleUpdateDialogue(idx, 'speaker', e.target.value)}
                      placeholder="Nama Pembicara (misal: Rian, Sarah)"
                      className="px-2.5 py-1 text-xs rounded-lg border border-gray-300 bg-white font-bold w-36"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {d.text && <TextToSpeechButton text={d.text} size="sm" />}
                    <button
                      type="button"
                      onClick={() => handleDeleteDialogue(idx)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={d.text}
                    onChange={(e) => handleUpdateDialogue(idx, 'text', e.target.value)}
                    placeholder="Kalimat percakapan bahasa Inggris..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white font-medium"
                  />
                  <input
                    type="text"
                    value={d.translation}
                    onChange={(e) => handleUpdateDialogue(idx, 'translation', e.target.value)}
                    placeholder="Terjemahan bahasa Indonesia..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white text-gray-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TIPS & KEY POINTS */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Points */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Poin Kunci (Key Points)
              </h3>
              <button
                type="button"
                onClick={handleAddKeyPoint}
                className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {keyPoints.map((kp, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={kp}
                  onChange={(e) => handleUpdateKeyPoint(idx, e.target.value)}
                  placeholder="Poin penting..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                />
                <button onClick={() => handleDeleteKeyPoint(idx)} className="p-1.5 text-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Tips Belajar (Tips & Hacks)
              </h3>
              <button
                type="button"
                onClick={handleAddTip}
                className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={tip}
                  onChange={(e) => handleUpdateTip(idx, e.target.value)}
                  placeholder="Tips trik..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                />
                <button onClick={() => handleDeleteTip(idx)} className="p-1.5 text-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* BULK IMPORT MODAL */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        levels={levels.length > 0 ? levels : [{ id: topic.levelId, name: topic.levelId, grade: 1 } as any]}
        categories={categories.length > 0 ? categories : [{ id: topic.categoryId, name: topic.categoryId, icon: 'BookOpen', color: 'emerald' } as any]}
        topics={topics.length > 0 ? topics : [topic]}
        selectedTopicId={topic.id}
        selectedLevelId={topic.levelId}
        selectedCategoryId={topic.categoryId}
        onSuccess={async () => {
          try {
            const updatedMat = await api.getLearningMaterial(topic.id);
            if (updatedMat) {
              setSummary(updatedMat.summary || '');
              setContentMarkdown(updatedMat.contentMarkdown || '');
              setImageUrl(updatedMat.imageUrl || '');
              setVocabularyList(updatedMat.vocabularyList || []);
              setDialogueSamples(updatedMat.dialogueSamples || []);
              setKeyPoints(updatedMat.keyPoints || []);
              setTips(updatedMat.tips || []);
            }
          } catch (e) {}
          onSaved();
        }}
      />
    </div>
  );
};
