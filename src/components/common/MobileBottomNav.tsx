import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Level, Category } from '../../types';
import {
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  User,
  Shield,
  Home,
  CheckCircle,
} from 'lucide-react';

interface Props {
  currentView: string;
  selectedLevel: Level | null;
  selectedCategory: Category | null;
  onNavigateHome: () => void;
  onNavigateCategories: () => void;
  onNavigateTopics: () => void;
  onChangeStudent: () => void;
  onOpenLogin: () => void;
}

export const MobileBottomNav: React.FC<Props> = ({
  currentView,
  selectedLevel,
  selectedCategory,
  onNavigateHome,
  onNavigateCategories,
  onNavigateTopics,
  onChangeStudent,
  onOpenLogin,
}) => {
  const { studentSession, currentUser } = useAuth();

  // Hide the global mobile bottom bar during active timed exercise to avoid distractions
  if (currentView === 'exercise') {
    return null;
  }

  const isHomeActive = currentView === 'categories' || currentView === 'welcome';
  const isTopicsActive = currentView === 'topics' || currentView === 'learning' || currentView === 'result';

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-3 py-1 flex items-center justify-around sm:hidden select-none safe-area-pb"
    >
      {/* 1. Halaman Utama / Belajar */}
      <button
        id="mob-nav-home"
        type="button"
        onClick={onNavigateHome}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-w-[65px] ${
          isHomeActive
            ? 'text-emerald-700 font-bold bg-emerald-50/80'
            : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        <div className="relative">
          <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          {selectedLevel && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-600" />
          )}
        </div>
        <span className="text-[10.5px] tracking-tight mt-0.5 whitespace-nowrap">
          {selectedLevel ? selectedLevel.name : 'Beranda'}
        </span>
      </button>

      {/* 2. Topik Materi (if category is selected or available) */}
      <button
        id="mob-nav-topics"
        type="button"
        onClick={() => {
          if (selectedCategory) {
            onNavigateTopics();
          } else {
            onNavigateCategories();
          }
        }}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-w-[65px] ${
          isTopicsActive
            ? 'text-emerald-700 font-bold bg-emerald-50/80'
            : 'text-gray-500 hover:text-gray-800'
        }`}
      >
        <Sparkles className={`w-5 h-5 ${isTopicsActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[10.5px] tracking-tight mt-0.5 whitespace-nowrap">
          {selectedCategory ? selectedCategory.name.slice(0, 8) : 'Topik'}
        </span>
      </button>

      {/* 3. Profil / Ganti Siswa */}
      <button
        id="mob-nav-student"
        type="button"
        onClick={onChangeStudent}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-w-[65px] text-gray-500 hover:text-gray-800"
      >
        <User className="w-5 h-5 stroke-2" />
        <span className="text-[10.5px] tracking-tight mt-0.5 whitespace-nowrap truncate max-w-[65px]">
          {studentSession ? studentSession.name.split(' ')[0] : 'Siswa'}
        </span>
      </button>

      {/* 4. Portal Guru / Admin */}
      <button
        id="mob-nav-admin"
        type="button"
        onClick={onOpenLogin}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-w-[65px] text-gray-500 hover:text-emerald-800"
      >
        <Shield className="w-5 h-5 stroke-2 text-emerald-800/80" />
        <span className="text-[10.5px] tracking-tight mt-0.5 whitespace-nowrap">
          {currentUser ? 'Admin' : 'Guru'}
        </span>
      </button>
    </nav>
  );
};
