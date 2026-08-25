import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Level, User } from '../../types';
import { api } from '../../services/api';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Users,
  Search,
  Sparkles,
  ClipboardPaste,
  FileText,
  Loader2,
  Check,
  GraduationCap,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  levels: Level[];
  currentUser?: User;
  onSuccess: () => void;
}

interface ParsedStudentRow {
  id: string;
  name: string;
  className: string;
  levelId: string;
  detectedLevelName: string;
}

export const ImportStudentsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  levels,
  currentUser,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [defaultLevelId, setDefaultLevelId] = useState<string>(
    currentUser?.assignedLevelIds?.[0] || levels[0]?.id || 'smp-7'
  );
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [previewSearch, setPreviewSearch] = useState('');
  const [fileName, setFileName] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [importResult, setImportResult] = useState<{
    count: number;
    createdCount: number;
    updatedCount: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Helper to map class to level
  const resolveLevel = (className: string, explicitLevel?: string): { id: string; name: string } => {
    if (explicitLevel) {
      const found = levels.find(
        (l) =>
          l.id.toLowerCase() === explicitLevel.toLowerCase() ||
          l.name.toLowerCase().includes(explicitLevel.toLowerCase()) ||
          l.grade.toLowerCase().includes(explicitLevel.toLowerCase())
      );
      if (found) return { id: found.id, name: found.name };
    }

    const c = (className || '').toUpperCase().trim();
    if (c.includes('PATIMURA') || c.includes('DIPONEGORO') || c.includes('SUDIRMAN') || c.includes('ANTASARI') || c.includes('TK')) {
      const lvl = levels.find((l) => l.id === 'tk') || levels[0];
      return { id: lvl?.id || 'tk', name: lvl?.name || 'Jenjang TK' };
    }

    if (c.includes('SALMAN') || c.includes('ALFARISI') || c.includes('HURAIRAH') || c.includes('MUSHAB') || c.includes('YASIR') || c.includes('SMP') || c.includes('KELAS 7') || c.includes('KELAS 8') || c.includes('KELAS 9')) {
      const lvl = levels.find((l) => l.id === 'smp') || levels[0];
      return { id: lvl?.id || 'smp', name: lvl?.name || 'Jenjang SMP' };
    }

    if (c.includes('FATIH') || c.includes('THARIQ') || c.includes('ZIYAD') || c.includes('SALAHUDIN') || c.includes('AYYUBI') || c.includes('SMA') || c.includes('KELAS 10') || c.includes('KELAS 11') || c.includes('KELAS 12')) {
      const lvl = levels.find((l) => l.id === 'sma') || levels[0];
      return { id: lvl?.id || 'sma', name: lvl?.name || 'Jenjang SMA' };
    }

    // Default SD level
    const def = levels.find((l) => l.id === 'sd') || levels.find((l) => l.id === defaultLevelId) || levels[0];
    return { id: def?.id || 'sd', name: def?.name || 'Jenjang SD' };
  };

  // Parse raw matrix / object array from Excel / CSV
  const processRawData = (rows: any[][], sourceName: string) => {
    if (!rows || rows.length < 2) {
      setError('File atau data tidak memiliki baris data yang cukup. Pastikan ada baris judul kolom dan minimal 1 baris siswa.');
      return;
    }

    // Identify header row
    const headerRow = rows[0].map((h: any) => String(h || '').trim().toLowerCase());
    let nameIdx = -1;
    let classIdx = -1;
    let levelIdx = -1;

    headerRow.forEach((col, idx) => {
      if (
        col.includes('nama') ||
        col.includes('student') ||
        col.includes('name') ||
        col.includes('peserta') ||
        col.includes('siswa')
      ) {
        if (nameIdx === -1) nameIdx = idx;
      }
      if (
        col.includes('kelas') ||
        col.includes('class') ||
        col.includes('rombel') ||
        col.includes('tingkat') ||
        col.includes('grade') ||
        col.includes('kls')
      ) {
        if (classIdx === -1) classIdx = idx;
      }
      if (col.includes('jenjang') || col.includes('level')) {
        if (levelIdx === -1) levelIdx = idx;
      }
    });

    // Fallbacks if headers didn't match standard names
    if (nameIdx === -1) nameIdx = 0;
    if (classIdx === -1) classIdx = rows[0].length > 1 ? 1 : 0;

    const parsed: ParsedStudentRow[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const rawName = String(row[nameIdx] || '').trim();
      const rawClass = String(row[classIdx] || '').trim();
      const rawLevel = levelIdx !== -1 ? String(row[levelIdx] || '').trim() : '';

      // Skip header duplicates or empty names
      if (!rawName || rawName.toLowerCase() === 'nama' || rawName.toLowerCase() === 'nama siswa') {
        continue;
      }

      const effectiveClass = rawClass || 'Kelas Siswa';
      const resolved = resolveLevel(effectiveClass, rawLevel);

      parsed.push({
        id: `row-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
        name: rawName,
        className: effectiveClass,
        levelId: resolved.id,
        detectedLevelName: resolved.name,
      });
    }

    if (parsed.length === 0) {
      setError('Tidak ditemukan data siswa yang valid pada file ini. Pastikan format kolom berisi Nama dan Kelas.');
      return;
    }

    setParsedRows(parsed);
    setFileName(sourceName);
    setError('');
  };

  // Handle Excel file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonSheet = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
        processRawData(jsonSheet, file.name);
      } catch (err: any) {
        setError('Gagal membaca file Excel: ' + (err.message || 'Format tidak didukung'));
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle Text/Table Paste
  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setError('Mohon tempelkan teks tabel dari Excel terlebih dahulu.');
      return;
    }

    setError('');
    const lines = pastedText
      .trim()
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setError('Teks kosong.');
      return;
    }

    const rows = lines.map((line) => {
      if (line.includes('\t')) return line.split('\t');
      if (line.includes(';')) return line.split(';');
      if (line.includes(',')) return line.split(',');
      return [line];
    });

    processRawData(rows, 'Teks Ditempel (Copy-Paste)');
  };

  // Delete row from preview
  const handleRemoveRow = (id: string) => {
    setParsedRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Download Sample Excel Template
  const handleDownloadExcelTemplate = () => {
    const sampleData = [
      ['Nama Siswa', 'Kelas', 'Jenjang / Level (Opsional)'],
      ['Ahmad Fadhil Pratama', 'Kelas 7A', 'SMP Kelas 7'],
      ['Aisyah Humaira Putri', 'Kelas 7B', 'SMP Kelas 7'],
      ['Muhammad Rayyan Al-Ghifari', 'Kelas 4A', 'SD Kelas 4'],
      ['Fathimah Az-Zahra', 'Kelas 4B', 'SD Kelas 4'],
      ['Ibrahim Khalilullah', 'Kelas 10 MIPA 1', 'SMA Kelas 10'],
      ['Maryam Khadijah', 'TK B', 'TK B'],
      ['Bilal bin Rabah', 'Kelas 8A', 'SMP Kelas 8'],
      ['Khadijah Al-Kubra', 'Kelas 2', 'SD Kelas 2'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleData);

    // Set column widths
    ws['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 25 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Siswa');

    XLSX.writeFile(wb, 'Template_Import_Siswa_AlKarim.xlsx');
  };

  // Download CSV Template
  const handleDownloadCsvTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Nama Siswa,Kelas,Jenjang',
        '"Ahmad Fadhil Pratama","Kelas 7A","SMP Kelas 7"',
        '"Aisyah Humaira Putri","Kelas 7B","SMP Kelas 7"',
        '"Muhammad Rayyan Al-Ghifari","Kelas 4A","SD Kelas 4"',
        '"Fathimah Az-Zahra","Kelas 4B","SD Kelas 4"',
        '"Ibrahim Khalilullah","Kelas 10 MIPA","SMA Kelas 10"',
        '"Maryam Khadijah","TK B","TK B"',
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Template_Import_Siswa_AlKarim.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Execute Bulk Import API
  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) {
      setError('Tidak ada data siswa untuk diimpor.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = parsedRows.map((r) => ({
        name: r.name,
        className: r.className,
        levelId: r.levelId,
      }));

      const res = await api.bulkImportStudents(payload, defaultLevelId);
      setImportResult({
        count: res.count,
        createdCount: res.createdCount,
        updatedCount: res.updatedCount,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengimpor data siswa.');
    } finally {
      setLoading(false);
    }
  };

  // Filter preview list
  const filteredPreview = parsedRows.filter((r) => {
    const s = previewSearch.toLowerCase();
    return (
      r.name.toLowerCase().includes(s) ||
      r.className.toLowerCase().includes(s) ||
      r.detectedLevelName.toLowerCase().includes(s)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-200 border border-white/15">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                Import Data Siswa (Excel & CSV)
              </h3>
              <p className="text-xs text-emerald-200/90 font-medium">
                Daftarkan siswa dalam jumlah banyak sekaligus dengan format Nama dan Kelas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* SUCCESS VIEW */}
          {importResult ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-gray-900">
                  Import Siswa Berhasil!
                </h4>
                <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">
                  Sebanyak <strong>{importResult.count}</strong> data siswa telah berhasil diproses ke dalam database The English Al-Karim.
                </p>
              </div>

              <div className="flex justify-center gap-4 max-w-sm mx-auto pt-2">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex-1">
                  <div className="text-2xl font-black text-emerald-800">{importResult.createdCount}</div>
                  <div className="text-xs font-bold text-emerald-700">Siswa Baru Terdaftar</div>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex-1">
                  <div className="text-2xl font-black text-teal-800">{importResult.updatedCount}</div>
                  <div className="text-xs font-bold text-teal-700">Data Siswa Diperbarui</div>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setImportResult(null);
                    setParsedRows([]);
                    setFileName('');
                    setPastedText('');
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  Import Lagi
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition cursor-pointer"
                >
                  Selesai & Lihat Data Siswa
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Template Download & Info Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-extrabold text-emerald-950">
                      Format Excel: Kolom "Nama Siswa" dan "Kelas"
                    </h5>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                      Sistem otomatis mendeteksi jenjang (TK, SD, SMP, SMA) dari nama kelas yang diinput (contoh: <em>Kelas 7A, 4B, TK A</em>).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadExcelTemplate}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition"
                    title="Download template format file Excel (.xlsx)"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Download Template Excel</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCsvTemplate}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer transition"
                    title="Download format CSV"
                  >
                    <span>.CSV</span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Input Method Tabs */}
              <div className="flex border-b border-gray-200 gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`pb-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                    activeTab === 'upload'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload File Excel / CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`pb-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition cursor-pointer ${
                    activeTab === 'paste'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <ClipboardPaste className="w-4 h-4" />
                  <span>Copy-Paste Tabel dari Excel / Sheets</span>
                </button>
              </div>

              {/* TAB 1: FILE UPLOAD */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 group-hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {fileName ? `File Terpilih: ${fileName}` : 'Klik untuk Pilih File atau Seret ke Sini'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Mendukung format <strong>.xlsx</strong>, <strong>.xls</strong>, dan <strong>.csv</strong>
                      </p>
                    </div>
                    {fileName && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200">
                        {parsedRows.length} Siswa Terbaca
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: COPY-PASTE */}
              {activeTab === 'paste' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-600">
                    Buka file Excel atau Google Spreadsheet Anda, pilih kolom <strong>Nama</strong> dan <strong>Kelas</strong>, lalu copy (Ctrl+C) dan paste (Ctrl+V) di bawah ini:
                  </p>
                  <textarea
                    rows={5}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder={`Nama Siswa\tKelas\nAhmad Fadhil\tKelas 7A\nAisyah Putri\tKelas 7B\nMuhammad Rayyan\tKelas 4`}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-gray-300 text-xs font-mono bg-gray-50/50 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleParsePastedText}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Proses Data Teks</span>
                  </button>
                </div>
              )}

              {/* Default Level Fallback Setting */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="text-xs">
                  <span className="font-bold text-gray-800 block">Jenjang Default (Jika Tidak Terdeteksi Otomatis):</span>
                  <span className="text-gray-500 text-[11px]">Digunakan bila kelas tidak mencantumkan nomor kelas secara jelas</span>
                </div>
                <select
                  value={defaultLevelId}
                  onChange={(e) => {
                    setDefaultLevelId(e.target.value);
                    // Re-resolve existing rows if any
                    setParsedRows((prev) =>
                      prev.map((r) => {
                        const resolved = resolveLevel(r.className);
                        return {
                          ...r,
                          levelId: resolved.id,
                          detectedLevelName: resolved.name,
                        };
                      })
                    );
                  }}
                  className="px-3 py-1.5 bg-white rounded-xl border border-gray-300 text-xs font-semibold text-gray-800 shrink-0"
                >
                  {levels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.grade})
                    </option>
                  ))}
                </select>
              </div>

              {/* PREVIEW TABLE */}
              {parsedRows.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-gray-900">
                        Pratinjau Data Siswa ({parsedRows.length} Siswa)
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Siap Diimport
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={previewSearch}
                          onChange={(e) => setPreviewSearch(e.target.value)}
                          placeholder="Cari di pratinjau..."
                          className="pl-8 pr-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200 text-xs focus:bg-white outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setParsedRows([]);
                          setFileName('');
                          setPastedText('');
                        }}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition cursor-pointer"
                        title="Hapus Semua Data Pratinjau"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100/80 text-gray-700 font-bold sticky top-0 border-b border-gray-200">
                        <tr>
                          <th className="p-2.5 pl-3.5 w-12 text-center">No</th>
                          <th className="p-2.5">Nama Siswa</th>
                          <th className="p-2.5">Kelas</th>
                          <th className="p-2.5">Jenjang Terdeteksi</th>
                          <th className="p-2.5 text-center w-12">Hapus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredPreview.map((row, idx) => (
                          <tr key={row.id} className="hover:bg-emerald-50/30 transition">
                            <td className="p-2.5 pl-3.5 text-center text-gray-400 font-medium">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-gray-900">{row.name}</td>
                            <td className="p-2.5 text-gray-700 font-semibold">{row.className}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {row.detectedLevelName}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(row.id)}
                                className="p-1 text-gray-400 hover:text-rose-600 rounded-md transition cursor-pointer"
                                title="Keluarkan baris ini"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!importResult && (
          <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200/70 rounded-xl transition cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={parsedRows.length === 0 || loading}
              onClick={handleExecuteImport}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses Import...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Import {parsedRows.length} Siswa Sekarang</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
