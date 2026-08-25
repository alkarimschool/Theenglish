import { Level, Category, Topic, LearningMaterial, Question, User, StudentProfile, StudentAttempt } from '../src/types';

export const INITIAL_LEVELS: Level[] = [
  {
    id: 'tk',
    name: 'Jenjang TK',
    grade: 'TK',
    schoolType: 'TK',
    educationLevel: 'TK',
    numericGrade: 0,
    description: 'Playful English & Phonics untuk Taman Kanak-Kanak (TK A & TK B)',
    iconName: 'Smile',
    color: '#EC4899',
    order: 1,
    classes: [
      'TK A Patimura',
      'TK B Diponegoro',
      'TK B Jendral Sudirman',
      'TK B Pangeran Antasari',
    ],
  },
  {
    id: 'sd',
    name: 'Jenjang SD',
    grade: 'SD',
    schoolType: 'SD',
    educationLevel: 'SD',
    numericGrade: 1,
    description: 'Primary English Starter s/d Intermediate (Kelas 1 s/d Kelas 6)',
    iconName: 'Sun',
    color: '#F59E0B',
    order: 2,
    classes: [
      'Kelas 1 Abu Bakar',
      'Kelas 1 Umar Bin Khattab',
      'Kelas 2 Ali Bin Abi Thalib',
      'Kelas 2 Thalhah bin Ubaidillah',
      'Kelas 2 Utsman bin Affan',
      'Kelas 3 Abdurrahman Bin Auf',
      'Kelas 3 Bilal Bin Rabah',
      'Kelas 3 Khalid Bin Walid',
      'Kelas 4 Muadz Bin Jabbal',
      'Kelas 4 Said Bin Zaid',
      'Kelas 4 Zubair Bin Awwam',
      'Kelas 5 Hamzah bin Abdul Muthalib',
      'Kelas 5 Hudzaifah Bin Al Yaman',
      'Kelas 5 Saad Bin Abi Waqqash',
      'Kelas 6 Abu Ubaidah Bin Al-Jarrah',
      'Kelas 6 Amr Bin Ash',
      'Kelas 6 Anas Bin Malik',
    ],
  },
  {
    id: 'smp',
    name: 'Jenjang SMP',
    grade: 'SMP',
    schoolType: 'SMP',
    educationLevel: 'SMP',
    numericGrade: 7,
    description: 'Junior High English Competencies (Kelas 7 s/d Kelas 9)',
    iconName: 'BookOpen',
    color: '#059669',
    order: 3,
    classes: [
      'Kelas 7 Salman Alfarisi',
      'Kelas 8 Abu Hurairah',
      'Kelas 8 Mushab Bin Umair',
      'Kelas 9 Amr bin Yasir',
    ],
  },
  {
    id: 'sma',
    name: 'Jenjang SMA',
    grade: 'SMA',
    schoolType: 'SMA',
    educationLevel: 'SMA',
    numericGrade: 10,
    description: 'Senior High Foundations & Global Readiness (Kelas 10 s/d Kelas 12)',
    iconName: 'GraduationCap',
    color: '#2563EB',
    order: 4,
    classes: [
      'Kelas 10 Muhammad Al-Fatih',
      'Kelas 11 Thariq bin Ziyad',
      'Kelas 12 Salahudin Al-Ayyubi',
    ],
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'expression',
    name: 'Expression',
    description: 'Master everyday social expressions, polite interactions, greetings, asking permission, and apologies.',
    iconName: 'MessageSquare',
    color: '#059669',
    order: 1,
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    description: 'Expand thematic vocabulary, word definitions, synonyms, examples, and native audio pronunciation.',
    iconName: 'Layers',
    color: '#D97706',
    order: 2,
  },
  {
    id: 'dialogue',
    name: 'Dialogue',
    description: 'Practice interactive conversational dialogues, roleplays, situational speaking, and contextual understanding.',
    iconName: 'Users',
    color: '#2563EB',
    order: 3,
  },
  {
    id: 'speech',
    name: 'Speech',
    description: 'Develop public speaking, self-introductions, monologues, presentations, and formal address skills.',
    iconName: 'Mic',
    color: '#7C3AED',
    order: 4,
  },
  {
    id: 'grammar',
    name: 'Grammar',
    description: 'Master grammatical structures, tenses, sentence mechanics, clauses, and modal verbs (Khusus SMP & SMA).',
    iconName: 'FileText',
    color: '#DC2626',
    order: 5,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    username: 'admin',
    name: 'Ustadz Farid Rahman, M.Pd.',
    role: 'admin',
    email: 'admin@alkarim.sch.id',
    nip: '198501012010011001',
    assignedLevelIds: ['tk', 'sd', 'smp', 'sma'],
    isActive: true,
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'user-gurutk',
    username: 'gurutk',
    name: 'Ustadzah Fatimah Azzahra, S.Pd.I',
    role: 'teacher',
    email: 'fatimah@alkarim.sch.id',
    nip: '199504122020012005',
    assignedLevelIds: ['tk'],
    isActive: true,
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-gurusd1',
    username: 'gurusd1',
    name: 'Ustadzah Siti Aminah, S.Pd.',
    role: 'teacher',
    email: 'sitiaminah@alkarim.sch.id',
    nip: '199308142018022004',
    assignedLevelIds: ['sd'],
    isActive: true,
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-gurusd3',
    username: 'gurusd3',
    name: 'Ustadz Rahmat Hidayat, S.Pd.',
    role: 'teacher',
    email: 'rahmat@alkarim.sch.id',
    nip: '199105202017011003',
    assignedLevelIds: ['sd'],
    isActive: true,
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-gurusd5',
    username: 'gurusd5',
    name: 'Ustadzah Aisyah Rahma, S.Pd.',
    role: 'teacher',
    email: 'aisyah@alkarim.sch.id',
    nip: '199411032019032006',
    assignedLevelIds: ['sd'],
    isActive: true,
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-guru-imel',
    username: 'umiimel',
    name: 'Umi Imel, S.Pd.',
    role: 'teacher',
    email: 'imel@alkarim.sch.id',
    nip: '199203152018022003',
    assignedLevelIds: ['sd'],
    isActive: true,
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-guru7',
    username: 'guru7',
    name: 'Ustadzah Nurul Hidayah, S.Pd.',
    role: 'teacher',
    email: 'nurul@alkarim.sch.id',
    nip: '199203152018022003',
    assignedLevelIds: ['smp'],
    isActive: true,
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-guru9',
    username: 'guru9',
    name: 'Ustadzah Sarah Amalia, M.Hum.',
    role: 'teacher',
    email: 'sarah@alkarim.sch.id',
    nip: '198811122014032002',
    assignedLevelIds: ['smp'],
    isActive: true,
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-guru10',
    username: 'guru10',
    name: 'Ustadz Arif Wicaksono, M.Ed.',
    role: 'teacher',
    email: 'arif@alkarim.sch.id',
    nip: '198705042012011004',
    assignedLevelIds: ['sma'],
    isActive: true,
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-guru12',
    username: 'guru12',
    name: 'Ustadz Dr. Fathurrahman, M.A.',
    role: 'teacher',
    email: 'fathur@alkarim.sch.id',
    nip: '198202102008011002',
    assignedLevelIds: ['sma'],
    isActive: true,
    createdAt: '2026-01-05T08:00:00Z',
  },
];

// Helper to create 30 full multiple-choice questions
function create30Questions(
  topicId: string,
  levelId: string,
  categoryId: string,
  items: Array<{ q: string; a: string; b: string; c: string; d: string; correct: 'A' | 'B' | 'C' | 'D'; exp: string }>
): Question[] {
  const result: Question[] = [];
  const baseCount = items.length;

  for (let i = 0; i < 30; i++) {
    const item = items[i % baseCount];
    const qNum = i + 1;
    const qSuffix = i >= baseCount ? ` (Practice ${Math.floor(i / baseCount) + 1})` : '';

    result.push({
      id: `q-${topicId}-${qNum}`,
      topicId,
      levelId,
      categoryId,
      questionNumber: qNum,
      questionText: i >= baseCount ? `${item.q}${qSuffix}` : item.q,
      optionA: item.a,
      optionB: item.b,
      optionC: item.c,
      optionD: item.d,
      correctAnswer: item.correct,
      explanation: item.exp,
      createdAt: new Date().toISOString(),
    });
  }

  return result;
}

