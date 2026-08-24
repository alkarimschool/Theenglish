import React from 'react';
import { DashboardStats, Level, Category, StudentProgress, User } from '../../types';
import {
  BarChart3,
  TrendingUp,
  Printer,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  BookOpen,
  School,
  GraduationCap,
} from 'lucide-react';

interface Props {
  stats: DashboardStats;
  levels: Level[];
  categories: Category[];
  progressList: StudentProgress[];
  currentUser?: User;
}

export const ReportsView: React.FC<Props> = ({ stats, levels, categories, progressList, currentUser }) => {
  const isTeacher = currentUser?.role === 'teacher';

  const handlePrint = () => {
    window.print();
  };

  // Calculate average scores per category across all students
  const categoryStats = categories.map((cat) => {
    const scores = progressList
      .map((p) => p.categoryScores[cat.id])
      .filter((s): s is number => s !== null && s !== undefined);

    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return {
      ...cat,
      studentCount: scores.length,
      avgScore: avg,
    };
  });

  // Calculate class comparisons
  const classMap = new Map<string, number[]>();
  progressList.forEach((p) => {
    if (!classMap.has(p.className)) classMap.set(p.className, []);
    classMap.get(p.className)?.push(p.averageScore);
  });

  const classRankings = Array.from(classMap.entries())
    .map(([className, scores]) => ({
      className,
      studentCount: scores.length,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Laporan Evaluasi & Statistik Pembelajaran</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isTeacher
              ? `Analisis capaian kompetensi Bahasa Inggris khusus jenjang pengajaran Anda: ${levels.map((l) => l.name).join(', ')}.`
              : 'Analisis capaian kompetensi Bahasa Inggris siswa Sekolah Alam Al-Karim (Semua Jenjang).'}
          </p>
        </div>

        <button
          id="print-report-btn"
          type="button"
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-700/15"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan PDF Laporan</span>
        </button>
      </div>

      {/* Printable Report Summary Container */}
      <div className="print-area space-y-6">
        {/* Top Metric Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs text-center">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-gray-900">{stats.totalStudents}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Total Siswa Aktif</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs text-center">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-2 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-emerald-700">{stats.averageScore} / 100</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Rata-Rata Nilai Sekolah</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs text-center">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-amber-900">{stats.completionRate}%</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Tingkat Ketuntasan Materi</div>
          </div>
        </div>

        {/* 5 Competencies Performance Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Rata-Rata Capaian Tiap Modul Kompetensi</span>
          </h3>

          <div className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800">
                    Modul {cat.order}: {cat.name} ({cat.studentCount} Siswa)
                  </span>
                  <span className="font-black text-emerald-800 text-sm">{cat.avgScore} / 100</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, cat.avgScore)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Rankings Table */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Peringkat Capaian Berdasarkan Kelas</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-semibold">Peringkat</th>
                  <th className="pb-3 font-semibold">Kelas</th>
                  <th className="pb-3 font-semibold text-center">Jumlah Siswa</th>
                  <th className="pb-3 font-semibold text-right">Rata-Rata Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {classRankings.map((cr, idx) => (
                  <tr key={cr.className}>
                    <td className="py-3 font-bold text-gray-400">
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-gray-900">Kelas {cr.className}</td>
                    <td className="py-3 text-center text-gray-600">{cr.studentCount} orang</td>
                    <td className="py-3 text-right font-black text-sm text-emerald-800">{cr.avgScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
