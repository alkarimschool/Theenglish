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
import { EditClassModal } from './EditClassModal';
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
  Edit3,
  ArrowLeft,
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

  // Edit Class Modal state
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);

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
    { id: 'classes', label: 'Edit Nama Kelas', icon: Edit3 },
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
    <div className="min-h-screen bg-white flex flex-col md:flex-row selection:bg-slate-200 selection:text-slate-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-slate-50/80 border-r border-slate-200 sticky top-0 h-screen z-30 shadow-xs">
        {/* Brand Header with Pastel Periwinkle Blue (#7A93D1) & White Line Divider */}
        <div className="p-5 bg-[#7A93D1] text-white relative overflow-hidden shrink-0 border-b-2 border-white/80">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="The English Logo"
              className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border-2 border-white/90 shadow-md shrink-0"
            />
            <div>
              <h1 className="text-sm font-black tracking-tight leading-tight text-white">
                The English <span className="text-white/90 font-black">Al-Karim</span>
              </h1>
              <p className="text-[10px] text-white/90 font-extrabold uppercase tracking-wider mt-0.5">
                {isAdmin ? 'Super Admin Panel' : 'Panel Guru Pengajar'}
              </p>
            </div>
          </div>
        </div>

        {/* User Scope Card */}
        <div className="p-3.5 mx-3.5 my-3 rounded-2xl bg-white border-2 border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-1">
            {isAdmin ? (
              <Shield className="w-4 h-4 text-[#7A93D1] shrink-0" />
            ) : (
              <GraduationCap className="w-4 h-4 text-[#8CB5D3] shrink-0" />
            )}
            <span className="text-xs font-black text-slate-900 truncate">{currentUser.name}</span>
          </div>
          <div className="text-[10px] text-slate-600 font-bold">
            {isAdmin
              ? 'Akses Semua Jenjang (TK s/d SMA)'
              : `Jenjang: ${allowedLevels.map((l) => l.name).join(', ')}`}
          </div>
        </div>

        {/* Nav Links with 5 Soft Pastel Palette Cards from Image */}
        <nav className="flex-1 px-3.5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            // 5 Soft Pastel card active colors from reference image
            let activeClass = 'bg-[#7A93D1] text-white shadow-sm font-black'; // Card 1: Periwinkle Blue
            if (item.id === 'classes') activeClass = 'bg-[#E5B5C8] text-[#4A1E2F] shadow-sm font-black'; // Card 5: Pastel Rose
            if (item.id === 'topics') activeClass = 'bg-[#E5B5C8] text-[#4A1E2F] shadow-sm font-black'; // Card 5: Pastel Rose
            if (item.id === 'questions') activeClass = 'bg-[#9ED7C6] text-[#0E3D34] shadow-sm font-black'; // Card 3: Mint Green
            if (item.id === 'progress') activeClass = 'bg-[#8CB5D3] text-white shadow-sm font-black'; // Card 2: Sky Blue
            if (item.id === 'teachers') activeClass = 'bg-[#CBEAD9] text-[#123E2A] shadow-sm font-black'; // Card 4: Sage Green
            if (item.id === 'reports') activeClass = 'bg-[#E5B5C8] text-[#4A1E2F] shadow-sm font-black'; // Card 5: Pastel Rose

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => {
                  if (item.id === 'classes') {
                    setIsEditClassOpen(true);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition cursor-pointer ${
                  isActive
                    ? activeClass
                    : 'text-slate-700 hover:bg-white hover:text-slate-900 font-bold border border-transparent hover:border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? '' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Quick Edit Nama Kelas Action in Sidebar */}
          <div className="pt-2 space-y-1.5">
            <button
              id="sidebar-edit-class-btn"
              type="button"
              onClick={() => setIsEditClassOpen(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-black bg-[#E5B5C8] text-[#4A1E2F] border border-[#D8A1B6] hover:brightness-95 transition cursor-pointer shadow-2xs group active:scale-98"
            >
              <div className="w-5 h-5 rounded-md bg-[#4A1E2F] text-white flex items-center justify-center shrink-0 transition shadow-2xs">
                <Edit3 className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">Edit Nama Kelas</span>
            </button>

            <button
              id="sidebar-import-students-btn"
              type="button"
              onClick={() => setIsImportStudentsOpen(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-black bg-[#CBEAD9] text-[#123E2A] border border-[#B9E1CB] hover:brightness-95 transition cursor-pointer shadow-2xs group active:scale-98"
            >
              <div className="w-5 h-5 rounded-md bg-[#123E2A] text-white flex items-center justify-center shrink-0 transition shadow-2xs">
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">Import Siswa Excel</span>
            </button>
          </div>
        </nav>

        {/* Quick Student Switch & Logout */}
        <div className="p-3.5 border-t border-slate-200 space-y-2 shrink-0 bg-white">
          <button
            id="switch-student-preview-btn"
            type="button"
            onClick={onSwitchToStudentView}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-700" />
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

      {/* Mobile Header Bar with Pastel Header Line */}
      <div className="md:hidden bg-[#7A93D1] text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md border-b-2 border-white/80">
        <div className="flex items-center gap-2.5">
          <img
            src={logoImg}
            alt="The English Logo"
            className="w-8 h-8 object-contain rounded-full bg-white p-0.5 border border-white shrink-0"
          />
          <div>
            <span className="text-xs font-black text-white">The English Al-Karim</span>
            <div className="text-[10px] text-white/90 font-extrabold">{isAdmin ? 'Super Admin' : 'Guru Pengajar'}</div>
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
                  if (item.id === 'classes') {
                    setIsEditClassOpen(true);
                  } else {
                    setActiveTab(item.id);
                  }
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
        {activeTab !== 'dashboard' && (
          <div className="mb-6 flex items-center justify-between bg-slate-50 border border-slate-200/90 p-3.5 rounded-2xl shadow-2xs">
            <button
              id="admin-btn-back-to-dashboard"
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-800 hover:text-emerald-950 text-xs font-black border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Kembali ke Dashboard Utama</span>
            </button>
            <div className="text-xs font-black text-slate-700 px-3.5 py-1.5 bg-white rounded-xl border border-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{navItems.find((n) => n.id === activeTab)?.label || activeTab}</span>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardOverview
            stats={effectiveStats}
            currentUser={currentUser}
            levels={allowedLevels}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenBulkImport={() => handleOpenBulkImport()}
            onOpenImportStudents={() => setIsImportStudentsOpen(true)}
            onOpenEditClass={() => setIsEditClassOpen(true)}
          />
        )}

        {activeTab === 'teachers' && isAdmin && (
          <TeacherManagement
            teachers={teachers}
            levels={levels}
            onRefresh={onRefreshAll}
            onOpenEditClass={() => setIsEditClassOpen(true)}
          />
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

        {activeTab === 'settings' && (
          <SettingsView
            currentUser={currentUser}
            onRefreshAll={onRefreshAll}
            onOpenEditClass={() => setIsEditClassOpen(true)}
          />
        )}
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

      {/* Global Edit Class Name & Sync Modal */}
      {isEditClassOpen && (
        <EditClassModal
          isOpen={isEditClassOpen}
          onClose={() => setIsEditClassOpen(false)}
          levels={levels}
          currentUser={currentUser}
          onSuccess={onRefreshAll}
        />
      )}
    </div>
  );
};
