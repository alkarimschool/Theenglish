import React, { useState, useEffect } from 'react';
import { Topic, Level, Category, User, LearningMaterial } from '../../types';
import { api } from '../../services/api';
import { LearningMaterialEditor } from './LearningMaterialEditor';
import { BulkImportModal } from './BulkImportModal';
import {
  BookOpen,
  Plus,
  Edit2,
  Copy,
  Trash2,
  HelpCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  X,
  Search,
  Layers,
  AlertTriangle,
  Upload,
  FileText,
  Lock,
  Unlock,
  Info,
} from 'lucide-react';

interface Props {
  topics: Topic[];
  levels: Level[];
  categories: Category[];
  currentUser: User;
  onRefresh: () => void;
  onOpenQuestionBankForTopic: (topicId: string, levelId: string, categoryId: string) => void;
}

export const TopicManagement: React.FC<Props> = ({
  topics,
  levels,
  categories,
  currentUser,
  onRefresh,
  onOpenQuestionBankForTopic,
}) => {
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked' | 'hidden'>('all');
  const [search, setSearch] = useState('');

  // Selected Topic for editing Learning Material
  const [editingMaterialTopic, setEditingMaterialTopic] = useState<Topic | null>(null);
  const [currentMaterial, setCurrentMaterial] = useState<LearningMaterial | null>(null);
  const [loadingMaterial, setLoadingMaterial] = useState(false);

  // Bulk Import Unified Modal State
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportTargetTopicId, setBulkImportTargetTopicId] = useState<string | undefined>(undefined);
  const [bulkImportTargetLevelId, setBulkImportTargetLevelId] = useState<string | undefined>(undefined);
  const [bulkImportTargetCategoryId, setBulkImportTargetCategoryId] = useState<string | undefined>(undefined);

  // Add / Edit Basic Topic modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [levelId, setLevelId] = useState(levels[0]?.id || 'smp');
  const [categoryId, setCategoryId] = useState('expression');
  const [isPublished, setIsPublished] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Duplicate Modal State
  const [duplicatingTopic, setDuplicatingTopic] = useState<Topic | null>(null);
  const [dupTitle, setDupTitle] = useState('');
  const [dupTheme, setDupTheme] = useState('');
  const [dupTargetLevelId, setDupTargetLevelId] = useState('');
  const [dupLoading, setDupLoading] = useState(false);
  const [dupError, setDupError] = useState('');

  // Delete Confirm Modal State
  const [deletingTopic, setDeletingTopic] = useState<Topic | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // RBAC level filter for teacher
  const allowedLevels =
    currentUser.role === 'admin' || !currentUser.assignedLevelIds || currentUser.assignedLevelIds.length === 0
      ? levels
      : levels.filter((l) => currentUser.assignedLevelIds?.includes(l.id));

  // Determine if chosen level is SMP/SMA
  const isSelectedLevelSmpOrSma = levelId.startsWith('smp-') || levelId.startsWith('sma-');
  const availableModalCategories = categories.filter((c) => {
    if (c.id === 'grammar') return isSelectedLevelSmpOrSma;
    return true;
  });

  useEffect(() => {
    if (!isSelectedLevelSmpOrSma && categoryId === 'grammar') {
      setCategoryId('expression');
    }
  }, [levelId, isSelectedLevelSmpOrSma, categoryId]);

  const filteredTopics = topics.filter((t) => {
    // RBAC check
    if (currentUser.role === 'teacher' && currentUser.assignedLevelIds && currentUser.assignedLevelIds.length > 0) {
      if (!currentUser.assignedLevelIds.includes(t.levelId)) return false;
    }

    const matchLevel = levelFilter === 'all' || t.levelId === levelFilter;
    const matchCategory = categoryFilter === 'all' || t.categoryId === categoryFilter;
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unlocked' && t.isPublished !== false && !t.isLocked) ||
      (statusFilter === 'locked' && t.isLocked === true) ||
      (statusFilter === 'hidden' && t.isPublished === false);

    const sTerm = (search || '').toLowerCase();
    const matchSearch =
      (t.title || '').toLowerCase().includes(sTerm) ||
      (t.description || '').toLowerCase().includes(sTerm);

    return matchLevel && matchCategory && matchStatus && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingTopic(null);
    setTitle('');
    setDescription('');
    setTheme('');
    const defaultLvl = allowedLevels[0]?.id || 'smp-7';
    setLevelId(defaultLvl);
    setCategoryId('expression');
    setIsPublished(true);
    setIsLocked(false);
    setLockMessage('');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Topic) => {
    setEditingTopic(t);
    setTitle(t.title);
    setDescription(t.description);
    setTheme(t.theme || '');
    setLevelId(t.levelId);
    setCategoryId(t.categoryId);
    setIsPublished(t.isPublished !== false);
    setIsLocked(Boolean(t.isLocked));
    setLockMessage(t.lockMessage || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleSaveTopicBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Mohon masukkan Judul Topic.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingTopic) {
        await api.updateTopic(editingTopic.id, {
          title: title.trim(),
          description: description.trim(),
          theme: theme.trim(),
          levelId,
          categoryId,
          isPublished,
          isLocked,
          lockMessage: isLocked ? lockMessage.trim() : '',
        });
      } else {
        await api.createTopic({
          title: title.trim(),
          description: description.trim() || 'Materi pembelajaran Bahasa Inggris',
          theme: theme.trim(),
          levelId,
          categoryId,
          isPublished,
          isLocked,
          lockMessage: isLocked ? lockMessage.trim() : '',
        });
      }

      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan topic.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDuplicate = (t: Topic) => {
    setDuplicatingTopic(t);
    setDupTitle(`${t.title} (Copy)`);
    setDupTheme(t.theme || '');
    setDupTargetLevelId(t.levelId);
    setDupError('');
  };

  const handleConfirmDuplicate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!duplicatingTopic || !dupTitle.trim()) return;

    setDupLoading(true);
    setDupError('');

    try {
      await api.duplicateTopic(duplicatingTopic.id, {
        newTitle: dupTitle.trim(),
        newTheme: dupTheme.trim(),
        targetLevelId: dupTargetLevelId || duplicatingTopic.levelId,
      });
      setDuplicatingTopic(null);
      onRefresh();
    } catch (err: any) {
      setDupError(err.message || 'Gagal menduplikasi topic.');
    } finally {
      setDupLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTopic) return;
    setDeleteLoading(true);
    try {
      await api.deleteTopic(deletingTopic.id);
      setDeletingTopic(null);
      onRefresh();
    } catch (err: any) {
      alert('Gagal menghapus topic: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleLock = async (t: Topic) => {
    try {
      const nextLocked = !t.isLocked;
      await api.updateTopic(t.id, { isLocked: nextLocked });
      onRefresh();
    } catch (err: any) {
      alert('Gagal mengubah status kunci: ' + err.message);
    }
  };

  const handleTogglePublish = async (t: Topic) => {
    try {
      await api.updateTopic(t.id, { isPublished: !t.isPublished });
      onRefresh();
    } catch (err: any) {
      alert('Gagal mengubah status publikasi: ' + err.message);
    }
  };

  const handleOpenMaterialEditor = async (topic: Topic) => {
    setLoadingMaterial(true);
    try {
      const mat = await api.getLearningMaterial(topic.id);
      setCurrentMaterial(mat);
      setEditingMaterialTopic(topic);
    } catch (err: any) {
      alert('Gagal memuat materi: ' + err.message);
    } finally {
      setLoadingMaterial(false);
    }
  };

  if (editingMaterialTopic && currentMaterial) {
    return (
      <LearningMaterialEditor
        topic={editingMaterialTopic}
        material={currentMaterial}
        levels={allowedLevels}
        categories={categories}
        topics={topics}
        onBack={() => setEditingMaterialTopic(null)}
        onSaved={() => {
          onRefresh();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Manajemen Topic & Materi</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Kelola silabus, materi pengayaan, dan duplicate topic antarkelas dengan cepat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="bulk-import-materi-btn"
            onClick={() => {
              setBulkImportTargetTopicId(undefined);
              setBulkImportTargetLevelId(levelFilter !== 'all' ? levelFilter : (allowedLevels[0]?.id || undefined));
              setBulkImportTargetCategoryId(categoryFilter !== 'all' ? categoryFilter : undefined);
              setIsBulkImportOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md shadow-emerald-900/20 transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Quick Import Materi</span>
          </button>

          <button
            id="create-topic-btn"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Topic Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2.5 items-center flex-1 min-w-[280px]">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
            <span>Level:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium bg-gray-50 text-gray-800"
            >
              <option value="all">Semua Level ({allowedLevels.length})</option>
              {allowedLevels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.name} ({lvl.grade})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
            <span>Kategori:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium bg-gray-50 text-gray-800"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter (Kunci / Tampil) */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium bg-gray-50 text-gray-800"
            >
              <option value="all">Semua Status</option>
              <option value="unlocked">🟢 Terbuka (Akses Siswa Aktif)</option>
              <option value="locked">🔒 Terkunci (Siswa Tidak Bisa Masuk)</option>
              <option value="hidden">👁️‍🗨️ Disembunyikan</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama topic..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Topics List Table */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-gray-800">Tidak Ada Topic yang Sesuai Filter</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Coba ubah filter Level, Kategori, atau Status, atau klik "Tambah Topic Baru".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic) => {
            const topicLevel = levels.find((l) => l.id === topic.levelId);
            const topicCategory = categories.find((c) => c.id === topic.categoryId);

            return (
              <div
                key={topic.id}
                id={`topic-card-${topic.id}`}
                className={`bg-white rounded-2xl p-5 border shadow-xs hover:shadow-md transition flex flex-col justify-between ${
                  topic.isLocked
                    ? 'border-amber-200 bg-amber-50/20'
                    : topic.isPublished === false
                    ? 'border-gray-300 bg-gray-50/50'
                    : 'border-gray-200/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {topicLevel?.name || topic.levelId}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700">
                        {topicCategory?.name || topic.categoryId}
                      </span>
                      {topic.theme && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          {topic.theme}
                        </span>
                      )}

                      {/* Status Badges */}
                      {topic.isLocked ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-700" />
                          <span>Terkunci</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Unlock className="w-3 h-3 text-emerald-600" />
                          <span>Terbuka</span>
                        </span>
                      )}

                      {topic.isPublished === false && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-200 text-gray-700 border border-gray-300 flex items-center gap-1">
                          <EyeOff className="w-3 h-3 text-gray-500" />
                          <span>Disembunyikan</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Toggle Lock / Unlock */}
                      <button
                        onClick={() => handleToggleLock(topic)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          topic.isLocked
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                            : 'text-gray-500 hover:bg-gray-100 border border-transparent'
                        }`}
                        title={
                          topic.isLocked
                            ? 'Topic TERKUNCI. Klik untuk BUKA KUNCI (Siswa bisa mengerjakan)'
                            : 'Topic TERBUKA. Klik untuk KUNCI (Siswa tidak bisa mengerjakan)'
                        }
                      >
                        {topic.isLocked ? <Lock className="w-4 h-4 text-amber-700" /> : <Unlock className="w-4 h-4 text-emerald-600" />}
                        <span className="text-[10px] font-bold hidden xl:inline">
                          {topic.isLocked ? 'Buka Kunci' : 'Kunci'}
                        </span>
                      </button>

                      {/* Toggle Publish / Hide */}
                      <button
                        onClick={() => handleTogglePublish(topic)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                          topic.isPublished !== false
                            ? 'text-emerald-700 hover:bg-emerald-50'
                            : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                        }`}
                        title={topic.isPublished !== false ? 'Topic DITAMPILKAN. Klik untuk sembunyikan dari siswa' : 'Topic DISEMBUNYIKAN. Klik untuk tampilkan ke siswa'}
                      >
                        {topic.isPublished !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        <span className="text-[10px] font-bold hidden xl:inline">
                          {topic.isPublished !== false ? 'Tampil' : 'Sembunyi'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-1">{topic.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2">
                    {topic.description}
                  </p>

                  {topic.isLocked && topic.lockMessage && (
                    <div className="mb-3 p-2 rounded-lg bg-amber-100/60 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>Pesan Kunci: <strong>"{topic.lockMessage}"</strong></span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{topic.questionCount || 0} / 30 Soal</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Quick Import 1 Format */}
                    <button
                      onClick={() => {
                        setBulkImportTargetTopicId(topic.id);
                        setBulkImportTargetLevelId(topic.levelId);
                        setBulkImportTargetCategoryId(topic.categoryId);
                        setIsBulkImportOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition cursor-pointer"
                      title="Quick Import 1 Format (Materi & Soal) untuk Topic ini"
                    >
                      <Upload className="w-4 h-4" />
                    </button>

                    {/* Edit Materi */}
                    <button
                      onClick={() => handleOpenMaterialEditor(topic)}
                      disabled={loadingMaterial}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Edit Materi Pembelajaran (Markdown, Vocab, Dialogue)"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Materi</span>
                    </button>

                    {/* Bank Soal */}
                    <button
                      onClick={() =>
                        onOpenQuestionBankForTopic(topic.id, topic.levelId, topic.categoryId)
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Buka Bank Soal untuk Topic ini"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Soal</span>
                    </button>

                    {/* Duplicate Topic */}
                    <button
                      onClick={() => handleOpenDuplicate(topic)}
                      className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700 transition cursor-pointer"
                      title="Duplicate Topic & Soal (Clone)"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Edit Topic Info */}
                    <button
                      onClick={() => handleOpenEdit(topic)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-700 transition cursor-pointer"
                      title="Edit Judul, Pengaturan Kunci & Keterangan"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeletingTopic(topic)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                      title="Hapus Topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT TOPIC MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingTopic ? 'Edit Data Topic' : 'Tambah Topic Baru'}
                </h3>
                <p className="text-xs text-emerald-100">
                  {editingTopic ? 'Perbarui judul, hak akses kunci, dan pengaturan topic' : 'Buat topic baru untuk silabus belajar'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTopicBasic} className="p-6 space-y-4 overflow-y-auto flex-1">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Level Jenjang</label>
                  <select
                    value={levelId}
                    onChange={(e) => setLevelId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white"
                  >
                    {allowedLevels.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori Kompetensi</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white"
                  >
                    {availableModalCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Judul Topic</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Simple Present Tense & Daily Routine"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tema / Sub-Bab (Opsional)</label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Contoh: Unit 1 - Habits and Routine"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Deskripsi singkat tujuan pembelajaran topic ini..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                />
              </div>

              {/* Status Kunci & Publikasi Section */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Pengaturan Akses Siswa & Kunci Topic</span>
                </h4>

                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isLocked}
                      onChange={(e) => setIsLocked(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-800">Kunci Topic ini</span>
                      <span className="text-gray-500 block text-[11px]">
                        Jika dicentang, siswa TIDAK BISA membuka materi atau mengerjakan latihan soal topic ini.
                      </span>
                    </div>
                  </label>

                  {isLocked && (
                    <div className="mt-2 pl-6">
                      <label className="block text-[11px] font-bold text-amber-900 mb-1">
                        Pesan untuk Siswa Saat Terkunci (Opsional)
                      </label>
                      <input
                        type="text"
                        value={lockMessage}
                        onChange={(e) => setLockMessage(e.target.value)}
                        placeholder="Contoh: Belum dibuka oleh guru, silakan selesaikan Bab 1 terlebih dahulu."
                        className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50/50 text-xs text-gray-800 focus:bg-white"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2.5 cursor-pointer select-none pt-2 border-t border-gray-200">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-800">Tampilkan Topic ke Siswa (Publikasi)</span>
                      <span className="text-gray-500 block text-[11px]">
                        Jika tidak dicentang, topic ini disembunyikan sepenuhnya dari daftar siswa.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DUPLICATE TOPIC MODAL */}
      {duplicatingTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-amber-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                  <Copy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Duplicate Topic (Clone)</h3>
                  <p className="text-xs text-amber-100">
                    Gandakan topic, materi, dan 30 soal sekaligus
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDuplicatingTopic(null)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDuplicate} className="p-6 space-y-4">
              {dupError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200">
                  {dupError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Judul Topic Baru</label>
                <input
                  type="text"
                  value={dupTitle}
                  onChange={(e) => setDupTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tema / Sub-Bab</label>
                <input
                  type="text"
                  value={dupTheme}
                  onChange={(e) => setDupTheme(e.target.value)}
                  placeholder="Contoh: Unit 1 Parallel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Salin ke Level Target</label>
                <select
                  value={dupTargetLevelId}
                  onChange={(e) => setDupTargetLevelId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 bg-white"
                >
                  {allowedLevels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Semua materi pembelajaran dan seluruh bank soal yang ada di dalam topic sumber akan otomatis diduplikasi ke topic baru.
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setDuplicatingTopic(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={dupLoading}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {dupLoading ? 'Menduplikasi...' : 'Duplikasi Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deletingTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Hapus Topic?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Apakah Anda yakin ingin menghapus <strong>"{deletingTopic.title}"</strong>? Seluruh materi dan bank soal di dalamnya akan ikut terhapus.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingTopic(null)}
                className="flex-1 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
              >
                {deleteLoading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* BULK IMPORT MATERIAL ONLY MODAL */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        levels={allowedLevels}
        categories={categories}
        topics={topics}
        selectedTopicId={bulkImportTargetTopicId}
        selectedLevelId={bulkImportTargetLevelId}
        selectedCategoryId={bulkImportTargetCategoryId}
        mode="material"
        onSuccess={() => {
          onRefresh();
        }}
      />
    </div>
  );
};
