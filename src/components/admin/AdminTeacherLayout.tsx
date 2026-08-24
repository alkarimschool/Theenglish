import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Level, Category, Topic, DashboardStats, StudentProgress, StudentAttempt } from '../../types';
import logoImg from '../../assets/logo.png';
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
    <div className="min-h-screen bg-mesh-admin flex flex-col md:flex-row selection:bg-rose-200 selection:text-slate-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white/95 backdrop-blur-md border-r border-gray-200/80 sticky top-0 h-screen z-30 shadow-md">
        {/* Brand Header with Navy Gradient & Logo Accent Bar */}
        <div className="p-5 bg-gradient-to-br from-[#0F214A] via-indigo-950 to-slate-900 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 via-teal-400 to-purple-500" />
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="The English Logo"
              className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border-2 border-amber-300 shadow-md shrink-0"
            />
            <div>
              <h1 className="text-sm font-black tracking-tight leading-tight text-white">
                The English <span className="text-amber-300 font-black">Al-Karim</span>
              </h1>
              <p className="text-[10px] text-teal-300 font-extrabold uppercase tracking-wider mt-0.5">
                {isAdmin ? 'Super Admin Panel' : 'Panel Guru Pengajar'}
              </p>
            </div>
          </div>
        </div>

        {/* User Scope Card */}
        <div className="p-3.5 mx-3.5 my-3 rounded-2xl bg-gradient-to-r from-rose-50/70 via-amber-50/70 via-teal-50/70 to-indigo-50/70 border-2 border-amber-200/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            {isAdmin ? (
              <Shield className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <GraduationCap className="w-4 h-4 text-indigo-700 shrink-0" />
            )}
            <span className="text-xs font-black text-slate-900 truncate">{currentUser.name}</span>
          </div>
          <div className="text-[10px] text-slate-700 font-bold">
            {isAdmin
              ? 'Akses Semua Jenjang (TK s/d SMA)'
              : `Jenjang: ${allowedLevels.map((l) => l.name).join(', ')}`}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3.5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            // Multi-colored active tab background based on feature area
            let activeClass = 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20';
            if (item.id === 'topics') activeClass = 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-md shadow-rose-500/20';
            if (item.id === 'questions') activeClass = 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20';
            if (item.id === 'progress') activeClass = 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20';
            if (item.id === 'teachers') activeClass = 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20';
            if (item.id === 'reports') activeClass = 'bg-gradient-to-r from-rose-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20';

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  isActive
                    ? activeClass
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 font-bold'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-rose-50 via-amber-50 to-teal-50 hover:from-rose-100 hover:to-teal-100 text-slate-900 border-2 border-amber-300/80 transition cursor-pointer shadow-2xs group active:scale-98"
            >
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center shrink-0 transition shadow-2xs">
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">Import Siswa Excel</span>
            </button>
          </div>
        </nav>

        {/* Quick Student Switch & Logout */}
        <div className="p-3.5 border-t border-gray-100 space-y-2 shrink-0">
          <button
            id="switch-student-preview-btn"
            type="button"
            onClick={onSwitchToStudentView}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-50 to-indigo-50 hover:from-teal-100 hover:to-indigo-100 text-slate-900 border border-teal-200 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-teal-700" />
            <span>Mode Siswa (Preview)</span>
          </button>

          <button
            id="sidebar-logout-btn"
            type="button"
            onClick={logout}
            className="w-full py-2.5 px-3 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-gradient-to-r from-[#0F214A] via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 via-teal-400 to-purple-500" />
        <div className="flex items-center gap-2.5">
          <img
            src={logoImg}
            alt="The English Logo"
            className="w-8 h-8 object-contain rounded-full bg-white p-0.5 border border-amber-300 shrink-0"
          />
          <div>
            <span className="text-xs font-black text-white">The English Al-Karim</span>
            <div className="text-[10px] text-amber-300 font-extrabold">{isAdmin ? 'Super Admin' : 'Guru Pengajar'}</div>
          </div>
        </div>
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
