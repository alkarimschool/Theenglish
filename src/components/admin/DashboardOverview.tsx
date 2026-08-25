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
  CheckCircle2,
  Edit3,
  RefreshCw,
} from 'lucide-react';

interface Props {
  stats: DashboardStats;
  currentUser: User;
  levels: Level[];
  onNavigate: (tab: string) => void;
  onOpenBulkImport?: () => void;
  onOpenImportStudents?: () => void;
  onOpenEditClass?: () => void;
}

export const DashboardOverview: React.FC<Props> = ({
  stats,
  currentUser,
  levels,
  onNavigate,
  onOpenImportStudents,
  onOpenEditClass,
}) => {
  const isTeacher = currentUser.role === 'teacher';

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Pastel Periwinkle Blue (#7A93D1) & White Line Divider */}
      <div className="bg-[#7A93D1] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border-2 border-white/80">
        <div className="absolute top-3 left-6 right-6 h-[2px] bg-white/80" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2.5 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{isTeacher ? 'Teacher Control Center' : 'Super Admin Management Center'}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              Assalamu’alaikum, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl font-medium">
              {isTeacher
                ? `Anda memiliki akses pengajaran untuk jenjang: ${
                    levels.map((l) => l.name).join(', ') || 'Jenjang Ditugaskan'
                  }.`
                : 'Pusat kontrol kurikulum, pengelolaan guru, bank soal, dan evaluasi capaian siswa Sekolah Alam Al-Karim.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenEditClass && (
              <button
                id="dash-quick-edit-class-btn"
                type="button"
                onClick={onOpenEditClass}
                className="px-4 py-2.5 rounded-xl bg-[#E5B5C8] hover:brightness-95 text-[#4A1E2F] font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition cursor-pointer active:scale-95 border border-white/80"
              >
                <Edit3 className="w-4 h-4 text-[#4A1E2F]" />
                <span>Edit Nama Kelas</span>
              </button>
            )}

            {onOpenImportStudents && (
              <button
                id="dash-quick-import-students-btn"
                type="button"
                onClick={onOpenImportStudents}
                className="px-4 py-2.5 rounded-xl bg-[#CBEAD9] hover:brightness-95 text-[#123E2A] font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition cursor-pointer active:scale-95 border border-white/80"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#123E2A]" />
                <span>Import Siswa (Excel)</span>
              </button>
            )}

            <button
              id="dash-quick-topic-btn"
              type="button"
              onClick={() => onNavigate('topics')}
              className="px-4 py-2.5 rounded-xl bg-[#9ED7C6] hover:brightness-95 text-[#0E3D34] font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition cursor-pointer border border-white/80"
            >
              <BookOpen className="w-4 h-4" />
              <span>Kelola Materi</span>
            </button>

            <button
              id="dash-quick-questions-btn"
              type="button"
              onClick={() => onNavigate('questions')}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/40 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Lihat Bank Soal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Primary Key Metric Cards styled like the 5 pastel reference cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {!isTeacher && (
          /* Card 1: Soft Periwinkle Blue (#7A93D1) */
          <div className="bg-[#7A93D1] text-white p-4 sm:p-5 rounded-2xl border-2 border-white/80 shadow-xs flex flex-col justify-between relative">
            <div className="w-full h-[2px] bg-white/80 mb-3" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase text-white/90">Guru</span>
              <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white leading-tight">{stats.totalTeachers}</div>
              <div className="text-[10px] text-white/80 font-bold">Akun Pengajar</div>
            </div>
          </div>
        )}

        {/* Card 2: Soft Sky Blue (#8CB5D3) */}
        <div className="bg-[#8CB5D3] text-white p-4 sm:p-5 rounded-2xl border-2 border-white/80 shadow-xs flex flex-col justify-between relative">
          <div className="w-full h-[2px] bg-white/80 mb-3" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase text-white/90">Siswa Aktif</span>
            <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white leading-tight">{stats.totalStudents}</div>
            <div className="text-[10px] text-white/80 font-bold">Siswa Terdata</div>
          </div>
        </div>

        {/* Card 3: Soft Mint Green (#9ED7C6) */}
        <div className="bg-[#9ED7C6] text-[#0E3D34] p-4 sm:p-5 rounded-2xl border-2 border-white/80 shadow-xs flex flex-col justify-between relative">
          <div className="w-full h-[2px] bg-white/80 mb-3" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase text-[#0E3D34]">Materi Topic</span>
            <div className="w-7 h-7 rounded-lg bg-[#0E3D34]/15 text-[#0E3D34] flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#0E3D34] leading-tight">{stats.totalTopics}</div>
            <div className="text-[10px] text-[#0E3D34]/80 font-bold">Topic Pembelajaran</div>
          </div>
        </div>

        {/* Card 4: Soft Pale Sage (#CBEAD9) */}
        <div className="bg-[#CBEAD9] text-[#123E2A] p-4 sm:p-5 rounded-2xl border-2 border-white/80 shadow-xs flex flex-col justify-between relative">
          <div className="w-full h-[2px] bg-white/80 mb-3" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase text-[#123E2A]">Bank Soal</span>
            <div className="w-7 h-7 rounded-lg bg-[#123E2A]/15 text-[#123E2A] flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#123E2A] leading-tight">{stats.totalQuestions}</div>
            <div className="text-[10px] text-[#123E2A]/80 font-bold">Total Soal Aktif</div>
          </div>
        </div>

        {/* Card 5: Soft Pastel Rose (#E5B5C8) */}
        <div className="bg-[#E5B5C8] text-[#4A1E2F] p-4 sm:p-5 rounded-2xl border-2 border-white/80 shadow-xs flex flex-col justify-between relative">
          <div className="w-full h-[2px] bg-white/80 mb-3" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase text-[#4A1E2F]">Latihan Selesai</span>
            <div className="w-7 h-7 rounded-lg bg-[#4A1E2F]/15 text-[#4A1E2F] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#4A1E2F] leading-tight">{stats.totalAttempts}</div>
            <div className="text-[10px] text-[#4A1E2F]/80 font-bold">Sesi Pengerjaan</div>
          </div>
        </div>

        {/* Card 6: Soft Periwinkle Blue (#7A93D1) */}
        <div className="bg-[#7A93D1] text-white p-4 sm:p-5 rounded-2xl border-2 border-white/80 shadow-xs flex flex-col justify-between relative">
          <div className="w-full h-[2px] bg-white/80 mb-3" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase text-white/90">Lulus Latihan</span>
            <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white leading-tight">{stats.passPercentage}%</div>
            <div className="text-[10px] text-white/80 font-bold">Tingkat Kelulusan</div>
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
