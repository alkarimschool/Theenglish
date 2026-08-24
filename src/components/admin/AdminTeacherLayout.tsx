import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Level, Category, Topic, DashboardStats, StudentProgress, StudentAttempt } from '../../types';
import { DashboardOverview } from './DashboardOverview';
import { TeacherManagement } from './TeacherManagement';
import { StudentProgressTable } from './StudentProgressTable';
import { TopicManagement } from './TopicManagement';
import { QuestionBank } from './QuestionBank';
import { ResultsView } from './ResultsView';
import { ReportsView } from './ReportsView';
import { SettingsView } from './SettingsView';
import { BulkImportModal, ImportMode } from './BulkImportModal';
import { ImportStudentsModal } from './ImportStudentsModal';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  HelpCircle,
  Award,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Upload,
  Layers,
  Menu,
  X,
  ExternalLink,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  stats: DashboardStats;
  levels: Level[];
  categories: Category[];
  topics: Topic[];
  teachers: User[];
  progressList: StudentProgress[];
  attempts: StudentAttempt[];
  onRefreshAll: () => void;
  onSwitchToStudentView: () => void;
}

export const AdminTeacherLayout: React.FC<Props> = ({
  stats,
  levels,
  categories,
  topics,
  teachers,
  progressList,
  attempts,
  onRefreshAll,
  onSwitchToStudentView,
}) => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Bulk Import state
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportTopicId, setBulkImportTopicId] = useState<string | undefined>();
  const [bulkImportLevelId, setBulkImportLevelId] = useState<string | undefined>();
  const [bulkImportCategoryId, setBulkImportCategoryId] = useState<string | undefined>();
  const [bulkImportMode, setBulkImportMode] = useState<ImportMode>('all');

  // Student Import Modal state
  const [isImportStudentsOpen, setIsImportStudentsOpen] = useState(false);

  // Question bank initial filter
  const [qbInitialTopicId, setQbInitialTopicId] = useState<string | undefined>();
  const [qbInitialLevelId, setQbInitialLevelId] = useState<string | undefined>();
  const [qbInitialCategoryId, setQbInitialCategoryId] = useState<string | undefined>();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'admin';

  // Strict Level Filtering for Teachers
  const allowedLevels =
    isAdmin || !currentUser.assignedLevelIds || currentUser.assignedLevelIds.length === 0
      ? levels
      : levels.filter((l) => currentUser.assignedLevelIds?.includes(l.id));

  const allowedLevelIds = new Set(allowedLevels.map((l) => l.id));

  const filteredTopics = isAdmin ? topics : topics.filter((t) => allowedLevelIds.has(t.levelId));
  const filteredProgressList = isAdmin ? progressList : progressList.filter((p) => allowedLevelIds.has(p.levelId));
  const filteredAttempts = isAdmin ? attempts : attempts.filter((a) => allowedLevelIds.has(a.levelId));

  // Compute teacher-specific stats if teacher role
  const effectiveStats: DashboardStats = isAdmin
    ? stats
    : {
        totalTeachers: 1,
        totalStudents: filteredProgressList.length,
        totalTopics: filteredTopics.length,
        totalQuestions: filteredTopics.reduce((acc, t) => acc + (t.questionCount || 0), 0),
        totalAttempts: filteredAttempts.length,
        averageScore:
          filteredAttempts.length > 0
            ? Math.round(filteredAttempts.reduce((acc, a) => acc + a.score, 0) / filteredAttempts.length)
            : 0,
        completionRate:
          filteredAttempts.length > 0
            ? Math.round((filteredAttempts.filter((a) => a.score >= 75).length / filteredAttempts.length) * 100)
            : 0,
        recentAttempts: filteredAttempts.slice(0, 8),
        topTopics: stats.topTopics.filter((tt) => filteredTopics.some((ft) => ft.id === tt.topicId)),
        lowestTopics: stats.lowestTopics.filter((lt) => filteredTopics.some((ft) => ft.id === lt.topicId)),
      };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(isAdmin ? [{ id: 'teachers', label: 'Guru & Akses', icon: GraduationCap }] : []),
    { id: 'students', label: 'Siswa & Progress', icon: Users },
    { id: 'topics', label: 'Materi & Topic', icon: BookOpen },
    { id: 'questions', label: 'Bank Soal', icon: HelpCircle },
    { id: 'results', label: 'Hasil Belajar', icon: Award },
    { id: 'reports', label: 'Laporan & Grafik', icon: BarChart3 },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const handleOpenBulkImport = (
    topicId?: string,
    levelId?: string,
    categoryId?: string,
    mode: ImportMode = 'all'
  ) => {
    setBulkImportTopicId(topicId);
    setBulkImportLevelId(levelId);
    setBulkImportCategoryId(categoryId);
    setBulkImportMode(mode);
    setIsBulkImportOpen(true);
  };

  const handleOpenQuestionBankForTopic = (topicId: string, levelId: string, categoryId: string) => {
    setQbInitialTopicId(topicId);
    setQbInitialLevelId(levelId);
    setQbInitialCategoryId(categoryId);
    setActiveTab('questions');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-gray-200 sticky top-0 h-screen z-30">
        {/* Brand */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 flex items-center justify-center text-white font-bold shadow-sm shadow-emerald-800/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-900 tracking-tight leading-tight">
              The English <span className="text-emerald-700 font-black">Al-Karim</span>
            </h1>
            <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
              {isAdmin ? 'Super Admin' : 'Guru Pengajar'}
            </p>
          </div>
        </div>

        {/* User Scope Card */}
        <div className="p-4 mx-4 my-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
          <div className="flex items-center gap-2 mb-1">
            {isAdmin ? (
              <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
            ) : (
              <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
            )}
            <span className="text-xs font-bold text-gray-900 truncate">{currentUser.name}</span>
          </div>
          <div className="text-[10px] text-emerald-800 font-medium">
            {isAdmin
              ? 'Akses Semua Jenjang (TK s/d SMA)'
              : `Jenjang: ${allowedLevels.map((l) => l.name).join(', ')}`}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20'
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Quick Import Siswa Action in Sidebar */}
          <div className="pt-2">
            <button
              id="sidebar-import-students-btn"
              type="button"
              onClick={() => setIsImportStudentsOpen(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-50 to-emerald-50 hover:from-amber-100 hover:to-emerald-100 text-emerald-950 border border-emerald-200/80 transition cursor-pointer shadow-2xs group active:scale-98"
            >
              <div className="w-5 h-5 rounded-md bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 transition">
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">Import Siswa Excel</span>
            </button>
          </div>
        </nav>

        {/* Quick Student Switch & Logout */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            id="switch-student-preview-btn"
            type="button"
            onClick={onSwitchToStudentView}
            className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Mode Siswa (Preview)</span>
          </button>

          <button
            id="sidebar-logout-btn"
            type="button"
            onClick={logout}
            className="w-full py-2.5 px-3 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-900">The English Al-Karim</span>
            <div className="text-[10px] text-emerald-700 font-bold">{isAdmin ? 'Admin' : 'Guru'}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSwitchToStudentView}
            className="px-2.5 py-1 bg-teal-50 text-teal-800 text-[11px] font-bold rounded-lg border border-teal-200"
          >
            Mode Siswa
          </button>
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 text-gray-700 rounded-xl bg-gray-100"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                  isActive ? 'bg-emerald-700 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={logout}
            className="w-full py-2.5 text-rose-700 text-xs font-bold flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            stats={effectiveStats}
            currentUser={currentUser}
            levels={allowedLevels}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenBulkImport={() => handleOpenBulkImport()}
            onOpenImportStudents={() => setIsImportStudentsOpen(true)}
          />
        )}

        {activeTab === 'teachers' && isAdmin && (
          <TeacherManagement teachers={teachers} levels={levels} onRefresh={onRefreshAll} />
        )}

        {activeTab === 'students' && (
          <StudentProgressTable
            progressList={filteredProgressList}
            levels={allowedLevels}
            attempts={filteredAttempts}
            currentUser={currentUser}
            onRefresh={onRefreshAll}
            onOpenImportStudents={() => setIsImportStudentsOpen(true)}
          />
        )}

        {activeTab === 'topics' && (
          <TopicManagement
            topics={filteredTopics}
            levels={allowedLevels}
            categories={categories}
            currentUser={currentUser}
            onRefresh={onRefreshAll}
            onOpenQuestionBankForTopic={handleOpenQuestionBankForTopic}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBank
            levels={allowedLevels}
            categories={categories}
            topics={filteredTopics}
            currentUser={currentUser}
            initialTopicId={qbInitialTopicId}
            initialLevelId={qbInitialLevelId}
            initialCategoryId={qbInitialCategoryId}
            onOpenBulkImport={(tId, lId, cId, m) => handleOpenBulkImport(tId, lId, cId, m || 'questions')}
            onRefresh={onRefreshAll}
          />
        )}

        {activeTab === 'results' && (
          <ResultsView
            attempts={filteredAttempts}
            levels={allowedLevels}
            categories={categories}
            topics={filteredTopics}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            stats={effectiveStats}
            levels={allowedLevels}
            categories={categories}
            progressList={filteredProgressList}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'settings' && <SettingsView currentUser={currentUser} onRefreshAll={onRefreshAll} />}
      </main>

      {/* Global Quick Bulk Import Modal */}
      {isBulkImportOpen && (
        <BulkImportModal
          isOpen={isBulkImportOpen}
          onClose={() => setIsBulkImportOpen(false)}
          levels={allowedLevels}
          categories={categories}
          topics={filteredTopics}
          selectedTopicId={bulkImportTopicId}
          selectedLevelId={bulkImportLevelId}
          selectedCategoryId={bulkImportCategoryId}
          mode={bulkImportMode}
          onSuccess={onRefreshAll}
        />
      )}

      {/* Global Import Students Modal (Excel / CSV) */}
      {isImportStudentsOpen && (
        <ImportStudentsModal
          isOpen={isImportStudentsOpen}
          onClose={() => setIsImportStudentsOpen(false)}
          levels={allowedLevels}
          currentUser={currentUser}
          onSuccess={onRefreshAll}
        />
      )}
    </div>
  );
};
