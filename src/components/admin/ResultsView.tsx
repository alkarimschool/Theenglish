import React, { useState } from 'react';
import { StudentAttempt, Level, Category, Topic, User } from '../../types';
import {
  Award,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  X,
  Sparkles,
  Calendar,
  RotateCcw,
} from 'lucide-react';

interface Props {
  attempts: StudentAttempt[];
  levels: Level[];
  categories: Category[];
  topics: Topic[];
  currentUser?: User;
}

export const ResultsView: React.FC<Props> = ({ attempts, levels, categories, topics, currentUser }) => {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState<StudentAttempt | null>(null);

  const isTeacher = currentUser?.role === 'teacher';

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

  const filtered = attempts.filter((a) => {
    const sTerm = (search || '').toLowerCase();
    const matchSearch =
      (a.studentName || '').toLowerCase().includes(sTerm) ||
      (a.className || '').toLowerCase().includes(sTerm) ||
      (a.topicTitle || '').toLowerCase().includes(sTerm);
    const matchLevel = levelFilter === 'all' || a.levelId === levelFilter;
    const matchCat = categoryFilter === 'all' || a.categoryId === categoryFilter;
    const matchScore =
      scoreFilter === 'all'
        ? true
        : scoreFilter === 'high'
        ? a.score >= 80
        : scoreFilter === 'medium'
        ? a.score >= 70 && a.score < 80
        : a.score < 70;

    let matchDate = true;
    const attDate = new Date(a.completedAt || a.startedAt);
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (attDate < start) matchDate = false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (attDate > end) matchDate = false;
    }

    return matchSearch && matchLevel && matchCat && matchScore && matchDate;
  });

  const exportCSV = () => {
    const headers = [
      'Waktu Selesai',
      'Nama Siswa',
      'Kelas',
      'Level',
      'Kategori',
      'Topic',
      'Jawaban Benar',
      'Jawaban Salah',
      'Total Soal',
      'Nilai Akhir',
      'Durasi Pengerjaan (Detik)',
    ];

    const rows = filtered.map((a) => [
      `"${new Date(a.completedAt).toLocaleString('id-ID')}"`,
      `"${a.studentName}"`,
      `"${a.className}"`,
      `"${a.levelId}"`,
      `"${a.categoryId}"`,
      `"${a.topicTitle}"`,
      a.correctCount,
      a.incorrectCount,
      a.totalQuestions,
      a.score,
      a.timeElapsedSec || 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateSuffix = startDate && endDate ? `_${startDate}_sd_${endDate}` : `_${new Date().toISOString().slice(0, 10)}`;
    link.setAttribute('download', `hasil_latihan_siswa_alkarim${dateSuffix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Rekap Hasil Belajar Siswa (Tracking Pengerjaan)</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Log lengkap seluruh pengerjaan latihan 50 soal siswa dengan filter tanggal, jenjang, kelas, dan topik.
          </p>
        </div>

        <button
          id="export-results-btn"
          type="button"
          onClick={exportCSV}
          className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span>Export Rekap CSV</span>
        </button>
      </div>

      {/* Filter and Date Range Bar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari siswa, kelas, topic..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-xs font-medium focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <div>
            <select
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800"
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
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800"
            >
              <option value="all">Semua Nilai</option>
              <option value="high">Nilai Tinggi (≥ 80)</option>
              <option value="medium">Nilai Sedang (70 - 79)</option>
              <option value="low">Perlu Remedial (&lt; 70)</option>
            </select>
          </div>
        </div>

        {/* Date Range Section */}
        <div className="pt-3 border-t border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mr-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Tracking Tanggal Pengerjaan:</span>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5">
              <span className="text-[11px] font-semibold text-gray-500">Dari</span>
              <input
                id="filter-results-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5">
              <span className="text-[11px] font-semibold text-gray-500">s.d.</span>
              <input
                id="filter-results-end-date"
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
                Menampilkan pengerjaan soal dari tanggal{' '}
                <strong>{startDate ? new Date(startDate).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : 'Awal'}</strong> s.d.{' '}
                <strong>{endDate ? new Date(endDate).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : 'Sekarang'}</strong> ({filtered.length} Pengerjaan).
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

      {/* Attempts Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 text-gray-600 border-b border-gray-200">
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Tanggal & Waktu</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Nama Siswa</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider">Kelas</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider">Level / Modul</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Topic Pembelajaran</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-center">Akurasi Soal</th>
                <th className="py-3.5 px-3 font-bold uppercase tracking-wider text-center">Durasi</th>
                <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right">Nilai Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    <div className="max-w-xs mx-auto space-y-1">
                      <div className="font-bold text-gray-600">Tidak ada data hasil latihan</div>
                      <div className="text-[11px] text-gray-400">Belum ada siswa yang mengerjakan pada filter & rentang tanggal yang dipilih.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((att) => (
                  <tr
                    key={att.id}
                    onClick={() => setSelectedAttempt(att)}
                    className="hover:bg-emerald-50/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px]">
                      <div>
                        {new Date(att.completedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(att.completedAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })} WIB
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{att.studentName}</td>
                    <td className="py-3.5 px-3 font-semibold text-gray-700">{att.className}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        {att.levelId} • {att.categoryId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">{att.topicTitle}</td>
                    <td className="py-3.5 px-3 text-center font-mono">
                      <span className="text-emerald-700 font-bold">{att.correctCount}</span>
                      <span className="text-gray-400"> / {att.totalQuestions}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center text-gray-500 font-mono text-[11px]">
                      {att.timeElapsedSec ? `${Math.round(att.timeElapsedSec / 60)} m` : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${
                          att.score >= 80
                            ? 'bg-emerald-100 text-emerald-900'
                            : att.score >= 70
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {att.score}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attempt Details Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-emerald-100 p-6 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Rincian Hasil Pengerjaan</h3>
                <p className="text-xs text-gray-500">
                  {new Date(selectedAttempt.completedAt).toLocaleString('id-ID', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Nama Siswa:</span>
                <strong className="text-gray-900 font-bold">{selectedAttempt.studentName}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Kelas:</span>
                <strong className="text-gray-900 font-bold">{selectedAttempt.className}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Level & Modul:</span>
                <span className="font-bold text-emerald-800 uppercase">
                  {selectedAttempt.levelId} • {selectedAttempt.categoryId}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Topic:</span>
                <strong className="text-gray-900 font-bold">{selectedAttempt.topicTitle}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Jawaban Benar:</span>
                <span className="text-emerald-700 font-bold">
                  {selectedAttempt.correctCount} / {selectedAttempt.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">Jawaban Salah:</span>
                <span className="text-rose-700 font-bold">
                  {selectedAttempt.incorrectCount} / {selectedAttempt.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="text-sm font-bold text-gray-800">Nilai Skor:</span>
                <span className="text-2xl font-black text-emerald-800">{selectedAttempt.score} / 100</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 text-right">
              <button
                onClick={() => setSelectedAttempt(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

