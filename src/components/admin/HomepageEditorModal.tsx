import React, { useState, useEffect } from 'react';
import {
  HomepageConfig,
  getHomepageConfig,
  saveHomepageConfig,
  resetHomepageConfig,
  DEFAULT_HOMEPAGE_CONFIG,
} from '../../data/homepageConfig';
import {
  X,
  Save,
  RotateCcw,
  Sparkles,
  Type,
  Palette,
  Layout,
  Check,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HomepageEditorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<HomepageConfig>(getHomepageConfig());
  const [activeTab, setActiveTab] = useState<'text' | 'color' | 'typography'>('text');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getHomepageConfig());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof HomepageConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveHomepageConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset tampilan Homepage ke standar awal?')) {
      const reset = resetHomepageConfig();
      setConfig(reset);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  // Preset Theme Colors
  const applyPreset = (presetName: string) => {
    if (presetName === 'seafoam') {
      setConfig((prev) => ({
        ...prev,
        topBadgeBg: 'from-teal-600 via-emerald-600 to-indigo-600',
        cardHeaderBg: 'from-teal-600 via-emerald-600 to-teal-700',
        cardBorderColor: 'border-teal-200/90',
        submitBtnBg: 'btn-game-emerald',
      }));
    } else if (presetName === 'amber') {
      setConfig((prev) => ({
        ...prev,
        topBadgeBg: 'from-amber-500 via-orange-500 to-amber-600',
        cardHeaderBg: 'from-amber-600 via-orange-600 to-amber-700',
        cardBorderColor: 'border-amber-300',
        submitBtnBg: 'btn-game-amber',
      }));
    } else if (presetName === 'pink') {
      setConfig((prev) => ({
        ...prev,
        topBadgeBg: 'from-pink-500 via-rose-500 to-amber-400',
        cardHeaderBg: 'from-pink-600 via-rose-600 to-pink-700',
        cardBorderColor: 'border-pink-300',
        submitBtnBg: 'btn-game-pink',
      }));
    } else if (presetName === 'sky') {
      setConfig((prev) => ({
        ...prev,
        topBadgeBg: 'from-sky-500 via-blue-500 to-teal-400',
        cardHeaderBg: 'from-sky-600 via-blue-600 to-teal-600',
        cardBorderColor: 'border-sky-300',
        submitBtnBg: 'btn-game-sky',
      }));
    } else if (presetName === 'indigo') {
      setConfig((prev) => ({
        ...prev,
        topBadgeBg: 'from-indigo-600 via-purple-600 to-pink-500',
        cardHeaderBg: 'from-indigo-600 via-purple-600 to-indigo-700',
        cardBorderColor: 'border-purple-300',
        submitBtnBg: 'btn-game-indigo',
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl border-4 border-emerald-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 flex items-center justify-between border-b-4 border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-white shadow-2xs backdrop-blur-xs">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-outfit">Pengaturan Tampilan Homepage</h2>
              <p className="text-xs text-emerald-100 font-medium">
                Sesuaikan teks, warna background, ukuran font, dan label tombol halaman utama
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Toast Alert */}
        {savedSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-emerald-950 text-xs font-black animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Perubahan berhasil disimpan! Tampilan Homepage telah diperbarui secara langsung.</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2.5 rounded-t-2xl font-black text-xs flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'text'
                ? 'bg-white text-emerald-900 border-t-2 border-x border-emerald-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Type className="w-4 h-4 text-emerald-600" />
            <span>Teks &amp; Konten</span>
          </button>

          <button
            onClick={() => setActiveTab('color')}
            className={`px-4 py-2.5 rounded-t-2xl font-black text-xs flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'color'
                ? 'bg-white text-emerald-900 border-t-2 border-x border-emerald-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-500" />
            <span>Warna &amp; Theme</span>
          </button>

          <button
            onClick={() => setActiveTab('typography')}
            className={`px-4 py-2.5 rounded-t-2xl font-black text-xs flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'typography'
                ? 'bg-white text-emerald-900 border-t-2 border-x border-emerald-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layout className="w-4 h-4 text-indigo-600" />
            <span>Tipografi &amp; Font</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: TEKS & KONTEN */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  1. Teks Badge Atas (Pill Top Badge)
                </label>
                <input
                  type="text"
                  value={config.topBadgeText}
                  onChange={(e) => handleChange('topBadgeText', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Judul Utama 3 Baris */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="text-xs font-black text-slate-900 uppercase">2. Judul Utama Homepage (3 Baris)</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Baris 1 (Pembuka)</label>
                    <input
                      type="text"
                      value={config.heroTitleLine1}
                      onChange={(e) => handleChange('heroTitleLine1', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Baris 2 (Prefix)</label>
                    <input
                      type="text"
                      value={config.heroTitleLine2Prefix}
                      onChange={(e) => handleChange('heroTitleLine2Prefix', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Baris 2 (Highlight Brand)</label>
                    <input
                      type="text"
                      value={config.heroTitleLine2Highlight}
                      onChange={(e) => handleChange('heroTitleLine2Highlight', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-emerald-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Baris 3 (Nama Sekolah)</label>
                  <input
                    type="text"
                    value={config.heroTitleLine3}
                    onChange={(e) => handleChange('heroTitleLine3', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Tagline & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    3. Slogan Tagline
                  </label>
                  <input
                    type="text"
                    value={config.taglineText}
                    onChange={(e) => handleChange('taglineText', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                    4. Header Kartu Siswa (Title)
                  </label>
                  <input
                    type="text"
                    value={config.cardHeaderTitle}
                    onChange={(e) => handleChange('cardHeaderTitle', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  5. Deskripsi Subtitle
                </label>
                <textarea
                  rows={2}
                  value={config.subtitleText}
                  onChange={(e) => handleChange('subtitleText', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                  6. Label Tombol Mulai Petualangan
                </label>
                <input
                  type="text"
                  value={config.submitBtnText}
                  onChange={(e) => handleChange('submitBtnText', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: WARNA & THEME */}
          {activeTab === 'color' && (
            <div className="space-y-5">
              {/* Preset Theme Quick Picker */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  1. Pilih Tema Warna Instan (Preset Theme)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <button
                    type="button"
                    onClick={() => applyPreset('seafoam')}
                    className="p-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-xs shadow-xs hover:scale-102 transition cursor-pointer border border-teal-700 text-center"
                  >
                    Seafoam Emerald
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('amber')}
                    className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-amber-950 font-black text-xs shadow-xs hover:scale-102 transition cursor-pointer border border-amber-600 text-center"
                  >
                    Sunshine Gold
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('pink')}
                    className="p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xs shadow-xs hover:scale-102 transition cursor-pointer border border-pink-600 text-center"
                  >
                    Candy Pink
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('sky')}
                    className="p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-500 text-white font-black text-xs shadow-xs hover:scale-102 transition cursor-pointer border border-sky-600 text-center"
                  >
                    Sky Cyan
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('indigo')}
                    className="p-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs shadow-xs hover:scale-102 transition cursor-pointer border border-indigo-700 text-center"
                  >
                    Royal Indigo
                  </button>
                </div>
              </div>

              {/* Gaya Tombol 3D */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  2. Warna Tombol 3D Tactile Submit
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { key: 'btn-game-emerald', label: 'Emerald Green', bg: 'bg-emerald-600 text-white' },
                    { key: 'btn-game-amber', label: 'Amber Gold', bg: 'bg-amber-500 text-amber-950' },
                    { key: 'btn-game-pink', label: 'Candy Pink', bg: 'bg-pink-500 text-white' },
                    { key: 'btn-game-sky', label: 'Sky Blue', bg: 'bg-sky-500 text-white' },
                    { key: 'btn-game-indigo', label: 'Indigo Purple', bg: 'bg-indigo-600 text-white' },
                  ].map((btn) => (
                    <button
                      key={btn.key}
                      type="button"
                      onClick={() => handleChange('submitBtnBg', btn.key)}
                      className={`p-2.5 rounded-xl font-bold text-xs cursor-pointer flex items-center justify-between border ${
                        btn.bg
                      } ${config.submitBtnBg === btn.key ? 'ring-2 ring-emerald-500 font-black' : ''}`}
                    >
                      <span>{btn.label}</span>
                      {config.submitBtnBg === btn.key && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIPOGRAFI & FONT */}
          {activeTab === 'typography' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  1. Jenis Font Utama Aplikasi
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'Outfit', name: 'Outfit (Modern, Clean & Eye-Catching)', fontClass: 'font-outfit' },
                    { key: 'Nunito', name: 'Nunito (Soft, Round & Friendly)', fontClass: 'font-nunito' },
                    { key: 'Quicksand', name: 'Quicksand (Playful & Joyful)', fontClass: 'font-quicksand' },
                    { key: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Professional & Clean)', fontClass: '' },
                  ].map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => handleChange('fontFamily', f.key as any)}
                      className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex items-center justify-between ${
                        f.fontClass
                      } ${
                        config.fontFamily === f.key
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-black">{f.name}</div>
                        <div className="text-xs text-slate-500 font-bold mt-0.5">
                          Preview: The English Sekolah Alam Al-Karim
                        </div>
                      </div>
                      {config.fontFamily === f.key && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                  2. Ukuran Font Judul Utama (Title Size)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'normal', label: 'Standar (Medium)' },
                    { key: 'large', label: 'Besar (Large)' },
                    { key: 'xlarge', label: 'Ekstra Besar (XL)' },
                  ].map((sz) => (
                    <button
                      key={sz.key}
                      type="button"
                      onClick={() => handleChange('titleFontSize', sz.key as any)}
                      className={`p-3 rounded-xl border font-black text-xs transition cursor-pointer text-center ${
                        config.titleFontSize === sz.key
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400/30'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>Reset ke Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer transition"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl btn-game-3d btn-game-emerald text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-white" />
              <span>SIMPAN PERUBAHAN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
