import React from 'react';
import { DashboardStats, User, Level } from '../../types';
import {
  Users,
  GraduationCap,
  BookOpen,
  HelpCircle,
  Award,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  Upload,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  stats: DashboardStats;
  currentUser: User;
  levels: Level[];
  onNavigate: (tab: string) => void;
  onOpenBulkImport?: () => void;
  onOpenImportStudents?: () => void;
}

export const DashboardOverview: React.FC<Props> = ({
  stats,
  currentUser,
  levels,
  onNavigate,
  onOpenImportStudents,
}) => {
  const isTeacher = currentUser.role === 'teacher';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F214A] via-indigo-950 via-teal-950 to-[#0F214A] text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-950/20 relative overflow-hidden border-2 border-indigo-800/40">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-400 via-teal-400 to-purple-500" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold mb-2.5 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isTeacher ? 'Teacher Control Center' : 'Super Admin Management Center'}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Assalamu’alaikum, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              {isTeacher
                ? `Anda memiliki akses pengajaran untuk jenjang: ${
                    levels.map((l) => l.name).join(', ') || 'Jenjang Ditugaskan'
                  }.`
                : 'Pusat kontrol kurikulum, pengelolaan guru, bank soal, dan evaluasi capaian siswa Sekolah Alam Al-Karim.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenImportStudents && (
              <button
                id="dash-quick-import-students-btn"
                type="button"
                onClick={onOpenImportStudents}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition cursor-pointer active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-900" />
                <span>Import Siswa (Excel)</span>
              </button>
            )}

            <button
              id="dash-quick-topic-btn"
              type="button"
              onClick={() => onNavigate('topics')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Kelola Materi</span>
            </button>

            <button
              id="dash-quick-questions-btn"
              type="button"
              onClick={() => onNavigate('questions')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Lihat Bank Soal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Primary Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {!isTeacher && (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-[11px] font-bold uppercase text-gray-500">Guru</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900">{stats.totalTeachers}</div>
              <div className="text-[10px] text-gray-500 font-medium">Akun Pengajar</div>
            </div>
          </div>
        )}

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase text-gray-500">Siswa Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.totalStudents}</div>
            <div className="text-[10px] text-gray-500 font-medium">Siswa Terdata</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase text-gray-500">Materi Topic</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.totalTopics}</div>
            <div className="text-[10px] text-gray-500 font-medium">Topic Pembelajaran</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase text-gray-500">Bank Soal</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.totalQuestions}</div>
            <div className="text-[10px] text-gray-500 font-medium">Total Soal Aktif</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase text-gray-500">Pengerjaan</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{stats.totalAttempts}</div>
            <div className="text-[10px] text-gray-500 font-medium">Kali Latihan Selesai</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase text-gray-500">Rata-Rata</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">{stats.averageScore}</div>
            <div className="text-[10px] text-gray-500 font-medium">{stats.completionRate}% Kelulusan</div>
          </div>
        </div>
      </div>

      {/* Analytics Row: Top Topics & Lowest Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performed Topics */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Materi Paling Dikuasai Siswa</span>
            </div>
            <span className="text-xs text-gray-500">Top Avg Score</span>
          </div>

          {stats.topTopics.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400">Belum ada data pengerjaan latihan.</div>
          ) : (
            <div className="space-y-3">
              {stats.topTopics.map((t, idx) => (
                <div key={t.topicId} className="flex items-center justify-between gap-3 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-gray-900 line-clamp-1">{t.title}</div>
                      <div className="text-[10px] text-gray-500">{t.count} kali dikerjakan</div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-emerald-800">{t.avgScore} <span className="text-[10px] font-normal text-gray-500">/ 100</span></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lowest Topics (Need Focus) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Materi Perlu Penguatan (Nilai Terendah)</span>
            </div>
            <span className="text-xs text-gray-500">Perlu Review</span>
          </div>

          {stats.lowestTopics.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400">Belum ada data evaluasi materi.</div>
          ) : (
            <div className="space-y-3">
              {stats.lowestTopics.map((t, idx) => (
                <div key={t.topicId} className="flex items-center justify-between gap-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-gray-900 line-clamp-1">{t.title}</div>
                      <div className="text-[10px] text-gray-500">{t.count} kali dikerjakan</div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-amber-900">{t.avgScore} <span className="text-[10px] font-normal text-gray-500">/ 100</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Student Submissions Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Aktivitas Pengerjaan Latihan Terbaru</h3>
            <p className="text-xs text-gray-500">Hasil latihan 50 soal yang baru saja diselesaikan oleh siswa</p>
          </div>

          <button
            onClick={() => onNavigate('results')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Hasil</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {stats.recentAttempts.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">Belum ada siswa yang menyelesaikan latihan hari ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-semibold">Waktu</th>
                  <th className="pb-3 font-semibold">Nama Siswa</th>
                  <th className="pb-3 font-semibold">Kelas</th>
                  <th className="pb-3 font-semibold">Level & Kategori</th>
                  <th className="pb-3 font-semibold">Topic</th>
                  <th className="pb-3 font-semibold text-center">Benar / Total</th>
                  <th className="pb-3 font-semibold text-right">Nilai Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 text-gray-400 font-mono text-[11px]">
                      {new Date(att.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 font-bold text-gray-900">{att.studentName}</td>
                    <td className="py-3 font-semibold text-gray-700">{att.className}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        {att.levelId} • {att.categoryId}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-gray-800 line-clamp-1 max-w-[200px]">
                      {att.topicTitle}
                    </td>
                    <td className="py-3 text-center font-mono">
                      <span className="text-emerald-700 font-bold">{att.correctCount}</span>
                      <span className="text-gray-400"> / {att.totalQuestions}</span>
                    </td>
                    <td className="py-3 text-right font-black text-sm">
                      <span
                        className={`px-2.5 py-1 rounded-lg ${
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
