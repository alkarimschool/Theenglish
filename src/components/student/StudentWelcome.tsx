import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Level, StudentProfile } from '../../types';
import logoImg from '../../assets/logo.png';
import { getHomepageConfig, HomepageConfig } from '../../data/homepageConfig';
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  ChevronDown,
  Edit3,
  Shield,
  Search,
  CheckCircle2,
  X,
  GraduationCap,
  Users,
  Database,
  Building2,
  User,
} from 'lucide-react';

interface Props {
  levels?: Level[];
  onContinue: (levelId?: string) => void;
  onOpenLogin?: () => void;
}

export const StudentWelcome: React.FC<Props> = ({ levels = [], onContinue, onOpenLogin }) => {
  const { startStudent, studentSession } = useAuth();

  // Dynamic Homepage Config state
  const [hpConfig, setHpConfig] = useState<HomepageConfig>(getHomepageConfig());

  useEffect(() => {
    const handleUpdate = () => setHpConfig(getHomepageConfig());
    window.addEventListener('homepage-config-updated', handleUpdate);
    return () => window.removeEventListener('homepage-config-updated', handleUpdate);
  }, []);

  // Database students state
  const [dbStudents, setDbStudents] = useState<StudentProfile[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // Form state
  const [name, setName] = useState(studentSession?.name || '');
  const [className, setClassName] = useState(studentSession?.className || '');
  const [selectedLevelId, setSelectedLevelId] = useState('sd-4');
  const [showManualLevelPicker, setShowManualLevelPicker] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Autocomplete UI state
  const [isNameDropdownOpen, setIsNameDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Class Autocomplete UI state
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [highlightedClassIndex, setHighlightedClassIndex] = useState(-1);
  const classDropdownRef = useRef<HTMLDivElement>(null);
  const classInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch registered students from database
  useEffect(() => {
    let isMounted = true;
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const data = await api.getStudents();
        if (isMounted && Array.isArray(data)) {
          setDbStudents(data);

          // If studentSession exists, link to matching profile
          if (studentSession?.name) {
            const match = data.find(
              (s) =>
                s.name.toLowerCase() === studentSession.name.toLowerCase() &&
                (!studentSession.className || s.className.toLowerCase() === studentSession.className.toLowerCase())
            );
            if (match) setSelectedStudent(match);
          }
        }
      } catch (err) {
        console.warn('Could not fetch student list from database:', err);
      } finally {
        if (isMounted) setLoadingStudents(false);
      }
    };

    fetchStudents();
    return () => {
      isMounted = false;
    };
  }, [studentSession]);

  // Click outside to close name & class search dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNameDropdownOpen(false);
      }
      if (classDropdownRef.current && !classDropdownRef.current.contains(e.target as Node)) {
        setIsClassDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Standard static class groups
  const standardClassGroups = useMemo(
    () => [
      {
        group: 'Jenjang TK (Taman Kanak-Kanak)',
        classes: [
          { label: 'TK A Patimura', levelId: 'tk', groupName: 'Jenjang TK' },
          { label: 'TK B Diponegoro', levelId: 'tk', groupName: 'Jenjang TK' },
          { label: 'TK B Jendral Sudirman', levelId: 'tk', groupName: 'Jenjang TK' },
          { label: 'TK B Pangeran Antasari', levelId: 'tk', groupName: 'Jenjang TK' },
        ],
      },
      {
        group: 'Jenjang SD (Sekolah Dasar)',
        classes: [
          { label: 'Kelas 1 Abu Bakar', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 1 Umar Bin Khattab', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 2 Ali Bin Abi Thalib', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 2 Thalhah bin Ubaidillah', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 2 Utsman bin Affan', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 3 Abdurrahman Bin Auf', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 3 Bilal Bin Rabah', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 3 Khalid Bin Walid', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 4 Muadz Bin Jabbal', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 4 Said Bin Zaid', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 4 Zubair Bin Awwam', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 5 Hamzah bin Abdul Muthalib', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 5 Hudzaifah Bin Al Yaman', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 5 Saad Bin Abi Waqqash', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 6 Abu Ubaidah Bin Al-Jarrah', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 6 Amr Bin Ash', levelId: 'sd', groupName: 'Jenjang SD' },
          { label: 'Kelas 6 Anas Bin Malik', levelId: 'sd', groupName: 'Jenjang SD' },
        ],
      },
      {
        group: 'Jenjang SMP (Sekolah Menengah Pertama)',
        classes: [
          { label: 'Kelas 7 Salman Alfarisi', levelId: 'smp', groupName: 'Jenjang SMP' },
          { label: 'Kelas 8 Abu Hurairah', levelId: 'smp', groupName: 'Jenjang SMP' },
          { label: 'Kelas 8 Mushab Bin Umair', levelId: 'smp', groupName: 'Jenjang SMP' },
          { label: 'Kelas 9 Amr bin Yasir', levelId: 'smp', groupName: 'Jenjang SMP' },
        ],
      },
      {
        group: 'Jenjang SMA (Sekolah Menengah Atas)',
        classes: [
          { label: 'Kelas 10 Muhammad Al-Fatih', levelId: 'sma', groupName: 'Jenjang SMA' },
          { label: 'Kelas 11 Thariq bin Ziyad', levelId: 'sma', groupName: 'Jenjang SMA' },
          { label: 'Kelas 12 Salahudin Al-Ayyubi', levelId: 'sma', groupName: 'Jenjang SMA' },
        ],
      },
    ],
    []
  );

  // Extract unique classes from DB that might not be in standard list (e.g., "Kelas 7A", "4B", etc.)
  const importedClassOptions = useMemo(() => {
    const classMap = new Map<string, { className: string; levelId: string; studentCount: number }>();

    dbStudents.forEach((st) => {
      const c = (st.className || '').trim();
      if (!c) return;
      const key = c.toLowerCase();
      if (!classMap.has(key)) {
        classMap.set(key, { className: c, levelId: st.levelId, studentCount: 1 });
      } else {
        const item = classMap.get(key)!;
        item.studentCount += 1;
      }
    });

    return Array.from(classMap.values()).sort((a, b) => a.className.localeCompare(b.className));
  }, [dbStudents]);

  // Master list of all class options for search
  const allClassOptions = useMemo(() => {
    const list: Array<{
      label: string;
      levelId: string;
      groupName: string;
      studentCount?: number;
      isDatabase: boolean;
    }> = [];

    const addedKeys = new Set<string>();

    // 1. First add classes from Database
    importedClassOptions.forEach((c) => {
      const key = c.className.toLowerCase();
      addedKeys.add(key);
      list.push({
        label: c.className,
        levelId: c.levelId || 'sd-4',
        groupName: 'Kelas Database Siswa',
        studentCount: c.studentCount,
        isDatabase: true,
      });
    });

    // 2. Then add standard curriculum classes
    standardClassGroups.forEach((grp) => {
      grp.classes.forEach((cls) => {
        const key = cls.label.toLowerCase();
        if (!addedKeys.has(key)) {
          addedKeys.add(key);
          list.push({
            label: cls.label,
            levelId: cls.levelId,
            groupName: grp.group,
            isDatabase: false,
          });
        }
      });
    });

    return list;
  }, [importedClassOptions, standardClassGroups]);

  // Helper to detect levelId from class string
  const detectLevelId = (cls: string, fallback = 'sd-4'): string => {
    const c = (cls || '').toUpperCase().trim();
    if (!c) return fallback;

    if (c.includes('TK A') || c === 'TKA') return 'tk-a';
    if (c.includes('TK B') || c === 'TKB' || c.includes('TK')) return 'tk-b';

    // SMA
    if (c.includes('SMA 10') || c.includes('KELAS 10') || c.includes('KLAS 10') || c.includes('X ') || c.endsWith('X') || c.includes('10')) return 'sma-10';
    if (c.includes('SMA 11') || c.includes('KELAS 11') || c.includes('KLAS 11') || c.includes('XI ') || c.endsWith('XI') || c.includes('11')) return 'sma-11';
    if (c.includes('SMA 12') || c.includes('KELAS 12') || c.includes('KLAS 12') || c.includes('XII ') || c.endsWith('XII') || c.includes('12')) return 'sma-12';

    // SMP
    if (c.includes('SMP 7') || c.includes('KELAS 7') || c.includes('KLAS 7') || c.includes('VII ') || c.endsWith('VII') || c.includes('7')) return 'smp-7';
    if (c.includes('SMP 8') || c.includes('KELAS 8') || c.includes('KLAS 8') || c.includes('VIII ') || c.endsWith('VIII') || c.includes('8')) return 'smp-8';
    if (c.includes('SMP 9') || c.includes('KELAS 9') || c.includes('KLAS 9') || c.includes('IX ') || c.endsWith('IX') || c.includes('9')) return 'smp-9';

    // SD
    for (let i = 1; i <= 6; i++) {
      if (c.includes(`SD ${i}`) || c.includes(`KELAS ${i}`) || c.includes(`KLAS ${i}`) || c.includes(`${i} `) || c.endsWith(`${i}`)) {
        return `sd-${i}`;
      }
    }

    return fallback;
  };

  // Helper to format level name for display
  const getLevelDisplayName = (lvlId: string): string => {
    const found = levels.find((l) => l.id === lvlId);
    if (found) return `${found.name} (${found.grade})`;
    switch (lvlId) {
      case 'tk-a': return 'TK A';
      case 'tk-b': return 'TK B';
      case 'sd-1': return 'SD Kelas 1';
      case 'sd-2': return 'SD Kelas 2';
      case 'sd-3': return 'SD Kelas 3';
      case 'sd-4': return 'SD Kelas 4';
      case 'sd-5': return 'SD Kelas 5';
      case 'sd-6': return 'SD Kelas 6';
      case 'smp-7': return 'SMP Kelas 7';
      case 'smp-8': return 'SMP Kelas 8';
      case 'smp-9': return 'SMP Kelas 9';
      case 'sma-10': return 'SMA Kelas 10';
      case 'sma-11': return 'SMA Kelas 11';
      case 'sma-12': return 'SMA Kelas 12';
      default: return 'SD Kelas 4';
    }
  };

  // Filter class suggestions based on user search query
  const filteredClassSuggestions = useMemo(() => {
    const query = className.trim().toLowerCase();

    if (!query) {
      return allClassOptions;
    }

    return allClassOptions
      .filter((c) => {
        const matchesLabel = c.label.toLowerCase().includes(query);
        const matchesGroup = c.groupName.toLowerCase().includes(query);
        const levelName = getLevelDisplayName(c.levelId).toLowerCase();
        const matchesLevel = levelName.includes(query);
        return matchesLabel || matchesGroup || matchesLevel;
      })
      .sort((a, b) => {
        const aExact = a.label.toLowerCase() === query;
        const bExact = b.label.toLowerCase() === query;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        const aStarts = a.label.toLowerCase().startsWith(query);
        const bStarts = b.label.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        // DB classes first
        if (a.isDatabase && !b.isDatabase) return -1;
        if (!a.isDatabase && b.isDatabase) return 1;

        return a.label.localeCompare(b.label);
      });
  }, [allClassOptions, className]);

  // Check if current class exists in database
  const isCurrentClassInDb = useMemo(() => {
    if (!className.trim()) return false;
    return importedClassOptions.some((c) => c.className.toLowerCase() === className.trim().toLowerCase());
  }, [importedClassOptions, className]);

  // Filter student suggestions based on user search and optionally selected class
  const filteredSuggestions = useMemo(() => {
    const query = name.trim().toLowerCase();

    // If query is empty, show students from selected class (if any) or first 10 students
    if (!query) {
      if (className) {
        const classFiltered = dbStudents.filter((s) => (s.className || '').toLowerCase() === className.toLowerCase());
        if (classFiltered.length > 0) return classFiltered.slice(0, 15);
      }
      return dbStudents.slice(0, 10);
    }

    // Filter by name and class
    return dbStudents
      .filter((s) => {
        const matchesName = (s.name || '').toLowerCase().includes(query);
        const matchesClass = (s.className || '').toLowerCase().includes(query);
        return matchesName || matchesClass;
      })
      .sort((a, b) => {
        // Prioritize exact name prefix matches
        const aStarts = a.name.toLowerCase().startsWith(query);
        const bStarts = b.name.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        // Then prioritize current class matches
        if (className) {
          const aClass = a.className.toLowerCase() === className.toLowerCase();
          const bClass = b.className.toLowerCase() === className.toLowerCase();
          if (aClass && !bClass) return -1;
          if (!aClass && bClass) return 1;
        }

        return a.name.localeCompare(b.name);
      })
      .slice(0, 15);
  }, [dbStudents, name, className]);

  // Handle selecting a student from the dropdown list
  const handleSelectStudent = (st: StudentProfile) => {
    setName(st.name);
    setClassName(st.className);
    setSelectedLevelId(st.levelId || detectLevelId(st.className));
    setSelectedStudent(st);
    setIsNameDropdownOpen(false);
    setError('');
  };

  // Handle selecting a class from class dropdown
  const handleSelectClass = (clsLabel: string, lvlId?: string) => {
    setClassName(clsLabel);
    const targetLvl = lvlId || detectLevelId(clsLabel, selectedLevelId);
    setSelectedLevelId(targetLvl);
    setIsClassDropdownOpen(false);
    setError('');

    // If currently selected student belongs to a different class, reset verified student badge
    if (selectedStudent && selectedStudent.className.toLowerCase() !== clsLabel.toLowerCase()) {
      setSelectedStudent(null);
    }
  };

  // Keyboard navigation inside student search dropdown
  const handleStudentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isNameDropdownOpen || filteredSuggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsNameDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
      e.preventDefault();
      handleSelectStudent(filteredSuggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsNameDropdownOpen(false);
    }
  };

  // Keyboard navigation inside class search dropdown
  const handleClassKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isClassDropdownOpen || filteredClassSuggestions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsClassDropdownOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedClassIndex((prev) => (prev < filteredClassSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedClassIndex((prev) => (prev > 0 ? prev - 1 : filteredClassSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedClassIndex >= 0 && highlightedClassIndex < filteredClassSuggestions.length) {
        const item = filteredClassSuggestions[highlightedClassIndex];
        handleSelectClass(item.label, item.levelId);
      } else if (className.trim()) {
        handleSelectClass(className.trim(), detectLevelId(className.trim()));
      }
    } else if (e.key === 'Escape') {
      setIsClassDropdownOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Mohon masukkan atau pilih Nama Siswa.');
      return;
    }
    if (!className.trim()) {
      setError('Mohon pilih Kelas terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const targetLevel = selectedLevelId || detectLevelId(className.trim());
      const student = await api.startStudentSession(name.trim(), className.trim(), targetLevel);
      startStudent(student.name, student.className, student.levelId, student.id);
      onContinue(targetLevel);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memulai sesi.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to highlight matched query text
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const q = query.trim().toLowerCase();
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;

    return (
      <>
        {text.substring(0, idx)}
        <span className="bg-amber-200 text-amber-950 font-black rounded-xs px-0.5">
          {text.substring(idx, idx + q.length)}
        </span>
        {text.substring(idx + q.length)}
      </>
    );
  };

  // Font family helper class
  const fontClass =
    hpConfig.fontFamily === 'Outfit'
      ? 'font-outfit'
      : hpConfig.fontFamily === 'Nunito'
      ? 'font-nunito'
      : hpConfig.fontFamily === 'Quicksand'
      ? 'font-quicksand'
      : '';

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 ${fontClass}`}>
      <div className="w-full max-w-md relative z-10">
        
        {/* Decorative Top Typography Header - Dynamic Config */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${hpConfig.topBadgeBg || 'from-teal-600 via-emerald-600 to-indigo-600'} text-white text-xs font-black tracking-wider border-2 border-white shadow-md mb-3.5 animate-float`}>
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span className="uppercase tracking-widest text-[11px]">{hpConfig.topBadgeText || 'THE ENGLISH SEKOLAH ALAM AL-KARIM'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug drop-shadow-xs">
            {hpConfig.heroTitleLine1 || 'Selamat Datang di'} <br />
            <span className="text-teal-800 font-extrabold">{hpConfig.heroTitleLine2Prefix || 'The '}</span>
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent uppercase font-black tracking-wide">
              {hpConfig.heroTitleLine2Highlight || 'ENGLISH'}
            </span>
            <br />
            <span className="text-emerald-700 font-extrabold text-xl sm:text-2.5xl">
              {hpConfig.heroTitleLine3 || 'Sekolah Alam Al-Karim'}
            </span>
          </h1>

          {hpConfig.taglineText && (
            <div className={`mt-3 inline-block px-4 py-1.5 rounded-2xl ${hpConfig.taglineBg || 'bg-teal-50/90 border border-teal-200/90'} shadow-2xs`}>
              <p className={`text-xs sm:text-sm font-extrabold ${hpConfig.taglineTextColor || 'text-teal-900'}`}>
                &ldquo;<span className="text-teal-700 font-black underline decoration-amber-400 decoration-3">{hpConfig.taglineText}</span>&rdquo;
              </p>
            </div>
          )}

          <p className="mt-2 text-xs text-slate-600 font-extrabold">
            {hpConfig.subtitleText || 'Media Pembelajaran & Evaluasi Bahasa Inggris Interaktif (TK, SD, SMP, SMA)'}
          </p>
        </div>

        {/* Student Login Control Station - Dynamic Config */}
        <div className={`bg-white/95 backdrop-blur-md rounded-3xl border-3 ${hpConfig.cardBorderColor || 'border-teal-200/90'} shadow-xl shadow-teal-950/5 relative overflow-hidden`}>
          {/* Card Top Block with Dynamic Gradient */}
          <div className={`bg-gradient-to-r ${hpConfig.cardHeaderBg || 'from-teal-600 via-emerald-600 to-teal-700'} text-white p-5 relative border-b-3 border-teal-800 shadow-xs`}>
            <div className="flex items-center justify-between gap-3.5">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold shadow-2xs backdrop-blur-xs">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white leading-tight">{hpConfig.cardHeaderTitle || 'Mulai Petualangan'}</h2>
                  <p className="text-xs text-teal-100 font-semibold">
                    {dbStudents.length > 0
                      ? (hpConfig.cardHeaderSubtitle || 'Cari nama dari {count} siswa terdaftar').replace('{count}', String(dbStudents.length))
                      : 'Masukkan Nama &amp; pilih Kelas'}
                  </p>
                </div>
              </div>

              {dbStudents.length > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 border border-amber-500 shadow-2xs">
                  <Database className="w-3.5 h-3.5 text-amber-950" />
                  <span>{dbStudents.length} Siswa</span>
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Nama Siswa dengan Pencarian Dropdown & Autocomplete */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="student-name-input"
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  NAMA SISWA <span className="text-rose-500">*</span>
                </label>
                {selectedStudent && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Terdaftar di Database</span>
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  ref={nameInputRef}
                  id="student-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setIsNameDropdownOpen(true);
                    setHighlightedIndex(-1);
                    if (selectedStudent && e.target.value !== selectedStudent.name) {
                      setSelectedStudent(null);
                    }
                  }}
                  onFocus={() => setIsNameDropdownOpen(true)}
                  onKeyDown={handleStudentKeyDown}
                  placeholder={
                    loadingStudents
                      ? 'Memuat data siswa...'
                      : dbStudents.length > 0
                      ? 'Ketik untuk mencari nama siswa...'
                      : 'Contoh: Ahmad Fauzan'
                  }
                  required
                  autoComplete="off"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm font-medium text-gray-900 outline-none transition ${
                    selectedStudent
                      ? 'border-emerald-500 bg-emerald-50/30 focus:ring-3 focus:ring-emerald-100'
                      : 'border-gray-200 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100 bg-white'
                  }`}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                {name && (
                  <button
                    type="button"
                    onClick={() => {
                      setName('');
                      setSelectedStudent(null);
                      nameInputRef.current?.focus();
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 absolute right-3 top-1/2 -translate-y-1/2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                    title="Hapus Nama"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* SEARCH SUGGESTIONS DROPDOWN */}
              {isNameDropdownOpen && dbStudents.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border-2 border-emerald-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-64 flex flex-col">
                  {/* Dropdown Header Info */}
                  <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between text-[11px] font-bold text-emerald-950 shrink-0">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-700" />
                      {name.trim()
                        ? `Hasil Pencarian (${filteredSuggestions.length} Siswa)`
                        : className
                        ? `Daftar Siswa Kelas ${className} (${filteredSuggestions.length})`
                        : `Pilih atau Ketik Nama Siswa (${dbStudents.length} Terdaftar)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsNameDropdownOpen(false)}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Suggestions List */}
                  <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((st, idx) => {
                        const isHighlighted = idx === highlightedIndex;
                        const isSelected = selectedStudent?.id === st.id;

                        return (
                          <div
                            key={st.id}
                            id={`student-suggestion-${st.id}`}
                            onClick={() => handleSelectStudent(st)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`p-3 text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-emerald-100/70 text-emerald-950 font-bold'
                                : isHighlighted
                                ? 'bg-emerald-50/80 text-gray-900'
                                : 'hover:bg-emerald-50/40 text-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                                <User className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-gray-900 truncate">
                                  {renderHighlightedText(st.name, name)}
                                </div>
                                <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                                  <span className="font-semibold text-emerald-700">{st.className}</span>
                                  <span>•</span>
                                  <span>{getLevelDisplayName(st.levelId)}</span>
                                </div>
                              </div>
                            </div>

                            <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Pilih
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-500 space-y-1">
                        <p className="font-semibold text-gray-700">Nama tidak ditemukan di database</p>
                        <p className="text-[11px] text-gray-500">
                          Kamu tetap bisa lanjut belajar dengan mengetik nama dan memilih kelas secara manual.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Footer Hint */}
                  <div className="p-2 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 text-center shrink-0">
                    Gunakan tombol <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded-sm">↑</kbd>{' '}
                    <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded-sm">↓</kbd> dan{' '}
                    <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded-sm">Enter</kbd> untuk memilih
                  </div>
                </div>
              )}

              {/* Verified Student Info Card */}
              {selectedStudent && (
                <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold">Kelas {selectedStudent.className}</span>
                      <span className="text-emerald-700 text-[11px] ml-1.5">
                        ({getLevelDisplayName(selectedStudent.levelId)})
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudent(null);
                      nameInputRef.current?.focus();
                    }}
                    className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                  >
                    Ganti
                  </button>
                </div>
              )}
            </div>

            {/* Pilihan & Pencarian Kelas dengan Autocomplete */}
            <div className="relative" ref={classDropdownRef}>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="student-class-input"
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  PILIH / CARI KELAS <span className="text-rose-500">*</span>
                </label>
                {isCurrentClassInDb && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    <span>Kelas Terdaftar Database</span>
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  ref={classInputRef}
                  id="student-class-input"
                  type="text"
                  value={className}
                  onChange={(e) => {
                    setClassName(e.target.value);
                    setIsClassDropdownOpen(true);
                    setHighlightedClassIndex(-1);
                    const detected = detectLevelId(e.target.value, selectedLevelId);
                    setSelectedLevelId(detected);
                    if (selectedStudent && selectedStudent.className.toLowerCase() !== e.target.value.toLowerCase()) {
                      setSelectedStudent(null);
                    }
                  }}
                  onFocus={() => setIsClassDropdownOpen(true)}
                  onKeyDown={handleClassKeyDown}
                  placeholder="Ketik untuk mencari kelas (Contoh: 7A, 4B, TK, 10)..."
                  required
                  autoComplete="off"
                  className={`w-full pl-10 pr-16 py-3 rounded-xl border text-sm font-semibold text-gray-900 outline-none transition ${
                    isCurrentClassInDb
                      ? 'border-teal-500 bg-teal-50/30 focus:ring-3 focus:ring-emerald-100'
                      : 'border-gray-200 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100 bg-white'
                  }`}
                />
                <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {className && (
                    <button
                      type="button"
                      onClick={() => {
                        setClassName('');
                        classInputRef.current?.focus();
                        setIsClassDropdownOpen(true);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
                      title="Hapus Kelas"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsClassDropdownOpen((prev) => !prev);
                      classInputRef.current?.focus();
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition cursor-pointer"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isClassDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* CLASS SEARCH SUGGESTIONS DROPDOWN */}
              {isClassDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border-2 border-emerald-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-64 flex flex-col">
                  {/* Dropdown Header */}
                  <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between text-[11px] font-bold text-emerald-950 shrink-0">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                      {className.trim()
                        ? `Hasil Pencarian Kelas (${filteredClassSuggestions.length})`
                        : `Pilih atau Cari Kelas (${allClassOptions.length} Pilihan)`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsClassDropdownOpen(false)}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Suggestions List */}
                  <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                    {/* Custom Typed Option if not exactly in list */}
                    {className.trim() &&
                      !allClassOptions.some((c) => c.label.toLowerCase() === className.trim().toLowerCase()) && (
                        <div
                          onClick={() => handleSelectClass(className.trim(), detectLevelId(className.trim()))}
                          className="p-3 bg-amber-50/70 hover:bg-amber-100/70 text-amber-950 transition cursor-pointer flex items-center justify-between gap-2 border-b border-amber-200/60"
                        >
                          <div className="flex items-center gap-2">
                            <Edit3 className="w-4 h-4 text-amber-700 shrink-0" />
                            <div>
                              <span className="text-xs font-bold">
                                Gunakan &ldquo;{className.trim()}&rdquo; sebagai Kelas Baru
                              </span>
                              <div className="text-[10px] text-amber-800">
                                Terdeteksi: {getLevelDisplayName(detectLevelId(className.trim()))}
                              </div>
                            </div>
                          </div>
                          <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-200 text-amber-900 border border-amber-300">
                            Pilih
                          </span>
                        </div>
                      )}

                    {filteredClassSuggestions.length > 0 ? (
                      filteredClassSuggestions.map((cls, idx) => {
                        const isHighlighted = idx === highlightedClassIndex;
                        const isSelected = className.trim().toLowerCase() === cls.label.toLowerCase();

                        return (
                          <div
                            key={`class-option-${cls.label}-${idx}`}
                            id={`class-suggestion-${cls.label.replace(/\s+/g, '-').toLowerCase()}`}
                            onClick={() => handleSelectClass(cls.label, cls.levelId)}
                            onMouseEnter={() => setHighlightedClassIndex(idx)}
                            className={`p-2.5 text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-emerald-100/70 text-emerald-950 font-bold'
                                : isHighlighted
                                ? 'bg-emerald-50/80 text-gray-900'
                                : 'hover:bg-emerald-50/40 text-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                  cls.isDatabase
                                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {cls.isDatabase ? '⭐' : '📖'}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-gray-900 truncate">
                                  {renderHighlightedText(cls.label, className)}
                                </div>
                                <div className="text-[10px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                                  <span className="font-semibold text-emerald-700">{cls.groupName}</span>
                                  <span>•</span>
                                  <span>{getLevelDisplayName(cls.levelId)}</span>
                                  {cls.studentCount !== undefined && (
                                    <>
                                      <span>•</span>
                                      <span className="text-teal-700 font-bold">{cls.studentCount} Siswa</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Pilih
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-500 space-y-1">
                        <p className="font-semibold text-gray-700">Kelas tidak ditemukan di daftar</p>
                        <p className="text-[11px] text-gray-500">
                          Kamu tetap bisa menggunakan kelas &ldquo;{className}&rdquo; untuk mulai belajar.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Footer Hint */}
                  <div className="p-2 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 text-center shrink-0">
                    Gunakan tombol <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded-sm">↑</kbd>{' '}
                    <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded-sm">↓</kbd> dan{' '}
                    <kbd className="px-1 py-0.5 bg-white border border-gray-300 rounded-sm">Enter</kbd> untuk memilih
                  </div>
                </div>
              )}


            </div>

            {/* Submit Button - Dynamic Config */}
            <button
              id="start-learning-btn"
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-4 px-6 rounded-2xl btn-game-3d ${hpConfig.submitBtnBg || 'btn-game-emerald'} text-white font-black text-sm sm:text-base tracking-wider flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-70`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{hpConfig.submitBtnText || '🚀 MULAI PETUALANGAN BELAJAR'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-5 pt-4 border-t border-emerald-100/80 flex items-center justify-between gap-2 text-[11px] text-emerald-900 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Pengerjaan tersimpan otomatis</span>
            </div>

            {onOpenLogin && (
              <button
                id="welcome-admin-login-btn"
                type="button"
                onClick={onOpenLogin}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1 cursor-pointer transition"
              >
                <Shield className="w-3 h-3 text-emerald-700" />
                <span>Login Guru / Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