export function generateSeedData() {
  const topics: Topic[] = [];
  const materials: LearningMaterial[] = [];
  const questions: Question[] = [];

  // ==========================================
  // 1. TK A - Vocabulary: Colors & Animals
  // ==========================================
  const t_tka: Topic = {
    id: 'topic-tka-vocab-colors',
    levelId: 'tk-a',
    categoryId: 'vocabulary',
    title: 'Colors & Beautiful Animals',
    theme: 'Exploring Colorful Nature at Al-Karim Playgroup',
    description: 'Belajar mengenal nama-nama warna cerah dan hewan lucu ciptaan Allah di alam sekitar.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  };
  topics.push(t_tka);

  materials.push({
    id: 'mat-tka-vocab-colors',
    topicId: t_tka.id,
    summary: 'Mengenal warna pelangi dan hewan-hewan ramah di kebun sekolah alam.',
    contentMarkdown: `### 🌈 Mengenal Warna (Colors)
Mari kita sebutkan warna-warna indah di sekitar kita:
1. **Red** (Merah) - Seperti warna buah apel yang manis 🍎
2. **Green** (Hijau) - Seperti warna daun pohon rindang di Sekolah Alam 🍃
3. **Blue** (Biru) - Seperti warna langit cerah di pagi hari 🌤️
4. **Yellow** (Kuning) - Seperti warna sinar matahari yang hangat ☀️
5. **White** (Putih) - Seperti awan lembut di langit ☁️

---

### 🐰 Hewan Lucu (Animals)
* **Cat** : Kucing (*Meow meow*)
* **Bird** : Burung (*Tweet tweet terbang tinggi*)
* **Rabbit** : Kelinci (*Melompat riang*)
* **Fish** : Ikan (*Berenang di kolam air jernih*)
* **Duck** : Bebek (*Kwek kwek*)`,
    vocabularyList: [
      { id: 'v-tk1', word: 'Red', phonetic: '/rɛd/', partOfSpeech: 'Noun/Adj', meaning: 'Merah', example: 'The apple is red.', exampleTranslation: 'Apel itu berwarna merah.' },
      { id: 'v-tk2', word: 'Green', phonetic: '/ɡriːn/', partOfSpeech: 'Noun/Adj', meaning: 'Hijau', example: 'The leaf is green.', exampleTranslation: 'Daun itu berwarna hijau.' },
      { id: 'v-tk3', word: 'Cat', phonetic: '/kæt/', partOfSpeech: 'Noun', meaning: 'Kucing', example: 'I love my cute cat.', exampleTranslation: 'Aku suka kucingku yang lucu.' },
      { id: 'v-tk4', word: 'Bird', phonetic: '/bɜːrd/', partOfSpeech: 'Noun', meaning: 'Burung', example: 'The bird can fly high.', exampleTranslation: 'Burung bisa terbang tinggi.' },
      { id: 'v-tk5', word: 'Yellow', phonetic: '/ˈjɛl.oʊ/', partOfSpeech: 'Noun/Adj', meaning: 'Kuning', example: 'The sun is yellow.', exampleTranslation: 'Matahari berwarna kuning.' },
    ],
    dialogueSamples: [
      { id: 'd-tk1', speaker: 'Aisyah', text: 'Look, Ustadzah! What color is that flower?', translation: 'Lihat Ustadzah! Apa warna bunga itu?' },
      { id: 'd-tk2', speaker: 'Ustadzah', text: 'MashaAllah, that flower is red and yellow!', translation: 'MashaAllah, bunga itu berwarna merah dan kuning!' },
    ],
    keyPoints: [
      'Ucapkan nama warna dengan ceria dan gembira.',
      'Sebutkan ciptaan Allah yang ada di alam dengan rasa syukur.',
    ],
    tips: [
      'Tunjuk benda di sekitarmu lalu sebutkan warnanya dalam bahasa Inggris!',
    ],
    updatedAt: '2026-01-10T08:00:00Z',
  });

  const qBank_tka = [
    { q: 'What is the color of a leaf in the garden?', a: 'Green', b: 'Red', c: 'Blue', d: 'Black', correct: 'A' as const, exp: 'Daun pohon pada umumnya berwarna hijau (Green).' },
    { q: 'What animal says "Meow meow"?', a: 'Cat', b: 'Dog', c: 'Fish', d: 'Duck', correct: 'A' as const, exp: 'Kucing (Cat) bersuara meow.' },
    { q: 'What is the color of the bright morning sun?', a: 'Yellow', b: 'Blue', c: 'Purple', d: 'Brown', correct: 'A' as const, exp: 'Matahari pagi tampak berwarna kuning (Yellow).' },
    { q: 'Which animal can swim in the water?', a: 'Fish', b: 'Bird', c: 'Cat', d: 'Rabbit', correct: 'A' as const, exp: 'Ikan (Fish) berenang di dalam air.' },
    { q: 'What is the color of an apple fruit?', a: 'Red', b: 'Black', c: 'Grey', d: 'Blue', correct: 'A' as const, exp: 'Buah apel yang masak berwarna merah (Red).' },
    { q: 'Which animal can fly in the sky?', a: 'Bird', b: 'Cat', c: 'Cow', d: 'Fish', correct: 'A' as const, exp: 'Burung (Bird) memiliki sayap untuk terbang.' },
    { q: 'What animal hops and loves carrots?', a: 'Rabbit', b: 'Duck', c: 'Lion', d: 'Fish', correct: 'A' as const, exp: 'Kelinci (Rabbit) melompat dan menyukai wortel.' },
    { q: 'What color is the clear sky?', a: 'Blue', b: 'Green', c: 'Red', d: 'Black', correct: 'A' as const, exp: 'Langit cerah berwarna biru (Blue).' },
    { q: 'What animal says "Quack quack"?', a: 'Duck', b: 'Cat', c: 'Bird', d: 'Rabbit', correct: 'A' as const, exp: 'Bebek (Duck) bersuara quack.' },
    { q: 'What is the color of clean clouds?', a: 'White', b: 'Red', c: 'Green', d: 'Yellow', correct: 'A' as const, exp: 'Awan bersih berwarna putih (White).' },
  ];
  questions.push(...create30Questions(t_tka.id, 'tk-a', 'vocabulary', qBank_tka));

  // ==========================================
  // 2. TK B - Expression: Warm Greetings & Magic Words
  // ==========================================
  const t_tkb: Topic = {
    id: 'topic-tkb-expr-greetings',
    levelId: 'tk-b',
    categoryId: 'expression',
    title: 'Warm Greetings & Polite Magic Words',
    theme: 'Joyful Polite Words at Al-Karim Kindergarten',
    description: 'Mengucapkan salam, kata tolong (please), terima kasih (thank you), dan tersenyum ramah.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-10T08:30:00Z',
    updatedAt: '2026-01-10T08:30:00Z',
  };
  topics.push(t_tkb);

  materials.push({
    id: 'mat-tkb-expr-greetings',
    topicId: t_tkb.id,
    summary: 'Mempelajari 3 kata ajaib kesantunan: Please, Thank You, dan I am sorry.',
    contentMarkdown: `### 🌟 Tiga Kata Ajaib Kesantunan
1. **Please** : Tolong (diucapkan saat meminta bantuan).
2. **Thank You** : Terima kasih (diucapkan saat menerima pemberian/bantuan).
3. **I am sorry** : Maafkan saya (diucapkan saat berbuat salah).

---

### ☀️ Salam Harian (Daily Greetings)
* **Good morning** : Selamat pagi!
* **Good afternoon** : Selamat siang / sore!
* **See you tomorrow** : Sampai jumpa besok!`,
    vocabularyList: [
      { id: 'v-tkb1', word: 'Please', phonetic: '/pliːz/', partOfSpeech: 'Excl', meaning: 'Tolong / Silakan', example: 'Help me, please.', exampleTranslation: 'Tolong bantu saya.' },
      { id: 'v-tkb2', word: 'Thank You', phonetic: '/θæŋk juː/', partOfSpeech: 'Phrase', meaning: 'Terima kasih', example: 'Thank you for the toy.', exampleTranslation: 'Terima kasih atas mainannya.' },
      { id: 'v-tkb3', word: 'Morning', phonetic: '/ˈmɔː.nɪŋ/', partOfSpeech: 'Noun', meaning: 'Pagi hari', example: 'Good morning, teacher!', exampleTranslation: 'Selamat pagi, guru!' },
    ],
    dialogueSamples: [
      { id: 'd-tkb1', speaker: 'Umar', text: 'Good morning, Maryam!', translation: 'Selamat pagi, Maryam!' },
      { id: 'd-tkb2', speaker: 'Maryam', text: 'Good morning, Umar! How are you today?', translation: 'Selamat pagi, Umar! Bagaimana kabarmu hari ini?' },
    ],
    keyPoints: ['Tersenyum saat mengucapkan salam.', 'Gunakan kata "Please" agar selalu disayangi teman.'],
    tips: ['Ucapkan salam kepada Ustadz dan Ustadzah setiap tiba di sekolah.'],
    updatedAt: '2026-01-10T08:30:00Z',
  });

  const qBank_tkb = [
    { q: 'What do you say when you arrive at school in the morning?', a: 'Good morning', b: 'Good night', c: 'Goodbye', d: 'Sleep well', correct: 'A' as const, exp: 'Ucapkan "Good morning" di pagi hari.' },
    { q: 'What magic word do you use when asking for help?', a: 'Please', b: 'Stop', c: 'No', d: 'Go', correct: 'A' as const, exp: 'Kata ajaib meminta bantuan adalah "Please".' },
    { q: 'When a friend shares their snack, you say: ___', a: 'Thank you!', b: 'No way', c: 'I am angry', d: 'Go away', correct: 'A' as const, exp: 'Ucapkan "Thank you!" saat diberi makanan.' },
    { q: 'What do you say when you accidentally bump a friend?', a: 'I am sorry', b: 'Thank you', c: 'Good morning', d: 'Look at me', correct: 'A' as const, exp: 'Ucapkan "I am sorry" saat tidak sengaja menabrak.' },
    { q: 'What is the response to "Good morning"?', a: 'Good morning!', b: 'Good night', c: 'I am eating', d: 'Goodbye', correct: 'A' as const, exp: 'Respon sapaan pagi adalah "Good morning!".' },
    { q: 'Before going home, we say to our friends: ___', a: 'See you tomorrow / Goodbye', b: 'Good morning', c: 'Eat lunch', d: 'Wake up', correct: 'A' as const, exp: 'Ucapkan "See you tomorrow" atau "Goodbye".' },
    { q: 'Which greeting is used when the sun shines bright at noon?', a: 'Good afternoon', b: 'Good night', c: 'Good morning', d: 'Breakfast time', correct: 'A' as const, exp: '"Good afternoon" digunakan di siang/sore hari.' },
    { q: 'Smiling when greeting someone is a sign of: ___', a: 'Kindness and polite manners', b: 'Anger', c: 'Sadness', d: 'Tiredness', correct: 'A' as const, exp: 'Tersenyum adalah tanda kebaikan dan kesantunan.' },
    { q: '"How are you?" means: ___', a: 'Apa kabarmu?', b: 'Siapa namamu?', c: 'Di mana rumahmu?', d: 'Berapa umurmu?', correct: 'A' as const, exp: '"How are you?" artinya menanyakan kabar.' },
    { q: 'What is the polite answer to "How are you?"', a: 'I am fine, thank you!', b: 'I am sleeping', c: 'No thank you', d: 'Goodbye', correct: 'A' as const, exp: 'Jawaban yang baik adalah "I am fine, thank you!".' },
  ];
  questions.push(...create30Questions(t_tkb.id, 'tk-b', 'expression', qBank_tkb));

  // ==========================================
  // 3. SD Level 1 - Vocabulary: Classroom Objects & School Life
  // ==========================================
  const t_sd1: Topic = {
    id: 'topic-sd1-vocab-classroom',
    levelId: 'sd-1',
    categoryId: 'vocabulary',
    title: 'Classroom Objects & School Tools',
    theme: 'My First Grade Experience at Sekolah Alam',
    description: 'Mengenal benda-benda di kelas seperti buku, pensil, tas, dan bangku belajar.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z',
  };
  topics.push(t_sd1);

  materials.push({
    id: 'mat-sd1-vocab-classroom',
    topicId: t_sd1.id,
    summary: 'Mengenal perlengkapan belajar di kelas Sekolah Alam.',
    contentMarkdown: `### 📚 Benda di Dalam Kelas (Classroom Objects)
* **Book** : Buku bacaan / tulis
* **Pencil** : Pensil untuk menulis
* **Eraser / Rubber** : Penghapus pensil
* **Ruler** : Penggaris lurus
* **Bag / Backpack** : Tas sekolah
* **Desk** : Meja belajar
* **Chair** : Kursi duduk`,
    vocabularyList: [
      { id: 'v-sd1-1', word: 'Book', phonetic: '/bʊk/', partOfSpeech: 'Noun', meaning: 'Buku', example: 'Open your English book.', exampleTranslation: 'Buka buku Bahasa Inggrismu.' },
      { id: 'v-sd1-2', word: 'Pencil', phonetic: '/ˈpɛn.səl/', partOfSpeech: 'Noun', meaning: 'Pensil', example: 'I write with a pencil.', exampleTranslation: 'Saya menulis dengan pensil.' },
      { id: 'v-sd1-3', word: 'Eraser', phonetic: '/ɪˈreɪ.sər/', partOfSpeech: 'Noun', meaning: 'Penghapus', example: 'Use an eraser to fix mistakes.', exampleTranslation: 'Gunakan penghapus untuk memperbaiki kesalahan.' },
    ],
    dialogueSamples: [
      { id: 'd-sd1-1', speaker: 'Ibrahim', text: 'Where is your pencil, Ali?', translation: 'Di mana pensilmu, Ali?' },
      { id: 'd-sd1-2', speaker: 'Ali', text: 'My pencil is inside my bag.', translation: 'Pensilku ada di dalam tasku.' },
    ],
    keyPoints: ['Jaga dan rawat alat tulis sekolah agar tidak hilang.', 'Susun buku dengan rapi di tas sekolah.'],
    tips: ['Tempelkan label nama pada tempat pensilmu.'],
    updatedAt: '2026-01-10T09:00:00Z',
  });

  const qBank_sd1 = [
    { q: 'What tool do we use to write in our notebook?', a: 'Pencil', b: 'Eraser', c: 'Chair', d: 'Desk', correct: 'A' as const, exp: 'Kita menulis menggunakan pensil (Pencil).' },
    { q: 'What do we use to erase pencil marks on paper?', a: 'Eraser', b: 'Ruler', c: 'Bag', d: 'Book', correct: 'A' as const, exp: 'Penghapus (Eraser) digunakan untuk menghapus tulisan pensil.' },
    { q: 'Where do we put our books and stationery?', a: 'In the school bag', b: 'In the shoe', c: 'In the water', d: 'On the roof', correct: 'A' as const, exp: 'Buku disimpan di dalam tas sekolah (School bag).' },
    { q: 'We sit on a ___ during class.', a: 'chair', b: 'ruler', c: 'pencil', d: 'board', correct: 'A' as const, exp: 'Kita duduk di atas kursi (chair).' },
    { q: 'We read stories from a ___.', a: 'book', b: 'pen', c: 'desk', d: 'eraser', correct: 'A' as const, exp: 'Kita membaca cerita dari buku (book).' },
    { q: 'What tool helps us draw straight lines?', a: 'Ruler', b: 'Chair', c: 'Bag', d: 'Bottle', correct: 'A' as const, exp: 'Penggaris (Ruler) membantu menggambar garis lurus.' },
    { q: 'The teacher writes on the ___ in front of the classroom.', a: 'whiteboard', b: 'floor', c: 'bag', d: 'shoe', correct: 'A' as const, exp: 'Guru menulis di papan tulis (whiteboard).' },
    { q: 'What color is a clean white sheet of paper?', a: 'White', b: 'Black', c: 'Brown', d: 'Grey', correct: 'A' as const, exp: 'Kertas bersih berwarna putih (White).' },
    { q: '"Open your book" means: ___', a: 'Buka bukumu', b: 'Tutup bukumu', c: 'Buang bukumu', d: 'Beli bukumu', correct: 'A' as const, exp: '"Open your book" artinya buka bukumu.' },
    { q: 'We write our homework at a study ___.', a: 'desk', b: 'door', c: 'window', d: 'ceiling', correct: 'A' as const, exp: 'Kita belajar di meja belajar (desk).' },
  ];
  questions.push(...create30Questions(t_sd1.id, 'sd-1', 'vocabulary', qBank_sd1));

  // ==========================================
  // 4. SD Level 2 - Expression: My Loving Family & Polite Feelings
  // ==========================================
  const t_sd2: Topic = {
    id: 'topic-sd2-expr-family',
    levelId: 'sd-2',
    categoryId: 'expression',
    title: 'My Loving Family & Expressing Feelings',
    theme: 'Warm Family Life & Islamic Respect for Parents',
    description: 'Mengenal anggota keluarga (Father, Mother, Brother, Sister) dan menyatakan perasaan senang/syukur.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-10T09:30:00Z',
    updatedAt: '2026-01-10T09:30:00Z',
  };
  topics.push(t_sd2);

  materials.push({
    id: 'mat-sd2-expr-family',
    topicId: t_sd2.id,
    summary: 'Menyebutkan anggota keluarga dan mendoakan kebaikan untuk orang tua.',
    contentMarkdown: `### 👨‍👩‍👧‍👦 Anggota Keluarga (Family Members)
* **Father** : Ayah tercinta
* **Mother** : Ibu tersayang
* **Brother** : Saudara laki-laki
* **Sister** : Saudara perempuan
* **Grandfather** : Kakek
* **Grandmother** : Nenek

---

### 😊 Menyatakan Perasaan (Feelings)
* *I am happy today!* (Saya bahagia hari ini!)
* *I love my family.* (Saya menyayangi keluarga saya.)`,
    vocabularyList: [
      { id: 'v-sd2-1', word: 'Father', phonetic: '/ˈfɑː.ðər/', partOfSpeech: 'Noun', meaning: 'Ayah', example: 'My father is kind.', exampleTranslation: 'Ayahku baik hati.' },
      { id: 'v-sd2-2', word: 'Mother', phonetic: '/ˈmʌð.ər/', partOfSpeech: 'Noun', meaning: 'Ibu', example: 'I help my mother at home.', exampleTranslation: 'Saya membantu ibu di rumah.' },
      { id: 'v-sd2-3', word: 'Happy', phonetic: '/ˈhæp.i/', partOfSpeech: 'Adj', meaning: 'Bahagia / Senang', example: 'We are very happy.', exampleTranslation: 'Kami sangat bahagia.' },
    ],
    dialogueSamples: [
      { id: 'd-sd2-1', speaker: 'Hana', text: 'Who is this, Tariq?', translation: 'Siapa ini, Tariq?' },
      { id: 'd-sd2-2', speaker: 'Tariq', text: 'This is my beloved mother and my little brother.', translation: 'Ini ibu tercintaku dan adik laki-lakiku.' },
    ],
    keyPoints: ['Selalu berbakti dan menghormati kedua orang tua.', 'Doakan kebaikan untuk seluruh anggota keluarga.'],
    tips: ['Ucapkan terima kasih saat ibu menyiapkan sarapan pagi.'],
    updatedAt: '2026-01-10T09:30:00Z',
  });

  const qBank_sd2 = [
    { q: 'Who is the female parent that cares for us at home?', a: 'Mother', b: 'Brother', c: 'Father', d: 'Uncle', correct: 'A' as const, exp: 'Ibu (Mother) adalah orang tua perempuan.' },
    { q: 'Who is the male parent who works hard for the family?', a: 'Father', b: 'Sister', c: 'Aunt', d: 'Grandmother', correct: 'A' as const, exp: 'Ayah (Father) adalah orang tua laki-laki.' },
    { q: 'A male sibling is called a: ___', a: 'brother', b: 'sister', c: 'mother', d: 'daughter', correct: 'A' as const, exp: 'Saudara laki-laki disebut brother.' },
    { q: 'A female sibling is called a: ___', a: 'sister', b: 'brother', c: 'father', d: 'son', correct: 'A' as const, exp: 'Saudara perempuan disebut sister.' },
    { q: 'The father of your father is your: ___', a: 'grandfather', b: 'uncle', c: 'brother', d: 'nephew', correct: 'A' as const, exp: 'Ayah dari ayah adalah kakek (grandfather).' },
    { q: 'The mother of your mother is your: ___', a: 'grandmother', b: 'aunt', c: 'cousin', d: 'niece', correct: 'A' as const, exp: 'Ibu dari ibu adalah nenek (grandmother).' },
    { q: 'How do you say "Saya sayang keluarga saya"?', a: 'I love my family', b: 'I hate my book', c: 'I buy a family', d: 'I run away', correct: 'A' as const, exp: '"I love my family" menyatakan kasih sayang kepada keluarga.' },
    { q: 'When we smile and feel joyful, we are: ___', a: 'happy', b: 'angry', c: 'sad', d: 'hungry', correct: 'A' as const, exp: 'Saat gembira, kita merasa bahagia (happy).' },
    { q: 'What is the opposite of happy?', a: 'Sad', b: 'Kind', c: 'Fast', d: 'Bright', correct: 'A' as const, exp: 'Lawan kata dari senang adalah sedih (sad).' },
    { q: 'In Islam, we must always respect our: ___', a: 'parents and elders', b: 'only toys', c: 'nobody', d: 'monsters', correct: 'A' as const, exp: 'Kita wajib menghormati kedua orang tua (parents).' },
  ];
  questions.push(...create30Questions(t_sd2.id, 'sd-2', 'expression', qBank_sd2));

  // ==========================================
  // 5. SD Level 3 - Dialogue: Healthy Food, Fruits & Table Manners
  // ==========================================
  const t_sd3: Topic = {
    id: 'topic-sd3-dial-food',
    levelId: 'sd-3',
    categoryId: 'dialogue',
    title: 'Healthy Food, Fruits & Table Manners',
    theme: 'Halal & Thoyyib Nutrition at Sekolah Alam',
    description: 'Percakapan memesan makanan sehat, menyebutkan buah-buahan segar, dan adab makan Islami.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
  };
  topics.push(t_sd3);

  materials.push({
    id: 'mat-sd3-dial-food',
    topicId: t_sd3.id,
    summary: 'Belajar percakapan memilih makanan halal dan sehat bersama teman.',
    contentMarkdown: `### 🍎 Makanan & Buah Sehat (Healthy Food)
* **Banana** (Pisang), **Apple** (Apel), **Orange** (Jeruk), **Grapes** (Anggur), **Dates** (Kurma).
* **Milk** (Susu), **Water** (Air mineral), **Honey** (Madu murni).
* **Rice** (Nasi), **Fish** (Ikan panggang), **Vegetables** (Sayur-mayur).

---

### 🍽️ Adab Makan Islami (Islamic Table Manners)
1. Wash hands with clean water.
2. Say *Bismillah* before eating.
3. Eat with your right hand while sitting down.
4. Say *Alhamdulillah* after finishing meal.`,
    vocabularyList: [
      { id: 'v-sd3-1', word: 'Healthy', phonetic: '/ˈhɛl.θi/', partOfSpeech: 'Adj', meaning: 'Sehat', example: 'Fruits are healthy food.', exampleTranslation: 'Buah-buahan adalah makanan sehat.' },
      { id: 'v-sd3-2', word: 'Dates', phonetic: '/deɪts/', partOfSpeech: 'Noun', meaning: 'Kurma', example: 'Eating dates is sunnah.', exampleTranslation: 'Makan kurma adalah sunnah.' },
      { id: 'v-sd3-3', word: 'Drink', phonetic: '/drɪŋk/', partOfSpeech: 'Verb', meaning: 'Minum', example: 'Drink water while sitting down.', exampleTranslation: 'Minumlah air sambil duduk.' },
    ],
    dialogueSamples: [
      { id: 'd-sd3-1', speaker: 'Yusuf', text: 'Would you like some fresh orange juice, Bilal?', translation: 'Maukah kamu jus jeruk segar, Bilal?' },
      { id: 'd-sd3-2', speaker: 'Bilal', text: 'Yes, please! It tastes delicious and refreshing.', translation: 'Ya, tolong! Rasanya lezat dan menyegarkan.' },
    ],
    keyPoints: ['Makanlah makanan yang Halal dan Thoyyib (baik untuk tubuh).', 'Jangan makan atau minum sambil berdiri.'],
    tips: ['Membawa bekal makanan bergizi dari rumah untuk istirahat di sekolah alam.'],
    updatedAt: '2026-01-10T10:00:00Z',
  });

  const qBank_sd3 = [
    { q: 'Which fruit is yellow, sweet, and loved by monkeys?', a: 'Banana', b: 'Apple', c: 'Carrot', d: 'Fish', correct: 'A' as const, exp: 'Pisang (Banana) berwarna kuning dan manis.' },
    { q: 'What do we say before starting to eat or drink?', a: 'Bismillah', b: 'Goodbye', c: 'Excuse me', d: 'Good night', correct: 'A' as const, exp: 'Ucapkan Bismillah sebelum makan.' },
    { q: 'Which hand should we use when eating according to sunnah?', a: 'Right hand', b: 'Left hand', c: 'Both feet', d: 'No hands', correct: 'A' as const, exp: 'Makanlah menggunakan tangan kanan (Right hand).' },
    { q: 'What do we say after finishing our meal?', a: 'Alhamdulillah', b: 'Bismillah', c: 'Please', d: 'I am sorry', correct: 'A' as const, exp: 'Ucapkan Alhamdulillah sebagai rasa syukur atas makanan.' },
    { q: 'Which of the following is a healthy drink produced by bees?', a: 'Honey', b: 'Soda', c: 'Paint', d: 'Ink', correct: 'A' as const, exp: 'Madu (Honey) dihasilkan lebah dan sangat menyehatkan.' },
    { q: '"Would you like an apple?" How do you accept politely?', a: 'Yes, please!', b: 'No go away', c: 'Give me five', d: 'I do not know', correct: 'A' as const, exp: '"Yes, please!" adalah cara menerima tawaran dengan sopan.' },
    { q: 'Which of these is a vegetable rich in vitamins?', a: 'Spinach / Carrot', b: 'Candy', c: 'Ice cream', d: 'Chocolate', correct: 'A' as const, exp: 'Bayam dan wortel (Spinach/Carrot) adalah sayuran bergizi.' },
    { q: 'Drinking plenty of clean water keeps our body: ___', a: 'hydrated and healthy', b: 'sick', c: 'tired', d: 'sleepy', correct: 'A' as const, exp: 'Air putih menjaga tubuh tetap terhidrasi dan sehat.' },
    { q: 'What fruit is traditionally eaten to break fasting (Iftar)?', a: 'Dates', b: 'Watermelon', c: 'Durian', d: 'Pineapple', correct: 'A' as const, exp: 'Kurma (Dates) disunnahkan untuk berbuka puasa.' },
    { q: 'Food that is clean, nutritious, and good for health is called: ___', a: 'Thoyyib / Healthy food', b: 'Junk food', c: 'Rotten food', d: 'Expired food', correct: 'A' as const, exp: 'Makanan sehat dan bergizi adalah makanan thoyyib.' },
  ];
  questions.push(...create30Questions(t_sd3.id, 'sd-3', 'dialogue', qBank_sd3));

  // ==========================================
  // 6. SD Level 4 - Vocabulary & Expression
  // ==========================================
  const t_sd4: Topic = {
    id: 'topic-sd4-vocab-animals',
    levelId: 'sd-4',
    categoryId: 'vocabulary',
    title: 'Wild & Farm Animals in Nature',
    theme: 'Biodiversity & Wildlife Care at Sekolah Alam',
    description: 'Memahami habitat hewan liar, hewan ternak, ciri-ciri fisik, dan kepedulian terhadap lingkungan hidup.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-11T08:00:00Z',
    updatedAt: '2026-01-11T08:00:00Z',
  };
  topics.push(t_sd4);

  materials.push({
    id: 'mat-sd4-vocab-animals',
    topicId: t_sd4.id,
    summary: 'Mengenal hewan ternak (farm animals) dan hewan liar (wild animals) serta peran mereka dalam ekosistem.',
    contentMarkdown: `### 1. Farm Animals (Hewan Ternak)
Hewan ternak dipelihara oleh manusia untuk membantu pekerjaan dan menghasilkan makanan:
* **Cow** (Sapi) : Produces fresh milk and meat.
* **Goat** (Kambing) : Eats green grass and leaves.
* **Sheep** (Domba) : Has warm wool fleece.
* **Chicken** (Ayam) : Lays eggs every morning.
* **Horse** (Kuda) : Runs fast in the field.

---

### 2. Wild Animals (Hewan Liar)
Hewan yang hidup bebas di habitat aslinya di hutan atau sabana:
* **Elephant** (Gajah) : The largest land mammal with a long trunk.
* **Tiger** (Harimau) : Has black and orange stripes.
* **Eagle** (Elang) : Flies high with sharp eyesight.
* **Monkey** (Monyet) : Swings cheerfully from tree branches.
* **Deer** (Rusa) : Has elegant antlers and gentle eyes.`,
    vocabularyList: [
      { id: 'v-sd4-1', word: 'Habitat', phonetic: '/ˈhæb.ɪ.tæt/', partOfSpeech: 'Noun', meaning: 'Tempat tinggal alami hewan', example: 'The forest is the natural habitat of wild animals.', exampleTranslation: 'Hutan adalah habitat alami hewan liar.' },
      { id: 'v-sd4-2', word: 'Herbivore', phonetic: '/ˈhɜː.bɪ.vɔːr/', partOfSpeech: 'Noun', meaning: 'Hewan pemakan tumbuhan', example: 'Cows and goats are herbivores.', exampleTranslation: 'Sapi dan kambing adalah hewan herbivora.' },
      { id: 'v-sd4-3', word: 'Trunk', phonetic: '/trʌŋk/', partOfSpeech: 'Noun', meaning: 'Belalai (gajah)', example: 'The elephant drinks water with its trunk.', exampleTranslation: 'Gajah minum air dengan belalainya.' },
    ],
    dialogueSamples: [
      { id: 'd-sd4-1', speaker: 'Hasan', text: 'Assalamu’alaikum, Tariq! What animal did you see at the farm?', translation: 'Assalamu’alaikum, Tariq! Hewan apa yang kamu lihat di peternakan?' },
      { id: 'd-sd4-2', speaker: 'Tariq', text: 'Wa’alaikumussalam. I saw dairy cows and cute goats eating grass!', translation: 'Wa’alaikumussalam. Aku melihat sapi perah dan kambing lucu makan rumput!' },
    ],
    keyPoints: ['Gunakan kata sifat (large, fast, colorful) untuk mendeskripsikan ciri-ciri hewan.', 'Jaga kebersihan kandang dan lestarikan hutan.'],
    tips: ['Perhatikan perbedaan antara farm animals dan wild animals.'],
    updatedAt: '2026-01-11T08:00:00Z',
  });

  const qBank_sd4 = [
    { q: 'Which animal gives us fresh milk and says "Moo"?', a: 'Cow', b: 'Lion', c: 'Eagle', d: 'Snake', correct: 'A' as const, exp: 'Sapi (Cow) menghasilkan susu segar.' },
    { q: 'The elephant uses its ___ to drink water and pick food.', a: 'trunk', b: 'wing', c: 'horn', d: 'fin', correct: 'A' as const, exp: 'Gajah menggunakan belalai (trunk).' },
    { q: 'Which animal is a bird of prey with sharp eyesight?', a: 'Eagle', b: 'Chicken', c: 'Duck', d: 'Rabbit', correct: 'A' as const, exp: 'Elang (Eagle) adalah burung pemangsa berpandangan tajam.' },
    { q: 'Goats and sheep are herbivores because they eat ___.', a: 'grass and leaves', b: 'meat', c: 'fish', d: 'bones', correct: 'A' as const, exp: 'Herbivora memakan tumbuhan dan rumput (grass and leaves).' },
    { q: 'Where do wild animals naturally live?', a: 'In the forest / natural habitat', b: 'In the classroom', c: 'In the shopping mall', d: 'In the car', correct: 'A' as const, exp: 'Habitat alami hewan liar adalah hutan (forest).' },
    { q: 'A tiger is known for its beautiful orange and black ___.', a: 'stripes', b: 'wings', c: 'feathers', d: 'beak', correct: 'A' as const, exp: 'Harimau memiliki pola loreng (stripes).' },
    { q: 'Which animal lays eggs in the coop every morning?', a: 'Hen / Chicken', b: 'Horse', c: 'Goat', d: 'Cat', correct: 'A' as const, exp: 'Ayam betina (Hen/Chicken) bertelur di kandang.' },
    { q: 'What do we call the warm wool on a sheep?', a: 'Fleece / Wool', b: 'Trunk', c: 'Fin', d: 'Beak', correct: 'A' as const, exp: 'Bulu wol domba disebut fleece/wool.' },
    { q: 'Monkeys love to swing between ___ in the canopy.', a: 'tree branches', b: 'deep waters', c: 'clouds', d: 'underground tunnels', correct: 'A' as const, exp: 'Monyet berayun di dahan pohon (tree branches).' },
    { q: 'We must ___ endangered wildlife from illegal hunting.', a: 'protect', b: 'harm', c: 'ignore', d: 'destroy', correct: 'A' as const, exp: 'Kita wajib melindungi (protect) hewan langka.' },
  ];
  questions.push(...create30Questions(t_sd4.id, 'sd-4', 'vocabulary', qBank_sd4));

  // ==========================================
  // 7. SD Level 5 - Speech: My Hobbies & Future Aspirations
  // ==========================================
  const t_sd5: Topic = {
    id: 'topic-sd5-speech-hobbies',
    levelId: 'sd-5',
    categoryId: 'speech',
    title: 'My Inspiring Hobbies & Future Aspirations',
    theme: 'Cultivating Talents for the Ummah at Sekolah Alam',
    description: 'Berbicara di depan kelas tentang hobi membaca, bertani organik, memanah, dan cita-cita masa depan.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-11T10:00:00Z',
    updatedAt: '2026-01-11T10:00:00Z',
  };
  topics.push(t_sd5);

  materials.push({
    id: 'mat-sd5-speech-hobbies',
    topicId: t_sd5.id,
    summary: 'Menyusun pidato perkenalan hobi dan cita-cita dengan percaya diri di depan kelas.',
    contentMarkdown: `### 🌟 Memperkenalkan Hobi (Sharing Hobbies)
Contoh kalimat pembuka pidato:
* *Assalamu’alaikum friends. Today I would like to share my favorite hobby.*
* *In my free time, I love organic gardening and reading science books.*
* *Gardening teaches me patience, responsibility, and gratitude to Allah.*

---

### 🎯 Cita-Cita Masa Depan (Future Dreams)
* *Doctor* : Helping patients get well.
* *Environmental Scientist* : Protecting rainforests and clean rivers.
* *Teacher / Educator* : Teaching beneficial knowledge to children.`,
    vocabularyList: [
      { id: 'v-sd5-1', word: 'Aspiration', phonetic: '/ˌæs.pɪˈreɪ.ʃən/', partOfSpeech: 'Noun', meaning: 'Cita-cita / Harapan luhur', example: 'Her aspiration is to become a doctor.', exampleTranslation: 'Cita-citanya adalah menjadi dokter.' },
      { id: 'v-sd5-2', word: 'Beneficial', phonetic: '/ˌbɛn.ɪˈfɪʃ.əl/', partOfSpeech: 'Adj', meaning: 'Bermanfaat', example: 'Spend time on beneficial activities.', exampleTranslation: 'Gunakan waktu untuk kegiatan yang bermanfaat.' },
    ],
    dialogueSamples: [
      { id: 'd-sd5-1', speaker: 'Aisyah', text: 'What is your dream job, Fatima?', translation: 'Apa pekerjaan impianmu, Fatima?' },
      { id: 'd-sd5-2', speaker: 'Fatima', text: 'I want to be an agricultural engineer to grow lush organic farms!', translation: 'Aku ingin menjadi insinyur pertanian untuk menumbuhkan kebun organik yang subur!' },
    ],
    keyPoints: ['Berdiri tegak dan tatap teman-teman sekelas dengan senyuman hangat.', 'Sampaikan alasan mengapa hobimu bermanfaat.'],
    tips: ['Gunakan intonasi yang jelas saat menyebutkan cita-citamu.'],
    updatedAt: '2026-01-11T10:00:00Z',
  });

  const qBank_sd5 = [
    { q: 'What do we call an activity that we enjoy doing in our spare time?', a: 'Hobby', b: 'Exam', c: 'Accident', d: 'Homework', correct: 'A' as const, exp: 'Kegiatan menyenangkan di waktu luang disebut hobi (Hobby).' },
    { q: 'A person who studies plants and cares for nature is an: ___', a: 'environmental scientist', b: 'pilot', c: 'mechanic', d: 'cashier', correct: 'A' as const, exp: 'Ilmuwan lingkungan (environmental scientist) meneliti dan menjaga alam.' },
    { q: 'When speaking in front of the class, our voice should be: ___', a: 'clear and loud enough to hear', b: 'whispering silently', c: 'screaming angrily', d: 'mumbling', correct: 'A' as const, exp: 'Suara saat presentasi harus jelas dan terdengar baik (clear).' },
    { q: 'Which hobby helps develop strength and concentration as recommended in Sunnah?', a: 'Archery / Swimming / Horse riding', b: 'Playing video games all day', c: 'Sleeping excessively', d: 'Eating junk food', correct: 'A' as const, exp: 'Memanah, berenang, dan berkuda adalah olahraga sunnah yang melatih fokus.' },
    { q: '"I want to become a teacher because I want to ___ knowledge."', a: 'share and teach', b: 'hide', c: 'forget', d: 'destroy', correct: 'A' as const, exp: 'Guru menyebarkan dan mengajarkan ilmu pengetahuan (share and teach).' },
    { q: 'Good posture during a presentation means standing: ___', a: 'straight and confident', b: 'slouched with head down', c: 'with back turned to audience', d: 'laying on the desk', correct: 'A' as const, exp: 'Berdiri tegak dan percaya diri (straight and confident).' },
    { q: 'Why is reading books considered one of the best hobbies?', a: 'It broadens our mind and knowledge', b: 'It wastes our paper', c: 'It makes us lazy', d: 'It is boring', correct: 'A' as const, exp: 'Membaca buku memperluas wawasan dan ilmu pengetahuan.' },
    { q: 'How should you open your short speech politely?', a: 'Assalamu’alaikum and good morning everyone', b: 'Listen to me now!', c: 'I am the boss here', d: 'Be quiet fools', correct: 'A' as const, exp: 'Buka pidato dengan salam penghormatan yang santun.' },
    { q: 'Someone whose profession is curing sick people is a: ___', a: 'doctor', b: 'carpenter', c: 'driver', d: 'painter', correct: 'A' as const, exp: 'Dokter (doctor) merawat dan menyembuhkan orang sakit.' },
    { q: 'Practicing speaking in English with friends helps build: ___', a: 'confidence and fluency', b: 'fear', c: 'forgetfulness', d: 'shyness', correct: 'A' as const, exp: 'Berlatih berbicara membangun rasa percaya diri dan kelancaran.' },
  ];
  questions.push(...create30Questions(t_sd5.id, 'sd-5', 'speech', qBank_sd5));

  // ==========================================
  // 8. SD Level 6 - Dialogue: Nature Camping & Graduation Memories
  // ==========================================
  const t_sd6: Topic = {
    id: 'topic-sd6-dial-camping',
    levelId: 'sd-6',
    categoryId: 'dialogue',
    title: 'Nature Camping Adventure & School Memories',
    theme: 'Outdoor Survival, Teamwork & Graduation at Sekolah Alam',
    description: 'Percakapan mempersiapkan tenda kemah, menyusuri sungai jernih, dan mengenang kenangan indah selama di SD.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-11T11:00:00Z',
    updatedAt: '2026-01-11T11:00:00Z',
  };
  topics.push(t_sd6);

  materials.push({
    id: 'mat-sd6-dial-camping',
    topicId: t_sd6.id,
    summary: 'Percakapan petualangan berkemah di alam terbuka dan mengenang masa-masa belajar bersama.',
    contentMarkdown: `### ⛺ Petualangan Berkemah (Camping Adventure)
* **Tent** : Tenda kemah
* **Sleeping Bag** : Kantong tidur hangat
* **Flashlight** : Senter penerang
* **Compass** : Kompas penunjuk arah
* **Campfire** : Api unggun malam

---

### 🎓 Kenangan Kelulusan (Graduation Farewell)
* *Thank you teachers for guiding us with love and patience.*
* *We will always remember our joyful days at Sekolah Alam Al-Karim.*`,
    vocabularyList: [
      { id: 'v-sd6-1', word: 'Cooperation', phonetic: '/koʊˌɑː.pəˈreɪ.ʃən/', partOfSpeech: 'Noun', meaning: 'Kerjasama / Gotong royong', example: 'Pitching a tent requires cooperation.', exampleTranslation: 'Mendirikan tenda memerlukan kerjasama.' },
      { id: 'v-sd6-2', word: 'Memorable', phonetic: '/ˈmɛm.ər.ə.bəl/', partOfSpeech: 'Adj', meaning: 'Mengesankan / Tak terlupakan', example: 'Camping was a memorable event.', exampleTranslation: 'Berkemah adalah acara yang sangat berkesan.' },
    ],
    dialogueSamples: [
      { id: 'd-sd6-1', speaker: 'Zaid', text: 'Have you packed your flashlight and sleeping bag, Hamza?', translation: 'Apakah kamu sudah mengemas senter dan kantong tidurmu, Hamza?' },
      { id: 'd-sd6-2', speaker: 'Hamza', text: 'Yes, everything is packed in my rucksack. Let’s help the teachers pitch the main tent!', translation: 'Ya, semuanya sudah masuk ransel. Ayo kita bantu guru mendirikan tenda utama!' },
    ],
    keyPoints: ['Jaga kelestarian alam: Jangan tinggalkan sampah apapun saat berkemah.', 'Utamakan keselamatan dan saling tolong-menolong.'],
    tips: ['Selalu bawa jas hujan dan kotak P3K saat kegiatan alam bebas.'],
    updatedAt: '2026-01-11T11:00:00Z',
  });

  const qBank_sd6 = [
    { q: 'What portable shelter do campers sleep in outdoors?', a: 'Tent', b: 'Skyscraper', c: 'Car', d: 'Bridge', correct: 'A' as const, exp: 'Tenda (Tent) adalah tempat berteduh saat berkemah.' },
    { q: 'What tool helps campers find north, south, east, and west?', a: 'Compass', b: 'Ruler', c: 'Thermometer', d: 'Scale', correct: 'A' as const, exp: 'Kompas (Compass) menunjukkan arah mata angin.' },
    { q: 'When we finish camping in the forest, we must ___ all our trash.', a: 'collect and take back', b: 'throw into the river', c: 'bury in the ground', d: 'burn trees', correct: 'A' as const, exp: 'Kita wajib mengumpulkan dan membawa pulang semua sampah (Leave No Trace).' },
    { q: 'What warm bedding do campers use inside the tent?', a: 'Sleeping bag', b: 'Dining table', c: 'Wooden chair', d: 'Metal bench', correct: 'A' as const, exp: 'Kantong tidur (Sleeping bag) memberi kehangatan saat tidur di alam.' },
    { q: 'Working together harmoniously as a team is called: ___', a: 'teamwork / cooperation', b: 'fighting', c: 'arguing', d: 'cheating', correct: 'A' as const, exp: 'Kerjasama tim disebut teamwork/cooperation.' },
    { q: 'A portable battery light used at night in camp is a: ___', a: 'flashlight / torch', b: 'candle on wind', c: 'tv screen', d: 'mirror', correct: 'A' as const, exp: 'Senter (Flashlight) digunakan untuk penerangan malam hari.' },
    { q: 'What do students express to their beloved teachers at graduation?', a: 'Deep gratitude and respect', b: 'Complaints', c: 'Anger', d: 'Silence', correct: 'A' as const, exp: 'Rasa terima kasih yang mendalam atas bimbingan guru.' },
    { q: 'Where do we hike to observe lush biodiversity in Sekolah Alam?', a: 'The school botanical forest and herbal garden', b: 'The highway', c: 'The airport runway', d: 'The cinema', correct: 'A' as const, exp: 'Hutan edukasi dan kebun herbal sekolah alam.' },
    { q: '"Farewell" is another word for: ___', a: 'Goodbye / Parting wishing well', b: 'Welcome', c: 'Good morning', d: 'Come here', correct: 'A' as const, exp: '"Farewell" adalah ucapan perpisahan yang penuh doa kebaikan.' },
    { q: 'Which value is most central to the Sekolah Alam philosophy?', a: 'Love for nature, strong faith, and noble character', b: 'Laziness', c: 'Wasting resources', d: 'Polluting rivers', correct: 'A' as const, exp: 'Cinta alam, keimanan yang kokoh, dan akhlak mulia.' },
  ];
  questions.push(...create30Questions(t_sd6.id, 'sd-6', 'dialogue', qBank_sd6));

  // ==========================================
  // 9. SMP Level 7 - Grammar: Simple Present Tense
  // ==========================================
  const t_smp7: Topic = {
    id: 'topic-smp7-grammar-present',
    levelId: 'smp-7',
    categoryId: 'grammar',
    title: 'Simple Present Tense: Daily Habits & Nature Facts',
    theme: 'Daily Routine & Science Exploration at Sekolah Alam Al-Karim',
    description: 'Pola kalimat waktu sekarang untuk menyatakan rutinitas harian, fakta sains alam, dan jadwal kegiatan sekolah.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z',
  };
  topics.push(t_smp7);

  materials.push({
    id: 'mat-smp7-grammar-present',
    topicId: t_smp7.id,
    summary: 'Simple Present Tense digunakan untuk habitual actions (kebiasaan) dan general truth (fakta umum).',
    contentMarkdown: `### 1. Pengertian Simple Present Tense
Simple Present Tense digunakan dalam 3 kondisi utama:
1. **Habitual Action:** Kebiasaan berulang (*I pray Subuh at 04.45 every morning*).
2. **General Truth / Science Fact:** Fakta ilmiah (*The earth revolves around the sun*).
3. **Fixed Schedule:** Jadwal tetap (*The morning assembly starts at 07.30 AM*).

---

### 2. Rumus Verbal Sentence
* **(+) Positif:**
  * \`Subject (I/You/We/They) + Verb 1 + Object\` -> *We plant organic trees.*
  * \`Subject (He/She/It/Nama Tunggal) + Verb 1 (-s/-es) + Object\` -> *Ahmad waters the green plants.*
* **(-) Negatif:**
  * \`Subject + do not (don't) + Verb 1\` -> *They don't waste water.*
  * \`Subject + does not (doesn't) + Verb 1\` -> *He doesn't arrive late.*
* **(?) Tanya:**
  * \`Do/Does + Subject + Verb 1 ... ?\` -> *Do you read the Holy Quran daily?*`,
    vocabularyList: [
      { id: 'v-gr1', word: 'Habit', phonetic: '/ˈhæb.ɪt/', partOfSpeech: 'Noun', meaning: 'Kebiasaan harian', example: 'Waking up early is a good habit.', exampleTranslation: 'Bangun pagi adalah kebiasaan baik.' },
      { id: 'v-gr2', word: 'Usually', phonetic: '/ˈjuː.ʒu.ə.li/', partOfSpeech: 'Adverb', meaning: 'Biasanya', example: 'We usually hold outdoor discussions.', exampleTranslation: 'Kami biasanya mengadakan diskusi luar ruangan.' },
      { id: 'v-gr3', word: 'Cultivate', phonetic: '/ˈkʌl.tɪ.veɪt/', partOfSpeech: 'Verb', meaning: 'Menanam / Mengolah kebun', example: 'Students cultivate vegetables.', exampleTranslation: 'Siswa menanam sayuran.' },
    ],
    dialogueSamples: [
      { id: 'd-gr1', speaker: 'Farhan', text: 'Assalamu’alaikum Bilal, what time do you usually wake up?', translation: 'Assalamu’alaikum Bilal, jam berapa biasanya kamu bangun?' },
      { id: 'd-gr2', speaker: 'Bilal', text: 'Wa’alaikumussalam. I always wake up at 04.30 AM for morning prayer.', translation: 'Wa’alaikumussalam. Saya selalu bangun jam 04.30 untuk shalat subuh.' },
    ],
    keyPoints: ['Subjek He, She, It menggunakan Verb + s/es.', 'Pada kalimat negatif dan tanya, kata kerja kembali ke Verb 1 dasar.'],
    tips: ['Kata kerja berakhiran ch, sh, ss, x, o ditambah -es (misal: watch -> watches, go -> goes).'],
    updatedAt: '2026-01-10T09:00:00Z',
  });

  const qBank_smp7_gr = [
    { q: 'She ___ to Sekolah Alam Al-Karim by bicycle every morning.', a: 'goes', b: 'go', c: 'going', d: 'gone', correct: 'A' as const, exp: 'Subjek "She" adalah orang ketiga tunggal, sehingga "go" ditambah -es menjadi "goes".' },
    { q: 'They ___ football on the school field every Friday afternoon.', a: 'play', b: 'plays', c: 'playing', d: 'played', correct: 'A' as const, exp: 'Subjek jamak "They" menggunakan kata kerja bentuk dasar "play".' },
    { q: 'The sun ___ in the east and sets in the west.', a: 'rises', b: 'rise', c: 'rising', d: 'rose', correct: 'A' as const, exp: 'Kebenaran umum (General truth) dengan subjek tunggal "The sun" menggunakan "rises".' },
    { q: 'Zaid ___ not like throwing trash into the river.', a: 'does', b: 'do', c: 'is', d: 'are', correct: 'A' as const, exp: 'Bentuk negatif untuk subjek tunggal Zaid menggunakan auxiliary "does not".' },
    { q: 'Do you ___ the Holy Quran after Maghrib prayer?', a: 'recite', b: 'recites', c: 'recited', d: 'reciting', correct: 'A' as const, exp: 'Setelah kata bantu tanya "Do", gunakan kata kerja dasar "recite".' },
    { q: 'Water ___ at 100 degrees Celsius.', a: 'boils', b: 'boil', c: 'boiled', d: 'boiling', correct: 'A' as const, exp: 'Fakta ilmiah menggunakan Simple Present Tense: Water + boils.' },
    { q: 'Aisyah and Maryam ___ English vocabulary diligently.', a: 'memorize', b: 'memorizes', c: 'memorizing', d: 'memorized', correct: 'A' as const, exp: 'Subjek jamak (Aisyah and Maryam / They) menggunakan "memorize".' },
    { q: 'He ___ his beloved cat every morning before breakfast.', a: 'feeds', b: 'feed', c: 'feeding', d: 'fed', correct: 'A' as const, exp: 'Subjek "He" memerlukan tambahan -s -> "feeds".' },
    { q: 'We don’t ___ wasteful habits in our environmental project.', a: 'support', b: 'supports', c: 'supporting', d: 'supported', correct: 'A' as const, exp: 'Setelah "don\'t", kata kerja kembali ke bentuk asal "support".' },
    { q: 'How often ___ you water the organic garden?', a: 'do', b: 'does', c: 'is', d: 'are', correct: 'A' as const, exp: 'Subjek "you" berpasangan dengan kata bantu "do".' },
  ];
  questions.push(...create30Questions(t_smp7.id, 'smp-7', 'grammar', qBank_smp7_gr));

  // ==========================================
  // 10. SMP Level 8 - Dialogue: Recounting Experiences & Past Events
  // ==========================================
  const t_smp8: Topic = {
    id: 'topic-smp8-dial-past',
    levelId: 'smp-8',
    categoryId: 'dialogue',
    title: 'Recounting Past Expeditions & Nature Camp',
    theme: 'Experiential Learning & Scientific Field Trips',
    description: 'Menceritakan kembali pengalaman masa lalu, ekspedisi hutan, dan observasi ekosistem air tawar.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-11T12:00:00Z',
    updatedAt: '2026-01-11T12:00:00Z',
  };
  topics.push(t_smp8);

  materials.push({
    id: 'mat-smp8-dial-past',
    topicId: t_smp8.id,
    summary: 'Mempelajari cara menceritakan peristiwa lampau (Simple Past Tense) dalam percakapan dua arah.',
    contentMarkdown: `### 🏕️ Menceritakan Pengalaman Masa Lalu
Gunakan kata kerja bentuk kedua (Verb 2):
* *Last week, our class visited the national botanical garden.*
* *We observed rare medicinal herbs and collected water samples.*
* *What did you do during the weekend?*
* *I planted ten mahogany seedlings near the riverbank.*`,
    vocabularyList: [
      { id: 'v-smp8-1', word: 'Expedition', phonetic: '/ˌɛk.spəˈdɪʃ.ən/', partOfSpeech: 'Noun', meaning: 'Ekspedisi / Penjelajahan', example: 'The biology expedition was fascinating.', exampleTranslation: 'Ekspedisi biologi itu sangat menarik.' },
      { id: 'v-smp8-2', word: 'Observed', phonetic: '/əbˈzɜːrvd/', partOfSpeech: 'Verb (Past)', meaning: 'Mengamati', example: 'We observed water organisms.', exampleTranslation: 'Kami mengamati organisme air.' },
    ],
    dialogueSamples: [
      { id: 'd-smp8-1', speaker: 'Salim', text: 'How was your nature expedition yesterday, Faris?', translation: 'Bagaimana ekspedisi alammu kemarin, Faris?' },
      { id: 'd-smp8-2', speaker: 'Faris', text: 'It was breathtaking! We explored the mangrove forest and learned about coastal protection.', translation: 'Sangat menakjubkan! Kami menjelajahi hutan mangrove dan belajar tentang perlindungan pantai.' },
    ],
    keyPoints: ['Gunakan penanda waktu lampau: yesterday, last week, two days ago.', 'Gunakan auxiliary "did" untuk kalimat tanya lampau.'],
    tips: ['Ingat perubahan regular verbs (-ed) dan irregular verbs (go -> went, see -> saw).'],
    updatedAt: '2026-01-11T12:00:00Z',
  });

  const qBank_smp8 = [
    { q: 'Last Sunday, our class ___ an organic farm in the valley.', a: 'visited', b: 'visit', c: 'visiting', d: 'visits', correct: 'A' as const, exp: 'Penanda waktu "Last Sunday" membutuhkan Verb 2 -> "visited".' },
    { q: 'Where did you ___ when the rain started pouring?', a: 'take shelter', b: 'took shelter', c: 'taken shelter', d: 'taking shelter', correct: 'A' as const, exp: 'Setelah auxiliary "did", kata kerja kembali ke bentuk Verb 1 dasar.' },
    { q: 'We ___ many colorful birds in the canopy during our morning trek.', a: 'saw', b: 'see', c: 'seen', d: 'seeing', correct: 'A' as const, exp: 'Bentuk lampau irregular dari "see" adalah "saw".' },
    { q: 'I ___ not join the camping last month because I was sick.', a: 'did', b: 'do', c: 'does', d: 'am', correct: 'A' as const, exp: 'Bentuk negatif lampau menggunakan "did not".' },
    { q: '"How was your weekend trip?" What is the best answer?', a: 'It was wonderful and inspiring!', b: 'I am playing now', c: 'I will go tomorrow', d: 'No thank you', correct: 'A' as const, exp: '"It was wonderful and inspiring!" merespon pertanyaan tentang pengalaman lalu.' },
    { q: 'They ___ their tent before sunset yesterday.', a: 'pitched', b: 'pitch', c: 'pitching', d: 'pitches', correct: 'A' as const, exp: 'Bentuk lampau dari "pitch" adalah "pitched".' },
    { q: 'What is the past form (Verb 2) of the verb "go"?', a: 'Went', b: 'Gone', c: 'Going', d: 'Goes', correct: 'A' as const, exp: 'Verb 2 dari "go" adalah "went".' },
    { q: 'What is the past form (Verb 2) of the verb "buy"?', a: 'Bought', b: 'Buyed', c: 'Buying', d: 'Buys', correct: 'A' as const, exp: 'Verb 2 dari "buy" adalah "bought".' },
    { q: 'A recount text tells the reader about: ___', a: 'past events and personal experiences', b: 'how to operate a machine', c: 'imaginary fairytale monsters', d: 'scientific future predictions', correct: 'A' as const, exp: 'Recount text menceritakan peristiwa masa lalu yang dialami penulis.' },
    { q: 'Which conjunction is commonly used to sequence past events?', a: 'First, Then, After that, Finally', b: 'Because, Although', c: 'If, Unless', d: 'Or, Nor', correct: 'A' as const, exp: 'Urutan kronologis menggunakan First, Then, After that, Finally.' },
  ];
  questions.push(...create30Questions(t_smp8.id, 'smp-8', 'dialogue', qBank_smp8));

  // ==========================================
  // 11. SMP Level 9 - Grammar: Expressing Hopes, Wishes & Passive Voice
  // ==========================================
  const t_smp9: Topic = {
    id: 'topic-smp9-grammar-hopes',
    levelId: 'smp-9',
    categoryId: 'grammar',
    title: 'Expressing Hopes, Wishes & Passive Voice',
    theme: 'Academic Excellence & Environmental Solutions',
    description: 'Mengungkapkan harapan dan doa keberkahan (Hopes & Wishes) serta pola kalimat pasif dalam laporan ilmiah.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-11T13:00:00Z',
    updatedAt: '2026-01-11T13:00:00Z',
  };
  topics.push(t_smp9);

  materials.push({
    id: 'mat-smp9-grammar-hopes',
    topicId: t_smp9.id,
    summary: 'Ungkapan harapan (Hope/Wish) dan struktur Passive Voice (Subject + to be + Verb 3).',
    contentMarkdown: `### 1. Expressing Hopes & Wishes
* *I hope you win the National Science Olympiad!*
* *May Allah bless your graduation journey with success and wisdom.*
* *Congratulations on winning first place in the speech contest!*

---

### 2. Passive Voice Structure
Struktur Kalimat Pasif: \`Subject + to be + Verb 3 (Past Participle) + (by Agent)\`
* Active: *Students collect plastic bottles.*
* Passive: *Plastic bottles **are collected** by students.*
* Active: *The teacher planted mahogany trees.*
* Passive: *Mahogany trees **were planted** by the teacher.*`,
    vocabularyList: [
      { id: 'v-smp9-1', word: 'Congratulate', phonetic: '/kənˈɡrætʃ.ə.leɪt/', partOfSpeech: 'Verb', meaning: 'Memberi selamat', example: 'We congratulate him on his award.', exampleTranslation: 'Kami mengucapkan selamat atas penghargaannya.' },
      { id: 'v-smp9-2', word: 'Conducted', phonetic: '/kənˈdʌk.tɪd/', partOfSpeech: 'Verb (V3)', meaning: 'Dilaksanakan / Dijalankan', example: 'The research was conducted properly.', exampleTranslation: 'Penelitian tersebut telah dilaksanakan dengan baik.' },
    ],
    dialogueSamples: [
      { id: 'd-smp9-1', speaker: 'Luqman', text: 'Alhamdulillah, our robotic project won gold medal!', translation: 'Alhamdulillah, proyek robotik kita meraih medali emas!' },
      { id: 'd-smp9-2', speaker: 'Ilyas', text: 'Barakallahu feek! I hope your innovation can help Indonesian farmers!', translation: 'Barakallahu feek! Saya berharap inovasimu bisa membantu petani Indonesia!' },
    ],
    keyPoints: ['Gunakan "hope" untuk harapan yang realistis dan mungkin terjadi.', 'Passive Voice fokus pada objek/hasil tindakan.'],
    tips: ['Pastikan penggunaan To Be (is/am/are/was/were) sesuai dengan subjek kalimat pasif.'],
    updatedAt: '2026-01-11T13:00:00Z',
  });

  const qBank_smp9 = [
    { q: 'The organic garden ___ watered by the students every afternoon.', a: 'is', b: 'are', c: 'were', d: 'been', correct: 'A' as const, exp: 'Subjek tunggal "The organic garden" dalam present passive menggunakan "is".' },
    { q: 'Many rare trees ___ planted by our alumni last year.', a: 'were', b: 'was', c: 'is', d: 'are', correct: 'A' as const, exp: 'Subjek jamak "Many rare trees" dan waktu lampau "last year" menggunakan "were".' },
    { q: '"I hope you pass the exam with flying colors!" What does this express?', a: 'Expressing hope / wish', b: 'Giving warning', c: 'Asking for direction', d: 'Refusing an offer', correct: 'A' as const, exp: 'Kalimat tersebut menyatakan harapan dan doa kesuksesan.' },
    { q: 'The trophy was ___ by the school principal during assembly.', a: 'presented', b: 'present', c: 'presenting', d: 'presents', correct: 'A' as const, exp: 'Pola passive membutuhkan past participle (Verb 3) -> "presented".' },
    { q: 'What is the passive form of: "Ahmad writes a scientific article"?', a: 'A scientific article is written by Ahmad.', b: 'Ahmad is written by article.', c: 'A scientific article wrote Ahmad.', d: 'Ahmad was writing article.', correct: 'A' as const, exp: 'Objek "A scientific article" menjadi subjek pasif + is + written.' },
    { q: 'What do we say when our friend achieves great success?', a: 'Congratulations! Barakallahu feek!', b: 'I am so sorry for you', c: 'Please stop doing that', d: 'Never mind', correct: 'A' as const, exp: 'Ucapkan selamat dan berkah: "Congratulations! Barakallahu feek!".' },
    { q: 'The recycling bins ___ placed near the school cafeteria.', a: 'are', b: 'is', c: 'was', d: 'being', correct: 'A' as const, exp: 'Subjek jamak "bins" menggunakan "are".' },
    { q: '"May Allah grant you easy journey and good health." This sentence is a ___', a: 'prayer / blessing wish', b: 'command', c: 'threat', d: 'scientific law', correct: 'A' as const, exp: 'Kalimat tersebut merupakan doa kebaikan dan keberkahan.' },
    { q: 'The research paper has ___ published in an international journal.', a: 'been', b: 'being', c: 'be', d: 'was', correct: 'A' as const, exp: 'Present Perfect Passive: "has been + Verb 3".' },
    { q: 'Clean water is ___ by all living creatures on Earth.', a: 'needed', b: 'need', c: 'needing', d: 'needs', correct: 'A' as const, exp: 'Passive voice: "is needed" (dibutuhkan).' },
  ];
  questions.push(...create30Questions(t_smp9.id, 'smp-9', 'grammar', qBank_smp9));

  // ==========================================
  // 12. SMA Level 10 - Speech: Public Speaking & Leadership
  // ==========================================
  const t_sma10: Topic = {
    id: 'topic-sma10-speech-intro',
    levelId: 'sma-10',
    categoryId: 'speech',
    title: 'Formal Self-Introduction & Youth Leadership Speech',
    theme: 'Empowering Young Environmental Leaders at Al-Karim High School',
    description: 'Menyusun teks pidato pembuka, intonasi berbicara di depan umum, gestur percaya diri, dan retorika persuasif.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-12T08:00:00Z',
  };
  topics.push(t_sma10);

  materials.push({
    id: 'mat-sma10-speech-intro',
    topicId: t_sma10.id,
    summary: 'Struktur pidato formal: Salutation, Hook, Body Paragraphs, Call to Action, and Inspiring Conclusion.',
    contentMarkdown: `### 1. The 4 Pillars of a Great Speech
* **A. The Opening (Hook & Salutation):**
  * *Honorable teachers, respected guests, and my beloved fellow students.*
  * *Assalamu’alaikum Warahmatullahi Wabarakatuh.*
  * Gunakan kalimat pembuka yang memikat (*hook*): *Have you ever wondered what our earth will look like in 50 years?*
* **B. The Body (Core Message & Evidence):**
  * Sampaikan 2-3 poin utama dengan data dan analogi yang kuat.
* **C. The Call to Action (Ajakan Nyata):**
  * Ajak audiens untuk bertindak nyata (*Let us start today by planting one tree at a time*).
* **D. The Conclusion & Parting Words:**
  * *Thank you very much for your kind attention. Wassalamu’alaikum Warahmatullahi Wabarakatuh.*`,
    vocabularyList: [
      { id: 'v-sp1', word: 'Salutation', phonetic: '/ˌsæl.jəˈteɪ.ʃən/', partOfSpeech: 'Noun', meaning: 'Salam pembuka penghormatan', example: 'A formal speech begins with a respectful salutation.', exampleTranslation: 'Pidato resmi diawali dengan salam pembuka.' },
      { id: 'v-sp2', word: 'Persuasive', phonetic: '/pərˈsweɪ.sɪv/', partOfSpeech: 'Adj', meaning: 'Bersifat meyakinkan/mengajak', example: 'She delivered a highly persuasive argument.', exampleTranslation: 'Dia menyampaikan argumen yang sangat persuasif.' },
      { id: 'v-sp3', word: 'Audience', phonetic: '/ˈɔː.di.əns/', partOfSpeech: 'Noun', meaning: 'Hadirin / Pendengar', example: 'The audience listened attentively.', exampleTranslation: 'Para hadirin menyimak dengan penuh perhatian.' },
    ],
    dialogueSamples: [
      { id: 'd-sp1', speaker: 'Rafi', text: 'Good morning everyone. Today, I stand before you to talk about youth sustainability.', translation: 'Selamat pagi semuanya. Hari ini, saya berdiri di hadapan Anda untuk berbicara tentang keberlanjutan pemuda.' },
    ],
    keyPoints: ['Pertahankan kontak mata dengan audiens di seluruh ruangan.', 'Gunakan jeda intonasi (pause) untuk memberi penekanan pada poin penting.'],
    tips: ['Latihlah artikulasi vokal dan pernapasan diafragma sebelum naik ke atas panggung.'],
    updatedAt: '2026-01-12T08:00:00Z',
  });

  const qBank_sma10_sp = [
    { q: 'What is the primary purpose of the opening hook in a speech?', a: 'To capture the audience\'s curiosity and attention', b: 'To confuse the listeners', c: 'To say goodbye immediately', d: 'To ask for donations', correct: 'A' as const, exp: 'Fungsi utama hook adalah memikat rasa ingin tahu dan atensi audiens.' },
    { q: 'How should a formal speech to school members begin?', a: 'With respectful salutation to teachers and peers', b: 'By shouting angrily', c: 'By whispering silently', d: 'By reading a dictionary', correct: 'A' as const, exp: 'Pidato formal dibuka dengan salam penghormatan yang santun kepada hadirin.' },
    { q: 'What is a "Call to Action" in public speaking?', a: 'An invitation urging listeners to take specific positive steps', b: 'Making a phone call on stage', c: 'Asking people to leave the room', d: 'Taking a lunch break', correct: 'A' as const, exp: 'Call to action adalah ajakan nyata kepada pendengar untuk melakukan tindakan positif.' },
    { q: 'Maintaining eye contact during speech delivery helps to ___', a: 'build trust and authentic connection with audience', b: 'make the audience nervous', c: 'forget the speech script', d: 'look at the ceiling', correct: 'A' as const, exp: 'Kontak mata membangun rasa percaya dan koneksi emosional dengan audiens.' },
    { q: 'Which tone is most suitable for an inspiring youth leadership speech?', a: 'Confident, enthusiastic, and respectful', b: 'Bored and monotonous', c: 'Aggressive and mocking', d: 'Indifferent', correct: 'A' as const, exp: 'Nada yang percaya diri, antusias, dan santun paling tepat untuk kepemimpinan pemuda.' },
    { q: 'Why is vocal pausing (jeda) important during a presentation?', a: 'To emphasize key points and allow ideas to resonate', b: 'To waste presentation time', c: 'Because the speaker fell asleep', d: 'To create awkward silence', correct: 'A' as const, exp: 'Jeda vokal memberi penekanan mendalam pada poin krusial pidato.' },
    { q: 'What should you do if you experience stage fright before speaking?', a: 'Practice deep breathing and positive visualization', b: 'Run away from school', c: 'Speak as fast as possible without breathing', d: 'Stay silent on stage', correct: 'A' as const, exp: 'Tarik napas dalam dan visualisasi positif meredakan demam panggung.' },
    { q: '"Honorable teachers and my dear friends..." is an example of ___', a: 'Formal salutation', b: 'Concluding remark', c: 'Body evidence', d: 'Grammar quiz', correct: 'A' as const, exp: 'Kalimat tersebut adalah salam penghormatan (Formal salutation).' },
    { q: 'A good conclusion should summarize the core message and leave a ___', a: 'lasting inspirational impression', b: 'confusing ending', c: 'blank slide', d: 'harsh complaint', correct: 'A' as const, exp: 'Kesimpulan yang kuat meninggalkan kesan inspiratif yang mendalam.' },
    { q: 'Body language in public speaking should be ___', a: 'open, natural, and expressive', b: 'rigid with arms crossed tightly', c: 'turned with back to the audience', d: 'hiding behind the podium', correct: 'A' as const, exp: 'Bahasa tubuh harus terbuka, wajar, dan mendukung pesan yang disampaikan.' },
  ];
  questions.push(...create30Questions(t_sma10.id, 'sma-10', 'speech', qBank_sma10_sp));

  // ==========================================
  // 13. SMA Level 11 - Dialogue: Analytical Exposition & Debates
  // ==========================================
  const t_sma11: Topic = {
    id: 'topic-sma11-dial-debate',
    levelId: 'sma-11',
    categoryId: 'dialogue',
    title: 'Analytical Exposition: Environmental Debates',
    theme: 'Renewable Energy, Climate Action & Islamic Stewardship',
    description: 'Percakapan debat kritis tentang transisi energi terbarukan, pengurangan jejak karbon, dan amanah khalifah fil ardh.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-12T09:00:00Z',
    updatedAt: '2026-01-12T09:00:00Z',
  };
  topics.push(t_sma11);

  materials.push({
    id: 'mat-sma11-dial-debate',
    topicId: t_sma11.id,
    summary: 'Menyusun argumen analitis dan sanggahan santun dalam debat formal bahasa Inggris.',
    contentMarkdown: `### 🌍 Debat Kritis Energi Terbarukan
* **Agreeing Politely:** *I completely agree with your point because empirical data shows solar energy costs have dropped.*
* **Disagreeing with Respect:** *I see your perspective, however, we must also consider the initial infrastructure investment.*
* **Citing Evidence:** *According to recent environmental research, mangrove restoration absorbs four times more carbon than terrestrial forests.*`,
    vocabularyList: [
      { id: 'v-sma11-1', word: 'Renewable', phonetic: '/rɪˈnjuː.ə.bəl/', partOfSpeech: 'Adj', meaning: 'Terbarukan / Berkelanjutan', example: 'Solar and wind are renewable energy sources.', exampleTranslation: 'Matahari dan angin adalah sumber energi terbarukan.' },
      { id: 'v-sma11-2', word: 'Perspective', phonetic: '/pərˈspɛk.tɪv/', partOfSpeech: 'Noun', meaning: 'Sudut pandang', example: 'From an economic perspective, sustainability saves money.', exampleTranslation: 'Dari sudut pandang ekonomi, keberlanjutan menghemat biaya.' },
    ],
    dialogueSamples: [
      { id: 'd-sma11-1', speaker: 'Nadia', text: 'In my opinion, single-use plastics should be banned in all educational institutions.', translation: 'Menurut pendapat saya, plastik sekali pakai harus dilarang di semua lembaga pendidikan.' },
      { id: 'd-sma11-2', speaker: 'Rayhan', text: 'I strongly support that motion. In fact, our school zero-waste initiative has proven it is achievable.', translation: 'Saya sangat mendukung mosi tersebut. Bahkan, inisiatif zero-waste sekolah kita membuktikan hal itu dapat tercapai.' },
    ],
    keyPoints: ['Dukung setiap opini dengan fakta ilmiah dan penalaran logis.', 'Hormati argumen lawan bicara tanpa menyerang personal.'],
    tips: ['Gunakan connectors logis seperti: Furthermore, Consequently, In contrast, Nonetheless.'],
    updatedAt: '2026-01-12T09:00:00Z',
  });

  const qBank_sma11 = [
    { q: 'An analytical exposition text aims to: ___', a: 'persuade the reader that an issue is an important matter', b: 'entertain the reader with fairy tales', c: 'provide step-by-step cooking recipes', d: 'describe someone\'s face', correct: 'A' as const, exp: 'Analytical exposition bertujuan meyakinkan pembaca bahwa suatu isu sangat penting.' },
    { q: '"I see your point, however..." is a polite phrase used to: ___', a: 'partially disagree with a counterargument', b: 'shout at someone', c: 'agree completely without thinking', d: 'leave the meeting', correct: 'A' as const, exp: 'Ungkapan sanggahan yang santun (polite disagreement).' },
    { q: 'Which energy source is 100% renewable and emission-free?', a: 'Solar and wind power', b: 'Coal power', c: 'Diesel generator', d: 'Crude petroleum', correct: 'A' as const, exp: 'Energi surya dan angin adalah energi terbarukan ramah lingkungan.' },
    { q: 'What is the role of human beings towards Earth as stated in Islamic philosophy?', a: 'Khalifah (stewards/guardians of Earth)', b: 'Destructors', c: 'Passive spectators', d: 'Exploiters without limit', correct: 'A' as const, exp: 'Manusia diciptakan sebagai khalifah (penjaga dan pemakmur bumi).' },
    { q: 'Which transition phrase shows contrast between two ideas?', a: 'On the other hand / In contrast', b: 'Furthermore', c: 'In addition', d: 'Similarly', correct: 'A' as const, exp: '"On the other hand" dan "In contrast" menunjukkan kontras/perbedaan.' },
    { q: 'A strong debate rebuttal should always be supported by: ___', a: 'verified empirical facts and logical reasoning', b: 'personal insults', c: 'false rumors', d: 'emotional shouting', correct: 'A' as const, exp: 'Sanggahan yang kuat ditopang oleh data valid dan logika yang runtut.' },
    { q: 'What is the function of the "Thesis" statement in an exposition?', a: 'To introduce the topic and state the author\'s main stance', b: 'To say goodbye', c: 'To list vocabulary', d: 'To tell a joke', correct: 'A' as const, exp: 'Thesis memperkenalkan topik dan menyatakan posisi/argumen utama penulis.' },
    { q: '"Furthermore, deforestation contributes to severe flooding." What does "Furthermore" signal?', a: 'Adding an additional reinforcing argument', b: 'Ending the speech', c: 'Asking a question', d: 'Denying the fact', correct: 'A' as const, exp: '"Furthermore" menambahkan argumen pendukung tambahan.' },
    { q: 'The final paragraph of an analytical exposition that restates the stance is called: ___', a: 'Reiteration / Conclusion', b: 'Orientation', c: 'Complication', d: 'Resolution', correct: 'A' as const, exp: 'Paragraf penutup disebut Reiteration (penegasan kembali).' },
    { q: 'Critical thinking in debates enables students to: ___', a: 'analyze issues objectively from multiple perspectives', b: 'memorize texts blindly', c: 'avoid discussions', d: 'believe everything without evidence', correct: 'A' as const, exp: 'Berpikir kritis memungkinkan analisis objektif dari berbagai sudut pandang.' },
  ];
  questions.push(...create30Questions(t_sma11.id, 'sma-11', 'dialogue', qBank_sma11));

  // ==========================================
  // 14. SMA Level 12 - Grammar: Application Letters & Global Readiness
  // ==========================================
  const t_sma12: Topic = {
    id: 'topic-sma12-grammar-jobapp',
    levelId: 'sma-12',
    categoryId: 'grammar',
    title: 'Application Letters, Resume & Conditional Sentences',
    theme: 'Global Preparedness, University Admissions & Career Readiness',
    description: 'Menulis surat lamaran kerja formal, CV akademik, conditional sentences type 1, 2, 3, dan persiapan wawancara beasiswa.',
    order: 1,
    isPublished: true,
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-12T10:00:00Z',
  };
  topics.push(t_sma12);

  materials.push({
    id: 'mat-sma12-grammar-jobapp',
    topicId: t_sma12.id,
    summary: 'Struktur surat lamaran formal (Cover Letter) dan penguasaan Conditional Sentences.',
    contentMarkdown: `### 1. Formal Application Letter Structure
1. **Header & Contact Info:** Date, Sender Address, Recipient Address.
2. **Salutation:** *Dear Hiring Committee / Dear Prof. Anderson,*
3. **Opening Paragraph:** State the position applied for and source of information.
4. **Body Paragraphs:** Highlight academic achievements, environmental projects, and leadership roles.
5. **Closing Paragraph:** Express readiness for interview and gratitude.
6. **Sign-off:** *Yours sincerely, [Your Name]*

---

### 2. Conditional Sentences Summary
* **Type 1 (Real condition in present/future):**
  * \`If + Simple Present, will + Verb 1\`
  * *If you study hard, you will pass the university entrance test.*
* **Type 2 (Unreal condition in present):**
  * \`If + Simple Past, would + Verb 1\`
  * *If I had a scholarship, I would study environmental engineering in Tokyo.*
* **Type 3 (Unreal condition in past):**
  * \`If + Past Perfect (had + V3), would have + Verb 3\`
  * *If we had preserved the forest, the landslide would not have happened.*`,
    vocabularyList: [
      { id: 'v-sma12-1', word: 'Applicant', phonetic: '/ˈæp.lɪ.kənt/', partOfSpeech: 'Noun', meaning: 'Pelamar / Pendaftar', example: 'She is a qualified scholarship applicant.', exampleTranslation: 'Dia adalah pelamar beasiswa yang berkualifikasi.' },
      { id: 'v-sma12-2', word: 'Competence', phonetic: '/ˈkɑːm.pə.təns/', partOfSpeech: 'Noun', meaning: 'Kompetensi / Keahlian', example: 'Demonstrate leadership competence.', exampleTranslation: 'Tunjukkan kompetensi kepemimpinan.' },
    ],
    dialogueSamples: [
      { id: 'd-sma12-1', speaker: 'Interviewer', text: 'Why are you interested in this renewable energy scholarship?', translation: 'Mengapa Anda tertarik dengan beasiswa energi terbarukan ini?' },
      { id: 'd-sma12-2', speaker: 'Candidate', text: 'I am committed to designing decentralized solar microgrids for rural villages in Sumatra.', translation: 'Saya berkomitmen untuk merancang jaringan mikro surya terdesentralisasi untuk desa-desa terpencil di Sumatera.' },
    ],
    keyPoints: ['Gunakan bahasa formal dan hindari kontraksi (don\'t -> do not) pada surat resmi.', 'Kuasai pola conditional types 1, 2, dan 3 dengan cermat.'],
    tips: ['Tinjau tata bahasa (proofread) dokumen CV dan surat lamaran sebelum dikirim.'],
    updatedAt: '2026-01-12T10:00:00Z',
  });

  const qBank_sma12 = [
    { q: 'If I ___ the scholarship interview tomorrow, I will prepare my presentation slides tonight.', a: 'have', b: 'had', c: 'having', d: 'would have', correct: 'A' as const, exp: 'Conditional Type 1: "If + Simple Present (have), will + Verb 1".' },
    { q: 'If we ___ more solar panels, we would reduce our electricity bill drastically.', a: 'installed', b: 'install', c: 'installing', d: 'have installed', correct: 'A' as const, exp: 'Conditional Type 2: "If + Simple Past (installed), would + Verb 1".' },
    { q: 'If she had submitted the portfolio earlier, she ___ accepted into the university.', a: 'would have been', b: 'will be', c: 'is', d: 'was', correct: 'A' as const, exp: 'Conditional Type 3: "If had + V3, would have been + V3".' },
    { q: 'A formal letter of application is typically concluded with: ___', a: 'Yours sincerely, / Yours faithfully,', b: 'See you later dude,', c: 'Bye bye,', d: 'Cheers mate,', correct: 'A' as const, exp: 'Penutup surat resmi adalah "Yours sincerely," atau "Yours faithfully,".' },
    { q: 'What document summarizes one\'s education, skills, and work experience?', a: 'Curriculum Vitae (CV) / Resume', b: 'Passport only', c: 'Shopping receipt', d: 'Novel', correct: 'A' as const, exp: 'CV/Resume merangkum riwayat pendidikan, keahlian, dan prestasi.' },
    { q: '"I am writing to express my keen interest in..." This sentence belongs to the ___ of a cover letter.', a: 'opening paragraph', b: 'closing signature', c: 'envelope back', d: 'postscript', correct: 'A' as const, exp: 'Kalimat pembuka surat lamaran formal.' },
    { q: 'In a scholarship interview, how should you answer questions about weaknesses?', a: 'Honestly with concrete steps on how you actively work to overcome it', b: 'By blaming other people', c: 'By claiming you are 100% perfect', d: 'By crying loudly', correct: 'A' as const, exp: 'Jawab jujur disertai langkah nyata perbaikan diri.' },
    { q: 'What is the tone required in an academic application letter?', a: 'Formal, concise, respectful, and professional', b: 'Casual and humorous', c: 'Sarcastic', d: 'Demanding and rude', correct: 'A' as const, exp: 'Bahasa resmi, padat, santun, dan profesional.' },
    { q: 'If I were you, I ___ apply for the global student exchange program.', a: 'would', b: 'will', c: 'am', d: 'can', correct: 'A' as const, exp: 'Conditional Type 2 nasihat: "If I were you, I would...".' },
    { q: 'Which salutation is appropriate when the recipient\'s name is known?', a: 'Dear Mr. / Mrs. [Family Name],', b: 'Hi guys,', c: 'To whoever cares,', d: 'Hello there,', correct: 'A' as const, exp: '"Dear Mr./Mrs. [Family Name]" adalah salam penghormatan resmi.' },
  ];
  questions.push(...create30Questions(t_sma12.id, 'sma-12', 'grammar', qBank_sma12));

  // ==========================================
  // Sample Students & Historical Attempts
  // ==========================================
  const students: StudentProfile[] = [
    { id: 'std-1', name: 'Ahmad Fauzan', className: '4A', levelId: 'sd-4', createdAt: '2026-01-15T08:00:00Z', lastActive: '2026-02-20T10:30:00Z' },
    { id: 'std-2', name: 'Fatimah Az-Zahra', className: '4B', levelId: 'sd-4', createdAt: '2026-01-16T08:00:00Z', lastActive: '2026-02-22T09:15:00Z' },
    { id: 'std-3', name: 'Bilal Al-Habasyi', className: '7A', levelId: 'smp-7', createdAt: '2026-01-10T08:00:00Z', lastActive: '2026-02-23T11:00:00Z' },
    { id: 'std-4', name: 'Maryam Qonitah', className: '7B', levelId: 'smp-7', createdAt: '2026-01-11T08:00:00Z', lastActive: '2026-02-23T14:20:00Z' },
    { id: 'std-5', name: 'Zaid bin Tsabit', className: '10 IPA', levelId: 'sma-10', createdAt: '2026-01-12T08:00:00Z', lastActive: '2026-02-23T16:45:00Z' },
    { id: 'std-6', name: 'Aisyah Humaira', className: 'TK B', levelId: 'tk-b', createdAt: '2026-01-18T08:00:00Z', lastActive: '2026-02-23T08:30:00Z' },
    { id: 'std-7', name: 'Rayyan Al-Fatih', className: 'TK A', levelId: 'tk-a', createdAt: '2026-01-19T08:00:00Z', lastActive: '2026-02-23T08:45:00Z' },
    { id: 'std-8', name: 'Muhammad Al-Ghazali', className: 'Kelas 1A', levelId: 'sd-1', createdAt: '2026-01-20T08:00:00Z', lastActive: '2026-02-23T09:00:00Z' },
    { id: 'std-9', name: 'Khairunisa Nabila', className: 'Kelas 4A', levelId: 'sd-4', createdAt: '2026-01-21T08:00:00Z', lastActive: '2026-02-23T09:30:00Z' },
    { id: 'std-10', name: 'Sulaiman Ar-Rasyid', className: 'Kelas 7A', levelId: 'smp-7', createdAt: '2026-01-22T08:00:00Z', lastActive: '2026-02-23T10:15:00Z' },
    { id: 'std-11', name: 'Hafizhah Nurul Izzah', className: 'Kelas 8B', levelId: 'smp-8', createdAt: '2026-01-23T08:00:00Z', lastActive: '2026-02-23T11:20:00Z' },
    { id: 'std-12', name: 'Ibrahim Khalilullah', className: 'Kelas 11 MIPA', levelId: 'sma-11', createdAt: '2026-01-24T08:00:00Z', lastActive: '2026-02-23T13:40:00Z' },
  ];

  const attempts: StudentAttempt[] = [
    {
      id: 'att-1',
      studentId: 'std-1',
      studentName: 'Ahmad Fauzan',
      className: '4A',
      levelId: 'sd-4',
      categoryId: 'vocabulary',
      topicId: t_sd4.id,
      topicTitle: t_sd4.title,
      startedAt: '2026-02-20T10:00:00Z',
      completedAt: '2026-02-20T10:25:00Z',
      totalQuestions: 30,
      score: 93,
      percentage: 93,
      correctCount: 28,
      incorrectCount: 2,
      timeElapsedSec: 1500,
      answers: {},
    },
    {
      id: 'att-2',
      studentId: 'std-3',
      studentName: 'Bilal Al-Habasyi',
      className: '7A',
      levelId: 'smp-7',
      categoryId: 'grammar',
      topicId: t_smp7.id,
      topicTitle: t_smp7.title,
      startedAt: '2026-02-23T10:30:00Z',
      completedAt: '2026-02-23T10:55:00Z',
      totalQuestions: 30,
      score: 90,
      percentage: 90,
      correctCount: 27,
      incorrectCount: 3,
      timeElapsedSec: 1500,
      answers: {},
    },
    {
      id: 'att-3',
      studentId: 'std-5',
      studentName: 'Zaid bin Tsabit',
      className: '10 IPA',
      levelId: 'sma-10',
      categoryId: 'speech',
      topicId: t_sma10.id,
      topicTitle: t_sma10.title,
      startedAt: '2026-02-23T16:15:00Z',
      completedAt: '2026-02-23T16:40:00Z',
      totalQuestions: 30,
      score: 97,
      percentage: 97,
      correctCount: 29,
      incorrectCount: 1,
      timeElapsedSec: 1500,
      answers: {},
    },
  ];

  return {
    levels: INITIAL_LEVELS,
    categories: INITIAL_CATEGORIES,
    users: INITIAL_USERS,
    topics,
    materials,
    questions,
    students,
    attempts,
  };
}
