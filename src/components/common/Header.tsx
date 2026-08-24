import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, User as UserIcon, Shield, LogOut, GraduationCap, Sparkles, ArrowLeft } from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface Props {
  onOpenLogin: () => void;
  onBackToStudentHome?: () => void;
  showBackButton?: boolean;
  backTitle?: string;
}

export const Header: React.FC<Props> = ({
  onOpenLogin,
  onBackToStudentHome,
  showBackButton,
  backTitle = 'Kembali',
}) => {
  const { currentUser, studentSession, logout, clearStudent, activeRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs relative">
      {/* Top Pastel Periwinkle Accent Line inspired by reference card */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#7A93D1]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand or Back */}
        <div className="flex items-center gap-3">
          {showBackButton && onBackToStudentHome && (
            <button
              id="header-back-btn"
              onClick={onBackToStudentHome}
              className="mr-1 p-2 rounded-xl text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 text-sm font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{backTitle}</span>
            </button>
          )}

          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="The English Logo"
              className="w-11 h-11 object-contain rounded-full shadow-xs bg-white p-0.5 border border-slate-200 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  The English <span className="text-[#7A93D1] font-black">Sekolah Alam Al-Karim</span>
                </span>
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  TK • SD • SMP • SMA
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium hidden sm:block italic">
                semua akan inggris pada waktunya
              </p>
            </div>
          </div>
        </div>

        {/* Right: Auth / Student Status & Admin/Teacher Login */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1 justify-end">
                  {currentUser.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5 text-[#7A93D1]" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5 text-[#8CB5D3]" />
                  )}
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {currentUser.role === 'admin' ? 'Super Admin' : `Guru (${currentUser.assignedLevelIds?.join(', ') || 'Semua'})`}
                </div>
              </div>

              <button
                id="header-logout-btn"
                onClick={logout}
                title="Keluar dari akun Guru / Admin"
                className="p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {studentSession && (
                <div className="hidden md:flex bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#7A93D1] text-white flex items-center justify-center text-xs font-bold">
                    {studentSession.name ? studentSession.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {studentSession.name || 'Siswa'}
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium leading-tight">
                      Kelas {studentSession.className || '-'}
                    </div>
                  </div>
                </div>
              )}

              {/* Tombol Login Admin / Guru dengan Pastel Card Periwinkle #7A93D1 */}
              <button
                id="header-admin-login-btn"
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#7A93D1] hover:bg-[#6B85C4] border border-white/80 shadow-xs transition-all duration-150 cursor-pointer group"
                title="Masuk ke Panel Guru / Admin"
              >
                <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-extrabold tracking-wide">Login Guru / Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
