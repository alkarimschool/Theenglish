import React, { useState } from 'react';
import { StudentProgress, Level, StudentAttempt, User } from '../../types';
import { api } from '../../services/api';
import { ImportStudentsModal } from './ImportStudentsModal';
import {
  Search,
  Filter,
  Download,
  Users,
  Award,
  CheckCircle2,
  Clock,
  ChevronRight,
  X,
  Sparkles,
  Shield,
  GraduationCap,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckSquare,
  Square,
  Calendar,
  RotateCcw,
  FileSpreadsheet,
  PlusCircle,
} from 'lucide-react';

interface Props {
  progressList: StudentProgress[];
  levels: Level[];
  attempts: StudentAttempt[];
  currentUser?: User;
  onRefresh?: () => void;
  onOpenImportStudents?: () => void;
}

export const StudentProgressTable: React.FC<Props> = ({
  progressList,
  levels,
  attempts,
  currentUser,
  onRefresh,
  onOpenImportStudents,
}) => {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);

  // Selection state for bulk delete
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Delete modal state
  const [studentToDelete, setStudentToDelete] = useState<StudentProgress | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Import Modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const isTeacher = currentUser?.role === 'teacher';

  // Extract unique class names for filter
  const uniqueClasses = Array.from(
    new Set(progressList.map((p) => p.className).filter(Boolean))
  ).sort();

  // Helper getters for robust id and name
  const getStdId = (p: StudentProgress | any): string => p.id || p.studentId || '';
  const getStdName = (p: StudentProgress | any): string => p.name || p.studentName || 'Tanpa Nama';

  const setDatePreset = (preset: 'today' | '7days' | 'month' | 'all') => {
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    if (preset === 'today') {
      const todayStr = formatDate(today);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === '7days') {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      setStartDate(formatDate(past));
      setEndDate(formatDate(today));
    } else if (preset === 'month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(formatDate(firstDay));
      setEndDate(formatDate(today));
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

  const filtered = progressList.filter((p) => {
    const sTerm = (search || '').toLowerCase();
    const name = getStdName(p).toLowerCase();
    const cls = (p.className || '').toLowerCase();
    const matchSearch = name.includes(sTerm) || cls.includes(sTerm);
    const matchLevel = levelFilter === 'all' || p.levelId === levelFilter;
    const matchClass = classFilter === 'all' || p.className === classFilter;

    // Date range filter against student lastActive or student attempts
    let matchDate = true;
    if (startDate || endDate) {
      const studentNameLower = getStdName(p).toLowerCase();
      const stdId = getStdId(p);
      const studentAttempts = attempts.filter(
        (a) => (a.studentId && a.studentId === stdId) || (a.studentName || '').toLowerCase() === studentNameLower
      );

      if (studentAttempts.length > 0) {
        // Match if at least one attempt falls in the date range
        const hasAttemptInRange = studentAttempts.some((att) => {
          const attDate = new Date(att.completedAt || att.startedAt);
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (attDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (attDate > end) return false;
          }
          return true;
        });
        matchDate = hasAttemptInRange;
      } else if (p.lastActive) {
        const lastActiveDate = new Date(p.lastActive);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (lastActiveDate < start) matchDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (lastActiveDate > end) matchDate = false;
        }
      } else {
        matchDate = false;
      }
    }

    return matchSearch && matchLevel && matchClass && matchDate;
  });

  const getStudentAttempts = (student: StudentProgress | any) => {
    const sName = getStdName(student).toLowerCase();
    const sId = getStdId(student);
    let studentAttempts = attempts.filter(
      (a) => (sId && a.studentId === sId) || (a.studentName || '').toLowerCase() === sName
    );

    if (startDate || endDate) {
      studentAttempts = studentAttempts.filter((att) => {
        const attDate = new Date(att.completedAt || att.startedAt);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (attDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (attDate > end) return false;
        }
        return true;
      });
    }

    return studentAttempts;
  };

  const renderCategoryBadge = (score: number | null | undefined) => {
    if (score === null || score === undefined) {
      return (
        <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-gray-100 text-gray-400">
          -
        </span>
      );
    }
    const color =
      score >= 80
        ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
        : score >= 70
        ? 'bg-amber-100 text-amber-900 border-amber-200'
        : 'bg-rose-100 text-rose-900 border-rose-200';
    return (
      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${color}`}>
        {score}
      </span>
    );
  };

  const toggleSelectStudent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const allFilteredIds = filtered.map((s) => getStdId(s)).filter(Boolean);
    if (selectedStudentIds.length === allFilteredIds.length && allFilteredIds.length > 0) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(allFilteredIds);
    }
  };

  // Single delete handler
  const handlePromptDeleteSingle = (student: StudentProgress, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteError('');
    setActionSuccess('');
    setStudentToDelete(student);
  };

  const handleConfirmDeleteSingle = async () => {
    if (!studentToDelete) return;
    const targetId = getStdId(studentToDelete) || getStdName(studentToDelete);
    if (!targetId) {
      setDeleteError('ID siswa tidak valid.');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');
    try {
      await api.deleteStudent(targetId);
      setSelectedStudentIds((prev) => prev.filter((id) => id !== getStdId(studentToDelete)));
      if (getStdId(selectedStudent) === getStdId(studentToDelete)) {
        setSelectedStudent(null);
      }
      const deletedName = getStdName(studentToDelete);
      setStudentToDelete(null);
      setActionSuccess(`Data siswa "${deletedName}" dan riwayat nilainya berhasil dihapus.`);
      setTimeout(() => setActionSuccess(''), 4000);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setDeleteError(err.message || 'Gagal menghapus data siswa.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk delete handler
  const handleConfirmBulkDelete = async () => {
    if (selectedStudentIds.length === 0) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const count = await api.bulkDeleteStudents(selectedStudentIds);
      if (selectedStudent && selectedStudentIds.includes(getStdId(selectedStudent))) {
        setSelectedStudent(null);
      }
      setSelectedStudentIds([]);
      setIsBulkDeleteModalOpen(false);
      setActionSuccess(`Berhasil menghapus ${count || selectedStudentIds.length} data siswa.`);
      setTimeout(() => setActionSuccess(''), 4000);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setDeleteError(err.message || 'Gagal menghapus siswa terpilih.');
    } finally {
      setIsDeleting(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      'Nama Siswa',
      'Kelas',
      'Level',
      'Expression',
      'Vocabulary',
      'Dialogue',
      'Speech',
      'Grammar',
      'Rata-rata Nilai',
      'Terakhir Aktif',
    ];

    const rows = filtered.map((p) => {
      const name = getStdName(p);
      const vocab = p.categoryScores['vocabulary'] ?? p.categoryScores['vocab'] ?? '-';
      const expr = p.categoryScores['expression'] ?? '-';
      const dial = p.categoryScores['dialogue'] ?? '-';
      const spch = p.categoryScores['speech'] ?? '-';
      const grmr = p.categoryScores['grammar'] ?? '-';
      return [
        `"${name}"`,
        `"${p.className || '-'}"`,
        `"${p.levelId || '-'}"`,
        expr,
        vocab,
        dial,
        spch,
        grmr,
        p.averageScore || 0,
        p.lastActive ? `"${new Date(p.lastActive).toLocaleString()}"` : '-',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateSuffix = startDate && endDate ? `_${startDate}_sd_${endDate}` : `_${new Date().toISOString().slice(0, 10)}`;
    link.setAttribute('download', `rekap_nilai_siswa_alkarim${dateSuffix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Action Success Toast */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="p-1 hover:bg-emerald-200/50 rounded-lg cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Controls */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Data & Progress Siswa</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Pantau capaian nilai 5 modul kompetensi, tracking tanggal pengerjaan siswa, dan kelola data siswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedStudentIds.length > 0 && (
            <button
              id="bulk-delete-student-btn"
              type="button"
              onClick={() => {
                setDeleteError('');
                setIsBulkDeleteModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-2xs"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Hapus {selectedStudentIds.length} Siswa Terpilih</span>
            </button>
          )}

          <button
            id="import-student-excel-btn"
            type="button"
            onClick={() => {
              if (onOpenImportStudents) {
                onOpenImportStudents();
              } else {
                setIsImportModalOpen(true);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 cursor-pointer transition shadow-sm active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Import Siswa (Excel)</span>
          </button>

          <button
            id="export-student-csv-btn"
            type="button"
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-2xs"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Date Range Bar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              id="search-student-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau kelas siswa..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <div>
            <select
              id="filter-student-level"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800"
            >
              <option value="all">
                {isTeacher ? `Semua Jenjang Ditugaskan (${levels.map((l) => l.name).join(', ')})` : 'Semua Level (TK, SD, SMP, SMA)'}
              </option>
              {levels.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              id="filter-student-class"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800"
            >
              <option value="all">Semua Kelas</option>
              {uniqueClasses.map((c) => (
                <option key={c} value={c}>
                  Kelas {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range Tracking Section */}
        <div className="pt-3 border-t border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mr-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Tracking Tanggal:</span>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5">
              <span className="text-[11px] font-semibold text-gray-500">Dari</span>
              <input
                id="filter-student-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5">
              <span className="text-[11px] font-semibold text-gray-500">s.d.</span>
              <input
                id="filter-student-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer"
              />
            </div>

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => setDatePreset('all')}
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition"
                title="Reset Rentang Tanggal"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-gray-400 mr-1">Preset:</span>
            <button
              type="button"
              onClick={() => setDatePreset('today')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                startDate === new Date().toISOString().split('T')[0] && endDate === new Date().toISOString().split('T')[0]
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setDatePreset('7days')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition"
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={() => setDatePreset('month')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition"
            >
              Bulan Ini
            </button>
            <button
              type="button"
              onClick={() => setDatePreset('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                !startDate && !endDate
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Semua
            </button>
          </div>
        </div>

        {(startDate || endDate) && (
          <div className="px-3.5 py-2 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                Menampilkan siswa yang aktif/mengerjakan dari tanggal{' '}
                <strong>{startDate ? new Date(startDate).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : 'Awal'}</strong> s.d.{' '}
                <strong>{endDate ? new Date(endDate).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : 'Sekarang'}</strong> ({filtered.length} Siswa).
              </span>
            </div>
            <button
              onClick={() => setDatePreset('all')}
              className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Hapus Filter
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-600 border-b border-gray-200">
                <th className="py-3.5 pl-4 pr-2 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-gray-400 hover:text-emerald-700 cursor-pointer"
                    title={selectedStudentIds.length === filtered.length && filtered.length > 0 ? 'Batal pilih semua' : 'Pilih semua'}
                  >
                    {filtered.length > 0 && selectedStudentIds.length === filtered.length ? (
                      <CheckSquare className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider">Nama Siswa</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider">Kelas</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider">Level</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-center">Expression</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-center">Vocabulary</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-center">Dialogue</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-center">Speech</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-center">Grammar</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-center">Rata-Rata</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-gray-400">
                    <div className="max-w-xs mx-auto space-y-1">
                      <div className="font-bold text-gray-600">Tidak ada data siswa ditemukan</div>
                      <div className="text-[11px] text-gray-400">Coba sesuaikan kata kunci pencarian atau rentang tanggal.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((student) => {
                  const stdId = getStdId(student);
                  const stdName = getStdName(student);
                  const isSelected = selectedStudentIds.includes(stdId);
                  const vocabScore = student.categoryScores['vocabulary'] ?? student.categoryScores['vocab'];

                  return (
                    <tr
                      key={stdId || stdName}
                      onClick={() => setSelectedStudent(student)}
                      className={`hover:bg-emerald-50/40 transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-50/60' : ''
                      }`}
                    >
                      <td className="py-3.5 pl-4 pr-2 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => toggleSelectStudent(stdId, e)}
                          className="text-gray-400 hover:text-emerald-700 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-gray-900 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {stdName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-bold text-gray-900">{stdName}</div>
                          {student.lastActive && (
                            <div className="text-[10px] text-gray-400 font-normal">
                              Aktif: {new Date(student.lastActive).toLocaleDateString('id-ID')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-gray-700">{student.className || '-'}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                          {student.levelId || '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {renderCategoryBadge(student.categoryScores['expression'])}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {renderCategoryBadge(vocabScore)}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {renderCategoryBadge(student.categoryScores['dialogue'])}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {renderCategoryBadge(student.categoryScores['speech'])}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {renderCategoryBadge(student.categoryScores['grammar'])}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="text-sm font-black text-emerald-800">{student.averageScore ?? 0}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`view-student-btn-${stdId}`}
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            className="px-2.5 py-1 rounded-lg text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold cursor-pointer transition flex items-center gap-1"
                            title="Lihat Detail Riwayat"
                          >
                            <span>Detail</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            id={`delete-student-btn-${stdId}`}
                            type="button"
                            onClick={(e) => handlePromptDeleteSingle(student, e)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition"
                            title={`Hapus siswa ${stdName}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Single Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-rose-100 p-6 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900">Hapus Data Siswa</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data siswa ini beserta semua riwayat pengerjaan soal & nilainya?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs space-y-1">
              <div className="font-bold text-rose-950 text-sm">{getStdName(studentToDelete)}</div>
              <div className="text-rose-800 text-[11px]">
                Kelas: {studentToDelete.className || '-'} • Jenjang: {(studentToDelete.levelId || '').toUpperCase()}
              </div>
              <div className="text-rose-700 text-[11px]">
                Rata-rata Nilai: {studentToDelete.averageScore ?? 0} / 100
              </div>
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-100 text-rose-800 text-xs rounded-xl border border-rose-200 font-semibold">
                {deleteError}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                id="cancel-delete-student-btn"
                type="button"
                disabled={isDeleting}
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                id="confirm-delete-student-btn"
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDeleteSingle}
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
                    <span>Ya, Hapus Siswa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-rose-100 p-6 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900">Hapus Massal Data Siswa</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Anda akan menghapus <strong>{selectedStudentIds.length} data siswa</strong> terpilih beserta seluruh riwayat pengerjaan soal mereka.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-100 text-rose-800 text-xs rounded-xl border border-rose-200 font-semibold">
                {deleteError}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                id="cancel-bulk-delete-student-btn"
                type="button"
                disabled={isDeleting}
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                id="confirm-bulk-delete-student-btn"
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmBulkDelete}
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
                    <span>Ya, Hapus {selectedStudentIds.length} Siswa</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl border border-emerald-100 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-lg font-bold">
                  {getStdName(selectedStudent).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{getStdName(selectedStudent)}</h3>
                  <p className="text-xs text-emerald-100">
                    Kelas {selectedStudent.className || '-'} • {(selectedStudent.levelId || '').toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-white/80 hover:text-white rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Category Scores Overview */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Penguasaan 5 Modul Kompetensi:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'expression', label: 'Expression' },
                    { key: 'vocab', label: 'Vocabulary' },
                    { key: 'dialogue', label: 'Dialogue' },
                    { key: 'speech', label: 'Speech' },
                    { key: 'grammar', label: 'Grammar' },
                  ].map(({ key, label }) => {
                    const score =
                      key === 'vocab'
                        ? selectedStudent.categoryScores['vocabulary'] ?? selectedStudent.categoryScores['vocab']
                        : selectedStudent.categoryScores[key];
                    return (
                      <div key={key} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                        <div className="text-[11px] text-gray-500 font-medium">{label}</div>
                        <div className="text-lg font-black text-emerald-900 mt-1">
                          {score !== null && score !== undefined ? score : '-'}
                        </div>
                      </div>
                    );
                  })}
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <div className="text-[11px] text-emerald-700 font-bold">Rata-Rata Total</div>
                    <div className="text-xl font-black text-emerald-900 mt-0.5">
                      {selectedStudent.averageScore ?? 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* History of Attempts for this student */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Riwayat Latihan Soal yang Pernah Diselesaikan:
                  </h4>
                  {(startDate || endDate) && (
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Difilter tanggal
                    </span>
                  )}
                </div>
                {(() => {
                  const studentHistory = getStudentAttempts(selectedStudent);
                  if (studentHistory.length === 0) {
                    return (
                      <div className="p-4 text-center text-xs text-gray-400 bg-gray-50 rounded-xl">
                        Belum ada riwayat pengerjaan latihan tercatat untuk rentang ini.
                      </div>
                    );
                  }
                  return (
                    <div className="space-y-2.5 max-h-60 overflow-y-auto">
                      {studentHistory.map((att) => (
                        <div
                          key={att.id}
                          className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-gray-900">{att.topicTitle}</div>
                            <div className="text-[11px] text-gray-500">
                              {att.categoryId.toUpperCase()} •{' '}
                              {new Date(att.completedAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}{' '}
                              ({att.timeElapsedSec ? `${Math.round(att.timeElapsedSec / 60)} mnt` : '-'})
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-emerald-800">{att.score} / 100</div>
                            <div className="text-[10px] text-gray-500">
                              {att.correctCount}/{att.totalQuestions} Benar
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  const s = selectedStudent;
                  setSelectedStudent(null);
                  handlePromptDeleteSingle(s, e);
                }}
                className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Siswa Ini</span>
              </button>

              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Students Modal */}
      <ImportStudentsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        levels={levels}
        currentUser={currentUser}
        onSuccess={() => {
          setIsImportModalOpen(false);
          setActionSuccess('Data siswa berhasil diimpor!');
          setTimeout(() => setActionSuccess(''), 4000);
          if (onRefresh) onRefresh();
        }}
      />
    </div>
  );
};

