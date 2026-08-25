import React, { useState, useEffect } from 'react';
import { Level, User, StudentProfile } from '../../types';
import { api } from '../../services/api';
import {
  X,
  Edit3,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  RefreshCw,
  Users,
  Shield,
  GraduationCap,
  Building2,
  Check,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  levels: Level[];
  currentUser: User;
  onSuccess: () => void;
}

export const EditClassModal: React.FC<Props> = ({
  isOpen,
  onClose,
  levels,
  currentUser,
  onSuccess,
}) => {
  const isAdmin = currentUser.role === 'admin';

  // Filter levels editable by currentUser
  const editableLevels = isAdmin
    ? levels
    : levels.filter((l) => currentUser.assignedLevelIds?.includes(l.id));

  // State for form data per level ID
  const [formData, setFormData] = useState<Record<string, { name: string; grade: string; description: string }>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize form data when levels prop changes
  useEffect(() => {
    const init: Record<string, { name: string; grade: string; description: string }> = {};
    levels.forEach((l) => {
      init[l.id] = {
        name: l.name || '',
        grade: l.grade || '',
        description: l.description || '',
      };
    });
    setFormData(init);
  }, [levels]);

  // Fetch uploaded students to display detected class names from DB
  useEffect(() => {
    if (!isOpen) return;
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const data = await api.getStudents();
        setStudents(data || []);
      } catch (err) {
        console.warn('Failed to load student data for class detection:', err);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper to find unique class names from uploaded students for a given levelId
  const getDetectedStudentClasses = (levelId: string): string[] => {
    const matched = students.filter((s) => s.levelId === levelId && s.className);
    const unique = Array.from(new Set(matched.map((s) => s.className.trim())));
    return unique.filter(Boolean);
  };

  const handleInputChange = (levelId: string, field: 'name' | 'grade' | 'description', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [levelId]: {
        ...prev[levelId],
        [field]: value,
      },
    }));
  };

  const handleSaveSingle = async (levelId: string) => {
    const data = formData[levelId];
    if (!data || !data.name.trim()) {
      setErrorMessage('Nama kelas tidak boleh kosong.');
      return;
    }

    setSavingId(levelId);
    setErrorMessage(null);
    setToastMessage(null);

    try {
      await api.updateLevel(levelId, {
        name: data.name.trim(),
        grade: data.grade.trim() || data.name.trim(),
        description: data.description.trim(),
      });

      setToastMessage(`Nama kelas "${data.name.trim()}" berhasil disimpan & disinkronkan!`);
      setEditingId(null);
      onSuccess();
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan pembaruan nama kelas.');
    } finally {
      setSavingId(null);
    }
  };

  const handleApplyStudentClassName = (levelId: string, suggestedName: string) => {
    setFormData((prev) => ({
      ...prev,
      [levelId]: {
        ...prev[levelId],
        name: suggestedName,
        grade: suggestedName,
      },
    }));
    setEditingId(levelId);
    setToastMessage(`Menyarankan nama kelas "${suggestedName}". Klik 'Simpan' untuk memperbarui.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSyncAllFromStudents = async () => {
    setSyncingAll(true);
    setErrorMessage(null);
    setToastMessage(null);

    try {
      const res = await api.syncLevelsFromStudents();
      setToastMessage(res.message || 'Berhasil menyinkronkan nama kelas dari data siswa.');
      onSuccess();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyinkronkan nama kelas dari data siswa.');
    } finally {
      setSyncingAll(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-slate-200 overflow-hidden">
        {/* Header with Periwinkle Blue Pastel Header (#7A93D1) & White Line Divider */}
        <div className="bg-[#7A93D1] text-white p-5 sm:p-6 relative overflow-hidden shrink-0 border-b-2 border-white/80">
          <div className="absolute top-2 left-6 right-6 h-[2px] bg-white/80" />
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold shrink-0 border border-white/40">
                <Edit3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                  Kelola & Edit Nama Kelas
                </h2>
                <p className="text-xs text-white/90 font-medium">
                  {isAdmin
                    ? 'Super Admin: Edit nama kelas seluruh jenjang & sinkronkan dengan data siswa uploaded.'
                    : 'Guru Pengajar: Edit nama kelas khusus jenjang pengajaran Anda.'}
                </p>
              </div>
            </div>

            <button
              id="close-edit-class-modal-btn"
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toolbar & Info Banner */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            {isAdmin ? (
              <span className="px-2.5 py-1 rounded-lg bg-[#7A93D1]/20 text-[#2B3E75] flex items-center gap-1.5 border border-[#7A93D1]/30">
                <Shield className="w-3.5 h-3.5" /> Super Admin Access (14 Kelas)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-[#8CB5D3]/20 text-[#1E4260] flex items-center gap-1.5 border border-[#8CB5D3]/30">
                <GraduationCap className="w-3.5 h-3.5" /> Hak Akses Guru ({editableLevels.length} Kelas)
              </span>
            )}
          </div>

          <button
            id="sync-all-class-names-btn"
            type="button"
            disabled={syncingAll}
            onClick={handleSyncAllFromStudents}
            className="px-4 py-2 rounded-xl bg-[#CBEAD9] hover:brightness-95 text-[#123E2A] text-xs font-black flex items-center gap-2 border border-[#B9E1CB] shadow-2xs transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
            <span>{syncingAll ? 'Memproses Sync...' : '⚡ Sinkron Otomatis dari Data Siswa Uploaded'}</span>
          </button>
        </div>

        {/* Notification Toast Messages */}
        {toastMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Level List Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {editableLevels.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Tidak ada kelas yang dapat Anda edit.</p>
              <p className="text-xs text-slate-500 mt-1">
                Hubungi Super Admin jika Anda memerlukan akses ke jenjang lain.
              </p>
            </div>
          ) : (
            editableLevels.map((lvl) => {
              const currentForm = formData[lvl.id] || { name: lvl.name, grade: lvl.grade, description: lvl.description };
              const detectedClasses = getDetectedStudentClasses(lvl.id);
              const isEditingThis = editingId === lvl.id;
              const isSavingThis = savingId === lvl.id;

              return (
                <div
                  key={lvl.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isEditingThis
                      ? 'bg-amber-50/50 border-amber-300 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Level Identifier Badge */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-xs"
                        style={{ backgroundColor: lvl.color || '#7A93D1' }}
                      >
                        {lvl.id.toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            {lvl.schoolType}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {lvl.id}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 mt-0.5">{lvl.name}</h3>
                      </div>
                    </div>

                    {/* Class Form Inputs */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Nama Kelas (Display Name) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id={`class-name-input-${lvl.id}`}
                          type="text"
                          value={currentForm.name}
                          onChange={(e) => handleInputChange(lvl.id, 'name', e.target.value)}
                          onFocus={() => setEditingId(lvl.id)}
                          placeholder="misal: Kelas 7 Al-Farabi"
                          className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7A93D1] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Label Grade / Jenjang
                        </label>
                        <input
                          id={`class-grade-input-${lvl.id}`}
                          type="text"
                          value={currentForm.grade}
                          onChange={(e) => handleInputChange(lvl.id, 'grade', e.target.value)}
                          onFocus={() => setEditingId(lvl.id)}
                          placeholder="misal: SMP Kelas 7"
                          className="w-full px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7A93D1] bg-white"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        id={`save-class-btn-${lvl.id}`}
                        type="button"
                        disabled={isSavingThis}
                        onClick={() => handleSaveSingle(lvl.id)}
                        className="px-4 py-2 rounded-xl bg-[#7A93D1] hover:brightness-95 text-white text-xs font-black flex items-center gap-1.5 shadow-2xs transition cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {isSavingThis ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>{isSavingThis ? 'Menyimpan...' : 'Simpan'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Detected Class Names from Uploaded Student Database */}
                  {detectedClasses.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#7A93D1]" />
                        <span>Data Siswa Uploaded Terdeteksi:</span>
                      </span>
                      {detectedClasses.map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => handleApplyStudentClassName(lvl.id, cls)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-[11px] border border-emerald-200 flex items-center gap-1 transition cursor-pointer active:scale-95"
                          title="Klik untuk menggunakan nama kelas dari data siswa"
                        >
                          <span>"{cls}"</span>
                          <Check className="w-3 h-3 text-emerald-700" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500 font-medium">
            💡 Semua perubahan nama kelas akan tersinkronisasi secara otomatis di penugasan guru, data siswa, dan filter laporan.
          </p>

          <button
            id="close-edit-class-modal-bottom-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
