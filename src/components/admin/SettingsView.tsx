import React, { useState } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';
import {
  Settings,
  RotateCcw,
  Shield,
  GraduationCap,
  Database,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Edit3,
  Building2,
  RefreshCw,
} from 'lucide-react';

interface Props {
  currentUser?: User;
  onRefreshAll: () => void;
  onOpenEditClass?: () => void;
}

export const SettingsView: React.FC<Props> = ({ currentUser, onRefreshAll, onOpenEditClass }) => {
  const [resetting, setResetting] = useState(false);
  const [msg, setMsg] = useState('');

  const isAdmin = currentUser?.role === 'admin';

  const handleResetData = async () => {
    if (!isAdmin) {
      alert('Fitur reset database hanya dapat dilakukan oleh Super Administrator.');
      return;
    }

    if (
      !window.confirm(
        'Apakah Anda yakin ingin me-reset database ke data awal kurikulum Al-Karim? Semua penambahan data custom akan dikembalikan ke default.'
      )
    )
      return;

    setResetting(true);
    setMsg('');

    try {
      await api.resetDatabase();
      setMsg('Database berhasil di-reset ke data bawaan lengkap.');
      onRefreshAll();
      setTimeout(() => setMsg(''), 4000);
    } catch (err: any) {
      alert('Gagal me-reset database: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
        <h2 className="text-xl font-bold text-gray-900">Pengaturan Sistem & Database</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Informasi konfigurasi aplikasi The English Sekolah Alam Al-Karim.
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* User Scope Info */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          {isAdmin ? <Shield className="w-4 h-4 text-indigo-600" /> : <GraduationCap className="w-4 h-4 text-emerald-600" />}
          <span>Status Akses Akun Anda</span>
        </h3>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-gray-900 text-sm">{currentUser?.name}</div>
            <div className="text-gray-500 font-mono mt-0.5">Username: {currentUser?.username} • Role: <span className="font-bold uppercase text-emerald-700">{currentUser?.role}</span></div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs">
            {isAdmin ? 'Semua Jenjang (TK, SD, SMP, SMA)' : `Jenjang Pengajaran: ${currentUser?.assignedLevelIds?.join(', ') || 'Belum Ditugaskan'}`}
          </div>
        </div>
      </div>

      {/* Class Name Management Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#7A93D1]" />
              <span>Pengelolaan Nama Kelas & Jenjang</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Ubah nama kelas (misal: "Kelas 7 Al-Farabi") atau sinkronkan otomatis dari data siswa yang sudah di-upload.
            </p>
          </div>

          {onOpenEditClass && (
            <button
              id="settings-edit-class-btn"
              type="button"
              onClick={onOpenEditClass}
              className="px-4 py-2.5 rounded-xl bg-[#7A93D1] hover:brightness-95 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-sm shrink-0 transition active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Nama Kelas</span>
            </button>
          )}
        </div>
      </div>

      {/* App Identity Info */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Profil Sekolah & Kurikulum</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
            <span className="text-gray-500 block mb-1">Nama Aplikasi:</span>
            <strong className="text-gray-900 text-sm">The English Sekolah Alam Al-Karim</strong>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
            <span className="text-gray-500 block mb-1">Institusi:</span>
            <strong className="text-gray-900 text-sm">Sekolah Alam Al-Karim (TK, SD, SMP, SMA)</strong>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
            <span className="text-gray-500 block mb-1">Cakupan Jenjang:</span>
            <strong className="text-gray-900">14 Jenjang (TK A s/d SMA 12)</strong>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
            <span className="text-gray-500 block mb-1">Maksimal Latihan Soal:</span>
            <strong className="text-gray-900">50 Soal Pilihan Ganda / Topik</strong>
          </div>
        </div>
      </div>

      {/* Quick Demo Accounts Helper */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600" />
          <span>Daftar Akun Pengajar per Jenjang (Demo Credentials)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
            <strong className="text-indigo-950 block mb-0.5">Super Admin</strong>
            <div className="text-indigo-800">
              User: <code className="font-bold">admin</code> • Pass: <code className="font-bold">admin123</code>
            </div>
            <div className="text-[10px] text-indigo-600 mt-1">Akses penuh seluruh level.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200">
            <strong className="text-pink-950 block mb-0.5">Guru TK (TK A & B)</strong>
            <div className="text-pink-800">
              User: <code className="font-bold">gurutk</code> • Pass: <code className="font-bold">guru123</code>
            </div>
            <div className="text-[10px] text-pink-600 mt-1">Khusus jenjang TK A & TK B.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <strong className="text-amber-950 block mb-0.5">Guru SD (Kelas 1 & 2)</strong>
            <div className="text-amber-800">
              User: <code className="font-bold">gurusd1</code> • Pass: <code className="font-bold">guru123</code>
            </div>
            <div className="text-[10px] text-amber-700 mt-1">Khusus SD Kelas 1 & 2.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <strong className="text-emerald-950 block mb-0.5">Guru SMP (Kelas 7 & 8)</strong>
            <div className="text-emerald-800">
              User: <code className="font-bold">guru7</code> • Pass: <code className="font-bold">guru123</code>
            </div>
            <div className="text-[10px] text-emerald-700 mt-1">Khusus SMP Kelas 7 & 8.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
            <strong className="text-blue-950 block mb-0.5">Guru SMA (Kelas 10 & 11)</strong>
            <div className="text-blue-800">
              User: <code className="font-bold">guru10</code> • Pass: <code className="font-bold">guru123</code>
            </div>
            <div className="text-[10px] text-blue-700 mt-1">Khusus SMA Kelas 10 & 11.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
            <strong className="text-purple-950 block mb-0.5">Guru SMA (Kelas 12)</strong>
            <div className="text-purple-800">
              User: <code className="font-bold">guru12</code> • Pass: <code className="font-bold">guru123</code>
            </div>
            <div className="text-[10px] text-purple-700 mt-1">Khusus SMA Kelas 12.</div>
          </div>
        </div>
      </div>

      {/* Reset Database Tool (Admin Only) */}
      {isAdmin && (
        <div className="bg-rose-50/70 p-6 rounded-3xl border border-rose-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Reset Database ke Data Standar (Super Admin)</span>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed">
            Gunakan tombol di bawah ini apabila Anda ingin memulihkan seluruh data contoh kurikulum TK s/d SMA 12 beserta bank soal bawaan.
          </p>

          <button
            id="reset-db-btn"
            type="button"
            disabled={resetting}
            onClick={handleResetData}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Memproses Reset...' : 'Reset Database ke Seed Awal'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
