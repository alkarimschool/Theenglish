import React, { useState } from 'react';
import { User, Level } from '../../types';
import { api } from '../../services/api';
import {
  GraduationCap,
  Plus,
  Edit2,
  Edit3,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Key,
  X,
  Search,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface Props {
  teachers: User[];
  levels: Level[];
  onRefresh: () => void;
  onOpenEditClass?: () => void;
}

const ALL_CLASSES_BY_LEVEL = [
  {
    levelId: 'tk',
    levelName: 'Jenjang TK (Taman Kanak-Kanak)',
    badgeBg: 'bg-pink-50 text-pink-900 border-pink-200',
    classes: [
      'TK A Patimura',
      'TK B Diponegoro',
      'TK B Jendral Sudirman',
      'TK B Pangeran Antasari',
    ],
  },
  {
    levelId: 'sd',
    levelName: 'Jenjang SD (Sekolah Dasar)',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    classes: [
      'Kelas 1 Abu Bakar',
      'Kelas 1 Umar Bin Khattab',
      'Kelas 2 Ali Bin Abi Thalib',
      'Kelas 2 Thalhah bin Ubaidillah',
      'Kelas 2 Utsman bin Affan',
      'Kelas 3 Abdurrahman Bin Auf',
      'Kelas 3 Bilal Bin Rabah',
      'Kelas 3 Khalid Bin Walid',
      'Kelas 4 Muadz Bin Jabbal',
      'Kelas 4 Said Bin Zaid',
      'Kelas 4 Zubair Bin Awwam',
      'Kelas 5 Hamzah bin Abdul Muthalib',
      'Kelas 5 Hudzaifah Bin Al Yaman',
      'Kelas 5 Saad Bin Abi Waqqash',
      'Kelas 6 Abu Ubaidah Bin Al-Jarrah',
      'Kelas 6 Amr Bin Ash',
      'Kelas 6 Anas Bin Malik',
    ],
  },
  {
    levelId: 'smp',
    levelName: 'Jenjang SMP (Sekolah Menengah Pertama)',
    badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    classes: [
      'Kelas 7 Salman Alfarisi',
      'Kelas 8 Abu Hurairah',
      'Kelas 8 Mushab Bin Umair',
      'Kelas 9 Amr bin Yasir',
    ],
  },
  {
    levelId: 'sma',
    levelName: 'Jenjang SMA (Sekolah Menengah Atas)',
    badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
    classes: [
      'Kelas 10 Muhammad Al-Fatih',
      'Kelas 11 Thariq bin Ziyad',
      'Kelas 12 Salahudin Al-Ayyubi',
    ],
  },
];

export const TeacherManagement: React.FC<Props> = ({ teachers, levels, onRefresh, onOpenEditClass }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);

  // Delete modal state
  const [teacherToDelete, setTeacherToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [assignedClasses, setAssignedClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filteredTeachers = teachers.filter(
    (t) => {
      const sTerm = (search || '').toLowerCase();
      return (
        (t.name || '').toLowerCase().includes(sTerm) ||
        (t.username || '').toLowerCase().includes(sTerm)
      );
    }
  );

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setAssignedClasses(['Kelas 7 Salman Alfarisi', 'Kelas 8 Abu Hurairah']);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: User) => {
    setEditingTeacher(t);
    setName(t.name);
    setEmail(t.email);
    setUsername(t.username);
    setPassword('');

    if (t.assignedClasses && t.assignedClasses.length > 0) {
      setAssignedClasses(t.assignedClasses);
    } else if (t.assignedLevelIds && t.assignedLevelIds.length > 0) {
      const mapped = ALL_CLASSES_BY_LEVEL
        .filter((g) => t.assignedLevelIds.includes(g.levelId))
        .flatMap((g) => g.classes);
      setAssignedClasses(mapped);
    } else {
      setAssignedClasses([]);
    }

    setError('');
    setIsModalOpen(true);
  };

  const toggleClass = (clsName: string) => {
    if (assignedClasses.includes(clsName)) {
      setAssignedClasses(assignedClasses.filter((c) => c !== clsName));
    } else {
      setAssignedClasses([...assignedClasses, clsName]);
    }
  };

  const toggleGroupClasses = (groupClasses: string[]) => {
    const allSelected = groupClasses.every((c) => assignedClasses.includes(c));
    if (allSelected) {
      setAssignedClasses(assignedClasses.filter((c) => !groupClasses.includes(c)));
    } else {
      setAssignedClasses(Array.from(new Set([...assignedClasses, ...groupClasses])));
    }
  };

  const selectAll28Classes = () => {
    const all = ALL_CLASSES_BY_LEVEL.flatMap((g) => g.classes);
    setAssignedClasses(all);
  };

  const clearAllClasses = () => {
    setAssignedClasses([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      setError('Mohon lengkapi Nama dan Username.');
      return;
    }
    if (!editingTeacher && !password.trim()) {
      setError('Mohon isi Password awal untuk guru baru.');
      return;
    }
    if (assignedClasses.length === 0) {
      setError('Pilih minimal satu kelas pengajaran yang ditugaskan.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingTeacher) {
        await api.updateTeacher(editingTeacher.id, {
          name: name.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim(),
          assignedClasses: assignedClasses,
          password: password.trim() ? password.trim() : undefined,
        });
      } else {
        await api.createTeacher({
          name: name.trim(),
          email: email.trim(),
          username: username.trim().toLowerCase(),
          password: password.trim(),
          assignedClasses: assignedClasses,
        });
      }

      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data guru.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromptDelete = (teacher: User) => {
    setDeleteError('');
    setTeacherToDelete(teacher);
  };

  const handleConfirmDelete = async () => {
    if (!teacherToDelete) return;
    setIsDeleting(true);
    setDeleteError('');

    try {
      await api.deleteTeacher(teacherToDelete.id);
      setTeacherToDelete(null);
      onRefresh();
    } catch (err: any) {
      setDeleteError(err.message || 'Gagal menghapus akun guru.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (teacher: User) => {
    const nextActive = !teacher.isActive;
    try {
      await api.updateTeacher(teacher.id, { isActive: nextActive, status: nextActive ? 'active' : 'inactive' });
      onRefresh();
    } catch (err: any) {
      alert('Gagal mengubah status guru: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manajemen Akun Guru</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Atur akun guru pengajar dan batasi hak akses jenjang kelas yang mereka ampu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenEditClass && (
            <button
              id="teacher-mg-edit-class-btn"
              type="button"
              onClick={onOpenEditClass}
              className="px-4 py-2.5 rounded-xl bg-[#E5B5C8] hover:brightness-95 text-[#4A1E2F] text-xs font-black flex items-center gap-2 cursor-pointer shadow-2xs border border-white/80 transition active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Nama Kelas</span>
            </button>
          )}

          <button
            id="add-teacher-btn"
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-700/15"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Guru Baru</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau username guru..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
        />
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">{teacher.name}</h3>
                    <div className="text-[11px] text-gray-500 font-mono">@{teacher.username}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(teacher)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                    teacher.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {teacher.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>

              {teacher.email && (
                <div className="text-xs text-gray-600 mb-3">{teacher.email}</div>
              )}

              {/* Assigned Classes */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">
                    Hak Akses Pengajaran Per Kelas:
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {teacher.role === 'admin'
                      ? 'Seluruh 28 Kelas'
                      : `${teacher.assignedClasses?.length || teacher.assignedLevelIds?.length || 0} Kelas`}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                  {teacher.role === 'admin' ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#7A93D1]/20 text-[#2B3E75] border border-[#7A93D1]/30">
                      Super Admin Access (Seluruh Kelas)
                    </span>
                  ) : teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                    teacher.assignedClasses.map((cls) => (
                      <span
                        key={cls}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200"
                      >
                        {cls}
                      </span>
                    ))
                  ) : teacher.assignedLevelIds && teacher.assignedLevelIds.length > 0 ? (
                    teacher.assignedLevelIds.map((lvl) => (
                      <span
                        key={lvl}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-800 uppercase"
                      >
                        Jenjang {lvl}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">Belum Ditugaskan</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                id={`edit-teacher-btn-${teacher.id}`}
                type="button"
                onClick={() => handleOpenEdit(teacher)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit / Hak Akses Kelas</span>
              </button>

              {teacher.role === 'admin' || teacher.username === 'admin' ? (
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                  Super Admin Utama
                </span>
              ) : (
                <button
                  id={`delete-teacher-btn-${teacher.id}`}
                  type="button"
                  onClick={() => handlePromptDelete(teacher)}
                  className="px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-transparent hover:border-rose-200 cursor-pointer flex items-center gap-1 text-xs font-semibold transition"
                  title={`Hapus akun guru ${teacher.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-rose-100 p-6 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900">Konfirmasi Hapus Guru</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Apakah Anda yakin ingin menghapus akun pengajar ini dari sistem?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs space-y-1">
              <div className="font-bold text-rose-950 text-sm">{teacherToDelete.name}</div>
              <div className="text-rose-800 font-mono text-[11px]">Username: @{teacherToDelete.username}</div>
              <div className="text-[11px] text-rose-700 mt-1">
                Hak Kelas: {teacherToDelete.assignedClasses?.join(', ') || teacherToDelete.assignedLevelIds?.join(', ') || 'Semua Kelas'}
              </div>
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-100 text-rose-800 text-xs rounded-xl border border-rose-200">
                {deleteError}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                id="cancel-delete-teacher-btn"
                type="button"
                disabled={isDeleting}
                onClick={() => setTeacherToDelete(null)}
                className="px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                id="confirm-delete-teacher-btn"
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus Akun</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {editingTeacher ? 'Edit Data & Hak Akses Kelas Guru' : 'Tambah Guru Pengampu Baru'}
                </h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Tentukan kelas spesifik yang dapat diakses dan dikelola oleh guru ini.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/80 hover:text-white rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Ustadz Rian, S.Pd."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email (Opsional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rian@alkarim.sch.id"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Username Login {editingTeacher && <span className="text-emerald-600 font-normal">(Bisa diganti)</span>}
                  </label>
                  <input
                    id="teacher-username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: ustadz_rian / guru7"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {editingTeacher ? 'Reset Password (Kosongkan jika tetap)' : 'Password Awal'}
                  </label>
                  <input
                    id="teacher-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={!editingTeacher}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Multi Class Selection Grid per Level */}
              <div className="pt-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-black text-slate-900">
                      Pilihan Hak Akses Pengajaran PER KELAS:
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Pilih kelas-kelas spesifik yang dapat diampu oleh guru ini ({assignedClasses.length} dari 28 kelas terpilih).
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAll28Classes}
                      className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 hover:bg-emerald-200 text-[11px] font-bold cursor-pointer transition"
                    >
                      Pilih Semua (28)
                    </button>
                    <button
                      type="button"
                      onClick={clearAllClasses}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 text-[11px] font-bold cursor-pointer transition"
                    >
                      Bersihkan
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                  {ALL_CLASSES_BY_LEVEL.map((grp) => {
                    const selectedInGroupCount = grp.classes.filter((c) => assignedClasses.includes(c)).length;
                    const isAllInGroup = selectedInGroupCount === grp.classes.length;

                    return (
                      <div key={grp.levelId} className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                        <div className={`px-4 py-2.5 ${grp.badgeBg} flex items-center justify-between border-b`}>
                          <span className="font-black text-xs">{grp.levelName}</span>
                          <button
                            type="button"
                            onClick={() => toggleGroupClasses(grp.classes)}
                            className="px-2.5 py-0.5 rounded-md bg-white/80 hover:bg-white text-[10px] font-bold shadow-2xs cursor-pointer transition"
                          >
                            {isAllInGroup ? 'Batalkan Semua' : `Pilih Semua (${grp.classes.length})`}
                          </button>
                        </div>

                        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {grp.classes.map((clsName) => {
                            const isChecked = assignedClasses.includes(clsName);
                            return (
                              <button
                                key={clsName}
                                type="button"
                                onClick={() => toggleClass(clsName)}
                                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer flex items-center justify-between ${
                                  isChecked
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-2xs ring-1 ring-emerald-400'
                                    : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span>{clsName}</span>
                                {isChecked && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
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
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Akun Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
