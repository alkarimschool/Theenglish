import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import {
  Level,
  Category,
  Topic,
  Question,
  LearningMaterial,
  DashboardStats,
  StudentProgress,
  StudentAttempt,
  User,
} from './types';
import { Header } from './components/common/Header';
import { LoginModal } from './components/auth/LoginModal';
import { StudentWelcome } from './components/student/StudentWelcome';
import { LevelSelection } from './components/student/LevelSelection';
import { CategorySelection } from './components/student/CategorySelection';
import { TopicSelection } from './components/student/TopicSelection';
import { LearningStage } from './components/student/LearningStage';
import { ExerciseStage } from './components/student/ExerciseStage';
import { ResultStage } from './components/student/ResultStage';
import { AdminTeacherLayout } from './components/admin/AdminTeacherLayout';
import { MobileBottomNav } from './components/common/MobileBottomNav';

type StudentView =
  | 'welcome'
  | 'levels'
  | 'categories'
  | 'topics'
  | 'learning'
  | 'exercise'
  | 'result';

export default function App() {
  const { currentUser, studentSession, activeRole, logout, clearStudent } = useAuth();

  // App Master Data States
  const [levels, setLevels] = useState<Level[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [attempts, setAttempts] = useState<StudentAttempt[]>([]);
  const [progressList, setProgressList] = useState<StudentProgress[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Student Navigation States
  const [studentView, setStudentView] = useState<StudentView>('welcome');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<LearningMaterial | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentAttemptResult, setCurrentAttemptResult] = useState<StudentAttempt | null>(null);

  // Teacher / Admin UI Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStudentPreviewOverride, setIsStudentPreviewOverride] = useState(false);

  // Load all initial data from backend
  const loadAllData = async () => {
    try {
      const [lvlData, catData, topData, attData, progData, statsData] = await Promise.all([
        api.getLevels(),
        api.getCategories(),
        api.getTopics(),
        api.getAttempts(),
        api.getStudentProgress(),
        api.getDashboardStats(),
      ]);

      setLevels(lvlData);
      setCategories(catData);
      setTopics(topData);
      setAttempts(attData);
      setProgressList(progData);
      setDashboardStats(statsData);

      if (currentUser?.role === 'admin') {
        const teachersData = await api.getTeachers();
        setTeachers(teachersData);
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [currentUser]);

  // Adjust view based on student session existence
  useEffect(() => {
    if (studentSession && studentView === 'welcome' && levels.length > 0) {
      // Find matching level or default to SD-4
      const matched =
        levels.find((l) => l.id === studentSession.levelId) ||
        levels.find((l) => l.id === 'sd') ||
        levels[0] ||
        null;
      setSelectedLevel(matched);
      setStudentView('categories');
    }
  }, [studentSession, levels]);

  // Student Flow Handlers: Go DIRECTLY to the level's specific dashboard page
  const handleStudentContinue = (levelId?: string) => {
    if (levelId) {
      const found = levels.find((l) => l.id === levelId);
      if (found) {
        setSelectedLevel(found);
      }
    }
    setStudentView('categories');
  };

  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);
    setStudentView('categories');
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setStudentView('topics');
  };

  const handleSelectTopic = async (topic: Topic) => {
    if (topic.isLocked) {
      alert(topic.lockMessage || 'Topic ini sedang dikunci oleh guru. Silakan kerjakan topik yang terbuka.');
      return;
    }
    setSelectedTopic(topic);
    try {
      // Load material & questions for this topic
      const [mat, qList] = await Promise.all([
        api.getMaterial(topic.id),
        api.getQuestions({ topicId: topic.id }),
      ]);
      setActiveMaterial(mat);
      setActiveQuestions(qList);
      // ALWAYS start with Stage 1 (Learning Stage) first!
      setStudentView('learning');
    } catch (err) {
      console.error('Failed to prepare topic learning:', err);
    }
  };

  const handleStartExercise = () => {
    setStudentView('exercise');
  };

  const handleFinishExercise = async (
    answers: Record<string, 'A' | 'B' | 'C' | 'D'>,
    timeElapsedSec: number
  ) => {
    if (!selectedTopic || !selectedLevel || !selectedCategory) return;

    try {
      const result = await api.submitAttempt({
        studentName: studentSession?.name || 'Siswa Al-Karim',
        className: studentSession?.className || '7A',
        topicId: selectedTopic.id,
        levelId: selectedLevel.id,
        categoryId: selectedCategory.id,
        answers,
        timeElapsedSec,
      });

      setCurrentAttemptResult(result);
      setStudentView('result');
      // Refresh attempts & stats in background
      loadAllData();
    } catch (err: any) {
      alert('Gagal mengirim hasil latihan: ' + err.message);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold">Al-Karim English Learning</h2>
        <p className="text-xs text-emerald-300">Menyiapkan materi kurikulum dan bank soal...</p>
      </div>
    );
  }

  // TEACHER / ADMIN VIEW
  if (currentUser && !isStudentPreviewOverride) {
    return (
      <AdminTeacherLayout
        stats={
          dashboardStats || {
            totalTeachers: 1,
            totalStudents: progressList.length,
            totalTopics: topics.length,
            totalQuestions: 50,
            totalAttempts: attempts.length,
            averageScore: 85,
            completionRate: 90,
            topTopics: [],
            lowestTopics: [],
            recentAttempts: [],
          }
        }
        levels={levels}
        categories={categories}
        topics={topics}
        teachers={teachers}
        progressList={progressList}
        attempts={attempts}
        onRefreshAll={loadAllData}
        onSwitchToStudentView={() => setIsStudentPreviewOverride(true)}
      />
    );
  }

  // STUDENT VIEW (Clean White Background, Soft Pastel Card Accents)
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-slate-200 selection:text-slate-950 relative overflow-x-hidden">

      {/* Student Top Header */}
      <div className="relative z-30">
        <Header
          onOpenLogin={() => setIsLoginModalOpen(true)}
          showBackButton={studentView !== 'welcome'}
          backTitle={
            studentView === 'levels'
              ? 'Beranda'
              : studentView === 'categories'
              ? 'Beranda'
              : studentView === 'topics'
              ? (selectedLevel ? `Halaman ${selectedLevel.name}` : 'Halaman Jenjang')
              : studentView === 'learning'
              ? 'Daftar Topic'
              : 'Kembali'
          }
          onBackToStudentHome={() => {
            if (studentView === 'levels') {
              setStudentView('welcome');
            } else if (studentView === 'categories') {
              clearStudent();
              setStudentView('welcome');
            } else if (studentView === 'topics') {
              setStudentView('categories');
            } else if (studentView === 'learning') {
              setStudentView('topics');
            } else if (studentView === 'exercise') {
              setStudentView('learning');
            } else if (studentView === 'result') {
              setStudentView('topics');
            } else {
              setStudentView('welcome');
            }
          }}
        />
      </div>

      {/* Teacher Override Banner if in Student Preview */}
      {currentUser && isStudentPreviewOverride && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white px-4 py-2 text-xs flex items-center justify-between z-40 sticky top-16 shadow-md">
          <span>
            Mode Preview Siswa (Login sebagai: <strong>{currentUser.name}</strong>)
          </span>
          <button
            onClick={() => setIsStudentPreviewOverride(false)}
            className="px-3 py-1 bg-white text-emerald-950 font-bold rounded-lg hover:bg-emerald-50 text-[11px] shadow-2xs"
          >
            Kembali ke Dashboard Guru/Admin
          </button>
        </div>
      )}

      {/* Main Student Views */}
      <main className="flex-1 pb-20 sm:pb-8 relative z-10">
        {studentView === 'welcome' && (
          <StudentWelcome
            levels={levels}
            onContinue={handleStudentContinue}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {studentView === 'levels' && (
          <LevelSelection
            levels={levels}
            selectedLevelId={selectedLevel?.id || null}
            onSelectLevel={handleSelectLevel}
            onBack={() => setStudentView('welcome')}
          />
        )}

        {studentView === 'categories' && selectedLevel && (
          <CategorySelection
            level={selectedLevel}
            categories={categories}
            topics={topics}
            attempts={attempts.filter((a) => a.studentName === studentSession?.name)}
            studentName={studentSession?.name || 'Siswa Al-Karim'}
            className={studentSession?.className || '4A'}
            onSelectCategory={handleSelectCategory}
            onBack={() => {
              clearStudent();
              setStudentView('welcome');
            }}
            onChangeStudent={() => {
              clearStudent();
              setStudentView('welcome');
            }}
          />
        )}

        {studentView === 'topics' && selectedLevel && selectedCategory && (
          <TopicSelection
            level={selectedLevel}
            category={selectedCategory}
            topics={topics.filter(
              (t) =>
                t.levelId === selectedLevel.id &&
                t.categoryId === selectedCategory.id &&
                t.isPublished !== false
            )}
            attempts={attempts.filter((a) => a.studentName === studentSession?.name)}
            onSelectTopic={handleSelectTopic}
            onBack={() => setStudentView('categories')}
          />
        )}

        {/* TAHAP 1: LEARNING STAGE */}
        {studentView === 'learning' &&
          selectedTopic &&
          activeMaterial &&
          selectedLevel &&
          selectedCategory && (
            <LearningStage
              topic={selectedTopic}
              material={activeMaterial}
              level={selectedLevel}
              category={selectedCategory}
              questionCount={activeQuestions.length || selectedTopic.questionCount || 50}
              onStartExercise={handleStartExercise}
              onBackToTopics={() => setStudentView('topics')}
            />
          )}

        {/* TAHAP 2: EXERCISE STAGE (50 Questions, Responsive 1-by-1 Card, Navigator Matrix, TTS Audio) */}
        {studentView === 'exercise' &&
          selectedTopic &&
          selectedLevel &&
          selectedCategory && (
            <ExerciseStage
              topic={selectedTopic}
              level={selectedLevel}
              category={selectedCategory}
              questions={activeQuestions}
              studentName={studentSession?.name || 'Siswa Al-Karim'}
              className={studentSession?.className || '7A'}
              onFinishExercise={handleFinishExercise}
              onExitExercise={() => setStudentView('learning')}
            />
          )}

        {/* TAHAP 3: RESULT & REVIEW STAGE */}
        {studentView === 'result' &&
          currentAttemptResult &&
          selectedTopic &&
          selectedLevel &&
          selectedCategory && (
            <ResultStage
              attempt={currentAttemptResult}
              questions={activeQuestions}
              topic={selectedTopic}
              level={selectedLevel}
              category={selectedCategory}
              onStudyAgain={() => setStudentView('learning')}
              onRetakeExercise={() => setStudentView('exercise')}
              onBackToTopicList={() => setStudentView('topics')}
              onBackToLevelPage={() => setStudentView('categories')}
            />
          )}
      </main>

      {/* Persistent Mobile Bottom Navigation */}
      <MobileBottomNav
        currentView={studentView}
        selectedLevel={selectedLevel}
        selectedCategory={selectedCategory}
        onNavigateHome={() => {
          if (selectedLevel) {
            setStudentView('categories');
          } else {
            setStudentView('welcome');
          }
        }}
        onNavigateCategories={() => {
          if (selectedLevel) {
            setStudentView('categories');
          } else {
            setStudentView('welcome');
          }
        }}
        onNavigateTopics={() => {
          if (selectedLevel && selectedCategory) {
            setStudentView('topics');
          } else if (selectedLevel) {
            setStudentView('categories');
          } else {
            setStudentView('welcome');
          }
        }}
        onChangeStudent={() => setStudentView('welcome')}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Teacher / Admin Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
